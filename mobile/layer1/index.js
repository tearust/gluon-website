
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { cryptoWaitReady, mnemonicGenerate } from '@polkadot/util-crypto';
import _ from 'lodash';
import types from './types';
const rpc = require('./rpc');

import BN from 'bn.js';
import forge from 'node-forge';

import {cache} from 'helper';

const LAYER1_URL = 'ws://81.70.96.136:9944';

let _layer1 = null;
export default class Layer1 {
  static get = async ()=>{
    if(_layer1){
      return _layer1;
    }

    _layer1 = new Layer1();
    await _layer1.init();
    return _layer1;
  };


  constructor(){
    this.api = null;
    this.callback = {};
  }
  getDefaultAccount(){
    const keyring = new Keyring({ type: 'sr25519' });
    const ac = keyring.addFromUri(`//Alice`, { name: `Alice default` });
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

    await cryptoWaitReady();

    // Subscribe to system events via storage
    this.api.query.system.events((events) => {
      this.handle_events(events)
    });

  }

  async mnemonicGenerate(){
    let mn = await cache.get('tea-mnemonic');
    if(!mn){
      mn = mnemonicGenerate();
      await cache.set('tea-mnemonic', mn);
    }
    return mn;
  }
  generateWithMnemonic(mnemonic){
    const keyring = new Keyring({ type: 'sr25519' })
    const ac = keyring.addFromUri(mnemonic);
    return ac;
  }

  async getCurrentAccount(){
    const mn = await this.mnemonicGenerate();
    const account = this.generateWithMnemonic(mn);
    account.mnemonic = mn;
    return account;
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
      data: '0x'+text,
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

    node.http = node.urls[0] ? forge.util.hexToBytes(node.urls[0]) : '';

    return node;
  }

  async getBootstrapNodes(){
    const nodes = await this.api.query.tea.nodes.entries();
    const teaNodes = _.slice(nodes, 0, 100).map((n) => {
      return n[1]
    });

    return teaNodes;
  }
}



