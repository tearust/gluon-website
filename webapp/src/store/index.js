import Vuex from 'vuex';
import Vue from 'vue'
Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    account: null
  },

  mutations: {
    set_account(state, account){
      state.account = account;
    }
  }
})

export default store;