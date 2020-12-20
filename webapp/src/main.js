import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Loading } from 'element-ui';

import router from './router';
import './style.scss';


Vue.use(ElementUI);
Vue.config.productionTip = false;


const C = {};
new Vue({
  router,
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
