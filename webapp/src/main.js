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
  console.log(to);
  
  if(to.meta && to.meta.needLogin){
    const {account} = store.state;
    if(!account){
      next({path: '/pair-with-mobile'})
    }
  }

  next();
})


const C = {};
new Vue({
  router,
  store,
  methods: {
    loading(f, text='Loading...'){
      if(f){
        C._loading = Loading.service({
          fullscreen: true,
          text,
          background: 'rgba(0, 0, 0, 0.7)',
          customClass: 'tea-loading'
        });
      }
      else{
        C._loading && C._loading.close();
      }
    }
  },
  render: h => h(App),
}).$mount('#app');
