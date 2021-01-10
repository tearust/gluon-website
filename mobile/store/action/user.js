import types from '../type/user';

export default {
  setLayer1Account(account){
    return {
      type: types.set_layer1_account,
      param: account,
    }
  },
  setPairInfo(pairInfo){
    return {
      type: types.set_pair_info,
      param: pairInfo,
    }
  },

  setQrcode(code_json){
    return {
      type: types.set_qrcode,
      param: code_json,
    }
  }
};