import Layer1 from '../tea/layer1';
import utils from '../tea/utils';
import _ from 'lodash';
import Log from '../shared/utility/Log';
import proto from '../tea/proto';
import http from '../tea/http';
import toHex from 'to-hex';
import BN from 'bn.js';
import store from '../store';
import forge from 'node-forge';



const { Protobuf, stringToU8, u8ToString } = proto;

let _layer1 = null;
export default class {
  constructor() {
    this.layer1 = _layer1;
    this._log = Log.create(this.defineLog());

    this.gluon = null;
  }

  defineLog(){
    return 'Base';
  }

  async init() {
    await this.initLayer1();
    this.gluon = this.layer1.gluon;
  }

  async initLayer1() {
    if (!this.layer1) {
      try {
        this.layer1 = new Layer1();
        await this.layer1.init();

        _layer1 = this.layer1;
      } catch (e) {
        console.error(e);
      }
    }
  }

  showQrCodeModal(opts){
    utils.publish('tea-qrcode-modal', {
      visible: true,
      text: opts.text,
    });
  }
  closeQrCodeModal(){
    utils.publish('tea-qrcode-modal', {
      visible: false,
    });
  }

  encode_b64(str){
    return forge.util.encode64(str);
  }

  showSelectLayer1Modal(){
    utils.publish('tea-select-layer1-modal', true);
  }

  async refreshCurrentAccount(){
    
    const layer1_account = store.getters.layer1_account;
    if(!layer1_account.address){
      return false;
    }

    this._log.i("refresh current layer1_account");
    const balance = await this.layer1.getAccountBalance(layer1_account.address);
    const info = await this.gluon.getAccountProfile(layer1_account.address);

    store.commit('set_account', {
      balance,
      address: layer1_account.address,
      ori_name: layer1_account.name,
    });

    if(info.pair_address){
      store.commit('set_bind_mobile', {
        address: info.pair_address,
        uuid: info.pair_meta.uuid || ''
      });
    }
    else{
      store.commit('set_bind_mobile', null);
    }
  }
  

  
}