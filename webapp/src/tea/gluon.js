import _, { add } from 'lodash';
import { stringToHex, u8aToHex, promisify, u8aToString } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import forge from 'node-forge';

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


export default class {
  constructor(api, extension, env=null){
    this.api = api;
    this.callback = {};
    this.extension = extension;

    this.env = env || 'browser';
  }

  getRandomNonce(){
    let nonce = _.random(1, 100000000000).toString();

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
    const tmp = forge.sha256.create();
    tmp.update(data);
    return tmp.digest().toHex();
  }

  async promisify(fn){
    await promisify(this, async (cb)=>{
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

      events.forEach(({ event: { data, method, section }, phase }) => {
        console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
        if(method === 'ExtrinsicFailed'){
          const error = this._findError(data);
          if(error){
            cb(error);
            return;
          }
          console.log(11, data.toString())
        }
        
      })

      cb(null, true);
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

  // async nodeByEphemeralId(eid, cb){
  //   const teaId = await api.query.tea.ephemeralIds('0x'+eid);
  //   if (teaId.isNone) {
  //     cb(false);
  //     return false;
  //   }

  //   const nodeObj = await api.query.tea.nodes(teaId.unwrap());
  //   const node = nodeObj.toJSON();
  //   console.log(111, node);

  //   node.http = node.urls[0] ? utils.forge.util.hexToBytes(node.urls[0]) : '';

  //   cb(true, node);
  // }

  async getTeaNodes(){
    const nodes = await this.api.query.tea.nodes.entries();
  
    const teaNodes = _.slice(nodes, 0, 100).map((n) => {
      return n[1]
    })

    console.log("teaNodes", JSON.stringify(teaNodes));

    return teaNodes;
  }

  async _getAccountProfile(address){
    const pub = decodeAddress(address);
    const info = await this.api.query.gluon.appBrowserPair(pub);
    return info;
  }

  async getAccountProfile(address){
    address = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const profile = {};
    const me = await this._getAccountProfile(address);
    console.log('query gluon.AppBrowserPair browser:', (me[0]));
    
    profile.address = address;
    profile.meta = forge.util.decode64(u8aToString(me[1]));
    const pair_address = encodeAddress(me[0]);
    if(pair_address){
      const pair = await this._getAccountProfile(pair_address);
      profile.pair = {
        address: pair_address,
        meata: forge.util.decode64(u8aToString(pair[1])),
      };
    }

    return profile;
  }

  
}
