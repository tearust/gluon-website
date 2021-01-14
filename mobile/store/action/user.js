import types from '../type/user';

import Layer1 from '../../layer1';
import {UI, cache, crypto} from 'helper';

const C = {
  password_key: 'tea-password',
  password_val: 'gluon-wallet',
};

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
  },

  initPassword(){
    return async(dispatch)=>{
      const encrypted = await cache.get(C.password_key);
      if(encrypted){
        dispatch({
          type: types.set_encrypted_password,
          param: encrypted
        });
      }
    }
  },
  setPassword(){
    return async (dispatch)=>{
      const pwd = await UI.showPrivatePasswordModal('set');
      
      const encrypted = crypto.aes(pwd, C.password_val);
      await cache.set(C.password_key, encrypted);

      dispatch({
        type: types.set_encrypted_password,
        param: encrypted
      });
      return true;
    }
  },
  verifyPassword(){
    return async (dispatch, getState)=>{
      const {user} = getState();
      if(!user.encrypted_password){
        return false;
      }

      const pwd = await UI.showPrivatePasswordModal('verify');
      const text = crypto.des(pwd, user.encrypted_password);

      return text === C.password_val;
    }
  }
};