import types from '../type/user';
import {_} from 'helper';

const init_state = {
  layer1_account: null,

  pair_info: null,

  qrcode: null,
};


export default (state=init_state, action)=>{
  state = _.clone(state);
  switch(action.type){
    case types.set_layer1_account:
      state.layer1_account = action.param;
      break;
    case types.set_pair_info:
      state.pair_info = action.param;
      break;
    case types.set_qrcode:
      state.qrcode = action.param;
      break;
  }

  return state;
};