import types from '../type/user';

import Layer1 from '../../layer1';

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
  },

  refresh(){
    return async (dispatch)=>{
      const layer1 = await Layer1.get();
      const ac = await layer1.getCurrentAccount();

      dispatch({
        type: types.set_layer1_account,
        param: {
          address: ac.address,
          balance: ac.balance,
          mnemonic: ac.mnemonic,
        }
      });

      const profile = ac.profile;
      dispatch({
        type: types.set_pair_info,
        param: profile.pair_address ? {
          address: profile.pair_address,
          meta: profile.pair_meta,
        } : null,
      })
    }
  }
};