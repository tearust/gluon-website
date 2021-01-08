import utils from './utils';
const { stringToU8a, u8aToHex } = require('@polkadot/util');

export default class {
  constructor(api, extension){
    this.api = api;
    this.callback = {};
    this.extension = extension;
  }

  getRandomNonce(){
    let nonce = utils.uuid();
    nonce = u8aToHex(nonce);

    return nonce;
  }

  async sendNonceForPairMobileDevice(account_address, callback=null){
    const nonce = this.getRandomNonce();
    
    await this.extension.setSignerForAddress(account_address, this.api);
    console.log('layer1 account => ', account_address);
    await this.api.tx.gluon.browserSendNonce(u8aToHex(nonce)).
      signAndSend(account_address, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Included at block hash', status.asInBlock.toHex());
          console.log('Events:');
          events.forEach(({ event: { data, method, section }, phase }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
          })

          callback(true, status.asInBlock.toHex());
        } else if (status.isFinalized) {
          console.log('Finalized block hash', status.asFinalized.toHex())
        }
      });

  }
}
