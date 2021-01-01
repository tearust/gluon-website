import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home';
import PairWithMobile from './views/PairWithMobile';

Vue.use(Router);

import utils from './tea/utils';


let routers = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      needLogin: true
    }
  },
  {
    path: '/pair-with-mobile',
    name: 'pair-with-mobile',
    component: PairWithMobile
  }
  
];

export default new Router({
  routes: routers
})