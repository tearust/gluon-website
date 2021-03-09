import Layer1 from '../Layer1';
import request from '../request';
import { add } from 'lodash';

let _layer1 = null;
const F = {
  async initLayer1(){
    const layer1_info = await request.get_layer1_info();
    console.log(11, layer1_info);
    const layer1_url = layer1_info.url;

    _layer1 = new Layer1();
    await _layer1.init(layer1_url);

    return {
      target_address: layer1_info.address,
    };
  },

  getLayer1Instance(){
    if(_layer1) return _layer1;

    throw 'invalid layer1 instance';
  },

  async getAllLayer1Account(){
    const all_account = await _layer1.extension.getAllAccounts();

    return all_account;
  },

  async getLayer1AccountInfo(address){
    const balance = await _layer1.getAccountBalance(address);

    const meta = {
      seed: 1,
    }

    return {
      address,
      balance,
      meta,
    }
  },

  async getPresaleRecordsByAddress(address){
    // from layer1 or server?

    const record_data = [
      {
        price: 100,
        time: Date.now(),
        token: 'TEST-TOKEN',
      }
    ];

    return record_data;
  },

  async getSeedAmount(){
    return {
      total: 100,
      now: 90,
    }
  }

};

export default F;