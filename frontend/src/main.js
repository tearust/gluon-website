import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueI18n from 'vue-i18n';
import ElementUI, {Message} from 'element-ui';
import util from './util';

// import VueAnalytics from 'vue-analytics';

// import 'element-ui/lib/theme-chalk/index.css';
import './style/theme/index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';



Vue.use(VueI18n)
Vue.use(ElementUI);

import './style/index.scss';

Vue.config.productionTip = false;

// Vue.use(VueAnalytics, {
//   id: 'G-3Z0XPZQXX0'
// })

const lang = util.storage.get('lang') || 'en';
const i18n = new VueI18n({
  locale: lang,
  messages : {
    'zh': require('@/assets/i18n/zh.json'),
    'en': require('@/assets/i18n/en.json'),
  }
})

window.changeLanguage = (lang='en')=>{
  i18n.locale = lang;
  util.storage.set('lang', lang);
}

export const vue = new Vue({
  data(){
    return {
      _loading : null
    };
  },
  router,
  store,
  i18n,
  render: h => h(App),
  methods: {
    
    loading(f){
      if(f){
        this._loading = this.$loading({
          lock: true,
          text: 'Loading...',
          customClass: 'c-fullscreen-loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      else{
        if(this._loading){
          this._loading.close();
          this._loading = null;
        }

      }
    },
    toast(message, type, opts){
      opts = opts || {};
      Message.closeAll();
      Message({
        message, type,
        ...opts
      });
    }
  },
}).$mount('#app')