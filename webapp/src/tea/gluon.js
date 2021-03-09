import _ from 'lodash';
import { stringToHex, stringToU8a, u8aToHex, u8aToString, hexToU8a, promisify, u8aToBuffer, hexToString} from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import forge from 'node-forge';
import axios from 'axios';

import hash from 'js-sha256';

let ERRORS = `
InvalidSig,
	    InvalidNonceSig,
	    InvalidSignatureLength,
	    DelegatorNotExist,
        AccountIdConvertionError,
        InvalidToAccount,
        SenderIsNotBuildInAccount,
        SenderAlreadySigned,
        TransferAssetTaskTimeout,
        BrowserTaskALreadyExist,
        BrowserNonceAlreadyExist,
        AppBrowserPairAlreadyExist,
        NonceNotMatch,
        NonceNotExist,
        TaskNotMatch,
        TaskNotExist,
        KeyGenerationSenderAlreadyExist,
        KeyGenerationSenderNotExist,
        KeyGenerationTaskAlreadyExist,
        KeyGenerationResultExist,
        SignTransactionTaskAlreadyExist,
        SignTransactionResultExist,
        AccountGenerationTaskAlreadyExist,
        AssetAlreadyExist,
        AssetNotExist,
        InvalidAssetOwner,
        AppBrowserNotPair,
        AppBrowserPairNotExist,
        TaskTimeout,
`;

ERRORS = _.map(ERRORS.split(','), (v)=>{
  return _.trim(v);
})

const AC_TYPE = {
  'bitcoin_mainnet': 'btc',
};

export default class {
  constructor(api, extension, env=null, opts){
    this.api = api;
    this.callback = {};
    this.extension = extension;

    this.opts = opts || {};

    this.env = env || 'browser';

    this.api.query.system.events((events) => {
      this._handle_events(events)
    });
  }

  buildCallback(key, cb){
    this.callback[key] = cb;
  }

  _handle_events(events){
    _.each(events, (record) => {
      const { event, phase } = record;
      const types = event.typeDef;

      if (event.section == 'gluon') {
        let eventData = {}
        event.data.forEach((data, index) => {
          // console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
          eventData[types[index].type] = data
        });

        const data = event.data;
        switch (event.method) {
          case 'RegistrationApplicationSucceed':
            console.log('new pair found, app:', encodeAddress(data[0]), "browser:", encodeAddress(data[1]));
            if(this.callback['RegistrationApplicationSucceed']){
              this.callback['RegistrationApplicationSucceed'](encodeAddress(data[0]), encodeAddress(data[1]));
            }
            break;
        }
      }
    });
  }

  getRandomNonce(){
    let nonce = _.random(1, 100000000000).toString();

    return nonce;
  }

  async getLayer1Nonce(address){
    const nonce = await this.api.rpc.system.accountNextIndex(address);
    return nonce;
  }

  async buildAccount(account){
    if(_.isString(account)){
      return await this.extension.setSignerForAddress(account, this.api);
    }
    else{
      return account;
    }
  }

  sha256(data){
    // const tmp = forge.sha256.create();
    // tmp.update(data);
    // return tmp.digest().toHex();
    return hash(data);
  }

  async promisify(fn){
    return promisify(this, async (cb)=>{
      try{
        await fn(cb);
      }catch(e){
        cb(e.toString());
      }
    })
  }

  async sendNonceForPairMobileDevice(nonce, account_address){
    if(!nonce){
      throw 'Invalid nonce';
    }
    
    await this.buildAccount(account_address);
    let nonce_hex = '0x'+this.sha256(nonce);

    await this.promisify(async (cb)=>{
      await this.api.tx.gluon.browserSendNonce(
        nonce_hex,
      ).signAndSend(account_address, (param)=>{
        this._transactionCallback(param, cb);
      });
        
    }); 
  }

  async responePairWithNonce(nonce, account, pair_address, meta_json){
    if(!nonce){
      throw 'Invalid nonce';
    }

    await this.buildAccount(account);
    const pub = decodeAddress(pair_address);
    const meta = JSON.stringify(meta_json);
    console.log('responePairWithNonce', nonce, u8aToHex(pub), forge.util.encode64(meta));
    await this.promisify(async (cb)=>{
      await this.api.tx.gluon.sendRegistrationApplication(
        nonce,
        u8aToHex(pub),
        forge.util.encode64(meta),
      ).signAndSend(account, (param)=>{
        this._transactionCallback(param, cb);
      });
    })
  }

  async unpair(account){
    await this.buildAccount(account);
    await this.promisify(async (cb)=>{
      await this.api.tx.gluon.unpairAppBrowser(
    
      ).signAndSend(account, (param)=>{
        this._transactionCallback(param, cb);
      });
    });
  }

