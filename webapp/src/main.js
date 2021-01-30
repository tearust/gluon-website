import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Loading } from 'element-ui';

import router from './router';
import './style.scss';

import store from './store';

Vue.use(ElementUI);
Vue.config.productionTip = false;



router.beforeEach((to, from, next)=>{  
  if(to.meta && to.meta.needLogin){
    const {layer1_account} = store.getters;
    if(!layer1_account){
      next({path: '/login_account'})
    }
  }

  next();
})


const C = {};
new Vue({
  router,
  store,
  methods: {
    isDev(){
      return true;
    },
    loading(f, text='Loading...'){
      if(f){
        C._loading = Loading.service({
          lock: true,
          text: 'Loading...',
          customClass: 'c-fullscreen-loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      else{
        C._loading && C._loading.close();
      }
    },
    showError(e, title='Layer1 Error'){
      const err = e.message || e.toString();
      this.$alert(err, title, {
        type: 'error'
      });
    },
  },
  render: h => h(App),
}).$mount('#app');
