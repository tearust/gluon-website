import Vuex from 'vuex';
import Vue from 'vue';
import _ from 'lodash';

import Base from '../workflow/Base';

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    layer1_account: {
      name: null,
      address: null,
      balance: null,
    },

    // address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    // uuid: '29308409284023805283502845038453095803485308503',
    bind_mobile: null,

    btc_list: [],

    latest_meta: {
      delegator_nonce: null,
      delegator_nonce_hash: null,
      delegator_nonce_rsa: null,

    },
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

      return state.layer1_account;
    }
  },

  mutations: {
    set_account(state, account){
      state.layer1_account = {
        name: account.ori_name,
        address: account.address,
        balance: account.balance,
      };
      localStorage.setItem('tea-layer1-account', JSON.stringify(state.layer1_account));
    },

    set_bind_mobile(state, opts){
      if(!opts){
        state.bind_mobile = null;
      }
      else{
        state.bind_mobile = {
          address: opts.address,
          uuid: opts.uuid,
        };
      }
    },

    // add_btc_account_mock(state, opts){
    //   const list = state.btc_list;
    //   list.push({
    //     address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    //     balance: 0.01,
    //     pub: 'public_key',
    //     status: 'normal',
    //     profile: {},
    //   });
    //   state.btc_list = list;
    // },

    set_all_asset(state, asset){
      const list = _.map(asset, (item)=>{
        item.balance = 0;
        item.status = 'normal';
        return item;
      });

      state.btc_list = list;
    },

    set_meta(state, opts){
      state.latest_meta = _.extend(state.latest_meta, opts);
    }
  },

  actions: {
    async set_asset(store){
      const layer1_account = store.getters.layer1_account;
      if(!layer1_account){
        throw 'Invalid layer1 account';
      }

      const address = layer1_account.address;
      this.wf = new Base();
      await this.wf.init();

      const asset = await this.wf.gluon.getAssetsByAddress(address);
      
      store.commit('set_all_asset', asset);

    }
  }
})

export default store;