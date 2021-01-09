import Vuex from 'vuex';
import Vue from 'vue'
Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    layer1_account: {
      name: null,
      address: null,
      balance: null,
    },

    bind_mobile: {
      // address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      // uuid: '29308409284023805283502845038453095803485308503',
    },

    btc_list: [
      {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        balance: 0.01,
        pub: 'public_key',
      }
    ],
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
      // console.log(111, account)
      state.layer1_account = {
        name: account.ori_name,
        address: account.address,
        balance: account.balance,
      };
      localStorage.setItem('tea-layer1-account', JSON.stringify(state.layer1_account));
    },

    set_bind_mobile(state, opts){
      console.log(111, opts)
      state.bind_mobile = {
        address: opts.address,
        uuid: opts.uuid,
      };
    }
  }
})

export default store;