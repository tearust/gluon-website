import types from '../type/user';

export default {
  login(user){
    return {
      type: types.LOGIN,
      user
    }
  },
  logout(){
    return {
      type: types.LOGOUT
    }
  }
};