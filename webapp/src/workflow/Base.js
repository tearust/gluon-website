import Layer1 from '../tea/layer1';
import utils from '../tea/utils';
import _ from 'lodash';
import Log from '../shared/utility/Log';
import proto from '../tea/proto';
import http from '../tea/http';
import toHex from 'to-hex';
import BN from 'bn.js';

const { Protobuf, stringToU8, u8ToString } = proto;

let _layer1 = null;
export default class {
  constructor() {
    this.layer1 = _layer1;
    this._log = Log.create(this.defineLog());
  }

  defineLog(){
    return 'Base';
  }

  async init() {
    await this.initLayer1();
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

  
}