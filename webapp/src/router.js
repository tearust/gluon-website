import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home';
import PairWithMobile from './views/PairWithMobile';
import LoginAccount from './views/LoginAccount';
import Test from './views/Test';

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
    path: '/login_account',
    name: 'login_account',
    component: LoginAccount,
  },
  {
    path: '/pair-with-mobile',
    name: 'pair-with-mobile',
    component: PairWithMobile
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
    meta: {
      needLogin: true
    }
  }
  
];

export default new Router({
  routes: routers
})