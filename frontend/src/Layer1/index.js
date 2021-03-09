
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import _ from 'lodash';
import types from './types';
import extension from './extension';
const rpc = require('./rpc');
import toHex from 'to-hex';
import BN from 'bn.js';

class Layer1 {
  constructor(){
    this.api = null;
    this.callback = {};
    this.extension = extension;

  }
  
  async init(LAYER1_URL){


    const provider = new WsProvider(LAYER1_URL);
    const api = await ApiPromise.create({
      provider,
      types,
      rpc,
    });
    this.api = api;

    await this.extension.init();
    await cryptoWaitReady();

    // Subscribe to system events via storage
    this.api.query.system.events((events) => {
      this.handle_events(events)
    });


  }

  buildCallback(key, cb){
    this.callback[key] = cb;
  }

  asUnit(){
    const yi = new BN('100000000', 10);
    const million = new BN('10000000', 10);
    const unit = yi.mul(million);

    return unit;
  }

  async getAccountBalance(account){
    let { data: { free: previousFree }, nonce: previousNonce } = await this.api.query.system.account(account);

    const free = parseInt(previousFree.toString(), 10) / this.asUnit();
    return Math.floor(free*10000)/10000;
  }

  async transferToken(me, tar, amount, memo=''){
    const total = new BN((amount*this.asUnit()).toString(), 10);
    const transfer = this.api.tx.balances.transfer(tar, total);

    await this.extension.setSignerForAddress(me, this.api);
    return new Promise((resolve)=>{
      
      transfer.signAndSend(me, (result) => {
        console.log(`Current status is ${result.status}`);
  
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          result.events.forEach(({ event: { data, method, section }, phase }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
          });
        } else if (result.status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
          resolve(result.status.asFinalized);
        }
      });
    });
    
  }

  handle_events(events){

    _.each(events, (record) => {
      // console.log(123, record);
      const { event, phase } = record;
      const types = event.typeDef;

      if (event.section == 'tea') {
        // console.log(`Received tea events:`);
  
        let eventData = {}
        // Loop through each of the parameters, displaying the type and data
        event.data.forEach((data, index) => {
          // console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
          eventData[types[index].type] = data
        });

        // console.log('eventData:', eventData);

        switch (event.method) {
          case 'CompleteTask':
            console.log('CompleteTask:', this.callback, eventData.Result.toString());
            if(this.callback['CompleteTask']){

              this.callback['CompleteTask'](eventData.Result.toString());
            }
            break

          case 'SettleAccounts':
            console.log('SettleAccounts:', this.callback, eventData.Bill);
            if(this.callback['SettleAccounts']){
              this.callback['SettleAccounts'](eventData.Bill);
            }
            break;
          default:
        }
      }
    });
  }

  async sign(account, text){
    await this.extension.setSignerForAddress(account, this.api);
    const sig = await this.api.sign(account, {
      data: toHex(text, {addPrefix: true})
    });
    return sig;
  }

  
}

export default Layer1;