  _transactionCallback(param, cb){
    const { events = [], status } = param;
    if (status.isInBlock) {
      console.log('Included at block hash', status.asInBlock.toHex());
      console.log('Events:');

      const opts = {};
      events.forEach(({ event: { data, method, section }, phase }) => {
        console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
        if(method === 'ExtrinsicFailed'){
          const error = this._findError(data);
          if(error){
            cb(error);
            return;
          }
          opts.data = data;
        }
        
      })

      cb(null, true, opts);
    } else if (status.isFinalized) {
      console.log('Finalized block hash', status.asFinalized.toHex())
    }
  }
  _findError(data){
    let err = false;

    _.each(data.toJSON(), (p)=>{
      if(!_.isUndefined(_.get(p, 'Module.error'))){
        err = _.get(p, 'Module.error');
        return false;
      }
    });

    if(err !== false){
      return ERRORS[err];
    }

    return null;
  }

  rsaEncodeWithRsaPublickKey(data, ras_pub_hex){
    let tmp = ras_pub_hex;
    console.log(333, tmp);
    const pub = forge.pki.publicKeyFromPem(tmp);
    let rs = pub.encrypt(data);

    console.log(22, forge.util.bytesToHex(rs));
    return forge.util.bytesToHex(rs);
  }

  async _getAccountProfile(address){
    // const empty_address = '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM';
    const empty_hex = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const pub = decodeAddress(address);
    let profile = {
      address,
    };

    // const x = await this.api.query.gluon.browserAppPair(pub);
    // const y = await this.api.query.gluon.appBrowserPair(pub);
    // console.log(11, forge.util.decode64(u8aToString(x[1])), encodeAddress(x[0]))
    // console.log(22, forge.util.decode64(u8aToString(y[1])), encodeAddress(y[0]))
    
    let me = await this.api.query.gluon.browserAppPair(pub);
    if(u8aToHex(me[0]) === empty_hex){
      me = await this.api.query.gluon.appBrowserPair(pub);
    }

    if(u8aToHex(me[0]) === empty_hex){
      profile.meta = null;
      profile.pair_address = null;
    }
    else{
      profile.pair_address = encodeAddress(me[0]);
      profile.meta = forge.util.decode64(u8aToString(me[1]));
      try{
        profile.meta = JSON.parse(profile.meta);
      }catch(e){
        throw 'Invalid meta data => '+profile.meta;
      }
    }

    return profile;
  }

  zipJsonSize(json){
    // json = {"nonce":"87969575696","nonce_hash":"0x1ee56f4d98c256489d050821ec6c4a30fb54e8f912d9117c3b8bfd8d4c05b31b","nonce_rsa":"0x8bb547a970e0b69ea62d1807d8189d3fa9c5c799ae1bce571acb095a20d303bebbf76faf0fb8bce43b5d8055c73a9b3761626018935f6a12723de4e7d91c0820cd8936471c9576c0d65aec6b8e24b256262f9428f9a97e2b9248e1c75af1b548dfdb93e4e87bf48c1fda5892d9d8fdf139f70c4f5e1ce3837b145f074f4b105242a8878d0a0c11a7d44340d3c299ce03a7febd798c3048265b1e29bee6aae57bcda85f8e844366b23c453e4898f7d405c041d5960e196b6561ee57545305be35942bd4f4db874e0d302ba8d04c5412ffaffda4c4cabb67a7f2ff9c035283c957f3d15dbb5081c4e1d1aac921f44f9f2907891fd79ee0410ed936a7b2f1c911f6","key_type":"bitcoin_mainnet","p1":"0x02ef26ecbd873ee5a71c7e16a34ef540c17a81cf7530e418ea9f6165092dc2541a","p2_n":2,"p2_k":1,"address":"5FnjDG3j9uVCXuyCd2UgzwHUyT7CpgbR6HquvPdas4ttvErM","type":"account"};


    const rs = {};
    _.each(json, (val, key)=>{
      if(_.startsWith(val, '0x')){
        rs[key] = forge.util.binary.base64.encode(hexToU8a(val));
      }
      else{
        rs[key] = val;
      }
    });

    return rs;
  }

  async getAccountProfile(address){
    const me = await this._getAccountProfile(address);
    if(!me.pair_address){
      return {
        ...me,
        pair_meta: null,
      };
    }

    const pair = await this._getAccountProfile(me.pair_address);
    me.pair_meta = pair.meta;

    return me;
  }

  async getSelectDelegator(startPosition=0){
    const neededDelegatesCount = 100;
    const delegates = await this.api.rpc.tea.getDelegates(startPosition, neededDelegatesCount);
    if(!delegates || delegates.length < 1){
      console.log('Not found delegator');
      return null;
    }
    // for (let i = 0; i < delegates.length; i++) {
    //   console.log("pubkey:", delegates[i][0].toString(), "tea_id:", delegates[i][1].toString(), "peer_id:", delegates[i][2].toString())
    // }
    console.log('gluon_getDelegates result:', delegates.toJSON())
    // const random = _.random(0, delegates.length-1);
    const random = delegates.length-1;
    const rs = {
      rsa: delegates[random][0].toString(),
      teaId: delegates[random][1].toString(),
      peerId: delegates[random][2].toString(),
    }
    console.log('Get delegator =>', rs);
    return rs;
  }

