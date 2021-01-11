import _ from 'lodash';
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
            console.log('new pair found, app:', encodeAddress(data[0]), "broswer:", encodeAddress(data[1]));
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

  
}
