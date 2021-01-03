import Vuex from 'vuex';
import Vue from 'vue'
Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    layer1_account: {
      name: null,
      address: null,
    }
  },

  getters: {
    layer1_account: (state)=>{
      if(state.layer1_account.address){
        return state.layer1_account;
      }
      const ll = localStorage.getItem('tea-layer1-account');
      if(ll){
        return JSON.parse(ll);
      }

      return null;
    }
  },

  mutations: {
    set_account(state, account){
      console.log(111, account)
      state.layer1_account = {
        name: account.ori_name,
        address: account.address,
      };
      localStorage.setItem('tea-layer1-account', JSON.stringify(state.layer1_account));
    }
  }
})

export default store;