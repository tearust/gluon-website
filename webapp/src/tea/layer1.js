
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import _ from 'lodash';
import types from './types';
import extension from './extension';
const rpc = require('./rpc');
import toHex from 'to-hex';
import BN from 'bn.js';
import utils from './utils';
import gluon from './gluon';
const LAYER1_URL = utils.get_env('layer1_url') || 'ws://127.0.0.1:9944';

class Layer1 {
  constructor(){
    this.api = null;
    this.callback = {};
    this.extension = extension;

    this.gluon = null;
  }
  getDefaultAccount(name='Alice'){
    const keyring = new Keyring({ type: 'sr25519' });
    const ac = keyring.addFromUri(`//${name}`, { name: `${name} default` });
    return ac;
  }
  async init(){
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

    this.gluon = new gluon(this.api, this.extension, 'browser');
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

    // console.log(222, previousFree, previousNonce);
    // console.log(`Layer1 has a balance of ${previousFree}, nonce ${previousNonce}`);
    // this.api.query.system.account(account, ({ data: { free: currentFree }, nonce: currentNonce }) => {
    //   // Calculate the delta
    //   const change = currentFree.sub(previousFree);
  
    //   // Only display positive value changes (Since we are pulling `previous` above already,
    //   // the initial balance change will also be zero)
    //   if (!change.isZero()) {
    //     console.log(`New balance change of ${change}, nonce ${currentNonce}`);
  
    //     previousFree = currentFree;
    //     previousNonce = currentNonce;

    //     console.log(333, previousFree, previousNonce);
    //   }
    // });
    const free = parseInt(previousFree.toString(), 10) / this.asUnit();
    return Math.floor(free*10000)/10000;
  }

  // async test(){
  //   const api = this.api;
  //   const keyring = new Keyring({ type: 'sr25519' });
  //   const Alice = keyring.addFromUri('//Bob', { name: 'Bob default' });
  //   console.log('==== >', Alice);

  //   // const chain = await this.api.rpc.system.chain();
  //   // const lastHeader = await this.api.rpc.chain.getHeader();
  //   // console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

  //   const all_account = await this.extension.getAllAccounts();
  //   const me = all_account[0].address;
  //   console.log(222, me);

  //   const transfer = this.api.tx.balances.transfer(Alice.address, 2.0);
  //   console.log(11, this.api.tx.balances.transfer);
  //   // const hash = await transfer.signAndSend(Alice);

  //   const me_ac = await this.extension.setSignerForAddress(me, this.api);
  //   transfer.signAndSend(me, (result) => {
  //     console.log(`Current status is ${result.status}`);

  //     if (result.status.isInBlock) {
  //       console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
  //       result.events.forEach(({ event: { data, method, section }, phase }) => {
  //         console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
  //       });
  //     } else if (result.status.isFinalized) {
  //       console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);

  //     }
  //   });

    

  // }

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

  async addNewTask(account, {
    refNum, teaId, modelCid, bodyCid, payment
  }, callback){
    // const keyring = new Keyring({ type: 'sr25519' });
    // const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });

    await this.extension.setSignerForAddress(account, this.api);
    console.log('send account => ', account);
    await this.api.tx.tea.addNewTask(refNum, teaId, modelCid, bodyCid, payment)
          .signAndSend(account, ({ events = [], status }) => {
                if (status.isInBlock) {
                      console.log('Included at block hash', status.asInBlock.toHex());
                      console.log('Events:');
                      events.forEach(({ event: { data, method, section }, phase }) => {
                            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                      });

                      callback(true, status.asInBlock.toHex());
                } else if (status.isFinalized) {
                      console.log('Finalized block hash', status.asFinalized.toHex());
                }
    });

    console.log('send add_new_task tx')
  }

  async nodeByEphemeralId(eid_0x, cb){
    const api = this.api;
    const teaId = await api.query.tea.ephemeralIds(eid_0x);
    if (teaId.isNone) {
      throw 'invalid ephemeral id for method layer1=>nodeByEphemeralId';
    }

    const nodeObj = await api.query.tea.nodes(teaId.unwrap());
    const node = nodeObj.toJSON();

    node.http = node.urls[0] ? utils.forge.util.hexToBytes(node.urls[0]) : '';

    return node;
  }
}

Layer1.getBootstrapNodes = async ()=>{
  const provider = new WsProvider(LAYER1_URL);
  const api = await ApiPromise.create({
    provider,
    types,
    rpc,
  });

  const nodes = await api.query.tea.nodes.entries();
  
  const teaNodes = _.slice(nodes, 0, 100).map((n) => {
    return n[1]
  })

  // console.log("teaNodes", JSON.stringify(teaNodes));

  return teaNodes;
};

export default Layer1;