  async browserGenerateAccount(account, key, delegate_rsa){

    await this.buildAccount(account);

    const nonce = this.getRandomNonce();
    const nonce_hash = hexToU8a('0x'+this.sha256(nonce));
    
    const pem = forge.util.hexToBytes(delegate_rsa);
    const x = this.rsaEncodeWithRsaPublickKey(nonce, pem);
    const rsa_hex = hexToU8a('0x'+x);

    const key_type = stringToU8a(key);
    const p1 = hexToU8a('0x02ef26ecbd873ee5a71c7e16a34ef540c17a81cf7530e418ea9f6165092dc2541a');
    const p2_n = 3;
    const p2_k = 2;

    // console.log("key_type:", key_type)
    // console.log("p2_n:", p2_n)
    // console.log("p2_k:", p2_k)
    // console.log("nonce_hash_u8:", nonce_hash)
    // console.log("rsa_hex_u8:", rsa_hex)
    // console.log("p1_u8:", p1)

    return await this.promisify(async (cb)=>{
      const rs = await axios({
        url: this.opts.layer1_http,
        method: 'post',
        headers: {
          "content-type": "application/json;charset=utf-8"
        },
        data: JSON.stringify({
          jsonrpc: '2.0',
          id: '112',
          method: 'gluon_encodeAccountGenerationWithoutP3',
          params: [
            Array.from(key_type),
            p2_n, 
            p2_k, 
            Array.from(nonce_hash),
            Array.from(rsa_hex),
            Array.from(p1)
          ]
        })
      });
      
      const encoded_data = rs.data.result;
      const encoded_hash = '0x'+this.sha256(encoded_data);

      console.log('encoded_result_hash:', encoded_hash);

      const me_nonce = this.getRandomNonce();
      const me_nonce_hash = '0x'+this.sha256(me_nonce);

      const layer1_nonce = await this.getLayer1Nonce(account.toString());
      console.log('layer1_nonce =>', layer1_nonce.toString())
      await this.api.tx.gluon.browserGenerateAccount(
        me_nonce_hash,
        encoded_hash,
      ).signAndSend(account, {nonce: layer1_nonce}, (param)=>{
        this._transactionCallback(param, (error)=>{
          if(error){
            cb(error);
          }
          else{
            cb(null, {
              nonce: me_nonce,
              nonce_hash: u8aToHex(nonce_hash),
              nonce_rsa: u8aToHex(rsa_hex),
              key_type: key,
              p1: u8aToHex(p1),
              p2_n,
              p2_k,
            });
          }
        });
      });
    }); 
  }

  async appGenergateAccount(account, nonce, nonce_hash, nonce_rsa, key_type, p1, p2_n, p2_k, tar_address){
    await this.buildAccount(account);

    return this.promisify(async (cb)=>{
      await this.api.tx.gluon.generateAccountWithoutP3(
        nonce,
        nonce_hash,
        nonce_rsa,
        key_type,
        p1,
        p2_n, 
        p2_k,
        u8aToHex(decodeAddress(tar_address)),
      ).signAndSend(account, (param)=>{
        this._transactionCallback(param, cb)
      })
    });
  }

  async getAssetsByAddress(address){
    const pub = decodeAddress(address);

    const multi_sig_accounts = await this.api.query.gluon.browserMultiSigAccounts(pub);

    const rs = [];
    for(let i=0, len=multi_sig_accounts.length; i<len; i++){
      const ac = multi_sig_accounts[i].toString();
      const btc_ac = hexToString(ac);
      const asset = await this.api.query.gluon.assets(btc_ac);
      const tmp = asset.toJSON();
      tmp.type = hexToString(tmp.dataAdhoc.keyType);
      tmp.type = AC_TYPE[tmp.type];
      tmp.account = btc_ac;

      rs.push(tmp);
    }

    console.log('Get Assets =>', rs);
    return rs;
  }

  async browserSignTx(account, data, nonce_hash, nonce_rsa){
    await this.buildAccount(account);
    const data_adhoc = u8aToHex(stringToU8a('transactionData'));

    return this.promisify(async (cb)=>{
      await this.api.tx.gluon.browserSignTx(data_adhoc, nonce_hash, nonce_rsa)
      .signAndSend(account, (param)=>{
        this._transactionCallback(param, (error, f, opts)=>{
          if(error){
            cb(error);
          }
          else{
            const data = opts.data;
            console.log(11, data);
          }
        });

      });
    });
  }
}
