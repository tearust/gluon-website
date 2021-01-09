import _ from 'lodash';
import { stringToHex, u8aToHex, promisify, } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import forge from 'node-forge';

let ERRORS = `InvalidSig,
InvalidNonceSig,
InvalidSignatureLength,
DelegatorNotExist,
  AccountIdConvertionError,
  InvalidToAccount,
  SenderIsNotBuildInAccount,
  SenderAlreadySigned,
  TransferAssetTaskTimeout,
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
  TaskTimeout,`;

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
    let nonce = '10000'; //_.random(1, 100000000000).toString();

    return nonce;
  }

  async buildAccount(account){
    if(this.env === 'browser'){
      return await this.extension.setSignerForAddress(account, this.api);
    }

    if(this.env === 'app'){
      return account;
    }

    throw 'invalid account In '+this.env;
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

  // broswer side
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

  async responePairWithNonce(nonce, account, pair_address){
    if(!nonce){
      throw 'Invalid nonce';
    }

    const pub = decodeAddress(pair_address);
    console.log('responePairWithNonce', nonce, u8aToHex(pub))
    await this.promisify(async (cb)=>{
      await this.api.tx.gluon.sendRegistrationApplication(
        nonce,
        u8aToHex(pub)
      ).signAndSend(account, (param)=>{
        this._transactionCallback(param, cb);
      });
    })
  }


  _transactionCallback(param, cb){
    const { events = [], status } = param;
    if (status.isInBlock) {
      console.log('Included at block hash', status.asInBlock.toHex());
      console.log('Events:');

      events.forEach(({ event: { data, method, section }, phase }) => {
        
        if(method === 'ExtrinsicFailed'){
          const error = this._findError(data);
          if(error){
            cb(error);
            return;
          }
          console.log(11, data.toString())
        }
        console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
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
}
