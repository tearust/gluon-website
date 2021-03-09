import Vue from 'vue';
import Vuex from 'vuex';
import request from '../request';
import util from '../util';
import constant from './constant';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // name, address, balance, meta
    layer1_account: null,
    
    // username
    admin_user: null,
  },

  getters: {
    layer1_account: (state)=>{
      if(state.layer1_account){
        return state.layer1_account;
      }
      // const ll = localStorage.getItem('tea-layer1-account');
      // if(ll){
        
      //   return JSON.parse(ll);
      // }

      // return state.layer1_account;
      return null;
    }
  },

  mutations: {
    set_account(state, account){
      state.layer1_account = {
        name: account.name,
        address: account.address,
        balance: account.balance,
        meta: account.meta || {},
      };
      // localStorage.setItem('tea-layer1-account', JSON.stringify(state.layer1_account));
    },

    set_admin(state, admin){
      state.admin_user = admin;
    }
  },

  actions: {
    
  }
})