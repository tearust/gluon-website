import types from '../type/user';
import {_} from 'helper';

const init_state = {
  isLogin: false,
  currentUser: null,
  token: null
};


export default (state=init_state, action)=>{
  state = _.clone(state);
  switch(action.type){
    case types.LOGIN:
      state.isLogin = true;
      state.currentUser = action.user;
      state.token = action.user.token || state.token;
      break;
    case types.LOGOUT:
      state.isLogin = false;
      state.token = null;
      state.currentUser = null;
      break;
  }

  return state;
};