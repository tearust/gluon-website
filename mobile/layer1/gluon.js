import _ from 'lodash';
const { stringToU8a, u8aToHex } = require('@polkadot/util');

export default class {
  constructor(api, extension, env=null){
    this.api = api;
    this.callback = {};
    this.extension = extension;

    this.env = env || 'browser';
  }

  getRandomNonce(){
    let nonce = _.random(1, 100000000000).toString();
    nonce = u8aToHex(nonce);
console.log(111, nonce);
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

  // broswer side
  async sendNonceForPairMobileDevice(account_address, callback=null){
    const nonce = this.getRandomNonce();
    
    await this.buildAccount(account_address);
    console.log('layer1 account => ', account_address);
    await this.api.tx.gluon.browserSendNonce(u8aToHex(nonce)).
      signAndSend(account_address, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Included at block hash', status.asInBlock.toHex());
          console.log('Events:');
          events.forEach(({ event: { data, method, section }, phase }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
          })

          callback(true, nonce);
        } else if (status.isFinalized) {
          console.log('Finalized block hash', status.asFinalized.toHex())
        }
      });

  }

  async responePairWithNonce(nonce, account, callback){
    if(!nonce){
      throw 'Invalid nonce';
    }

    await this.buildAccount(account);
    const pub = account.publicKey;
    console.log(22, pub, u8aToHex(pub))
    await this.api.tx.gluon.sendRegistrationApplication(nonce, u8aToHex(pub))
      .signAndSend(account, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Included at block hash', status.asInBlock.toHex())
          console.log('Events:')
          events.forEach(({ event: { data, method, section }, phase }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
          })

          callback(true);
        } else if (status.isFinalized) {
          console.log('Finalized block hash', status.asFinalized.toHex())
        }
      })
  }
}
