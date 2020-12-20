import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home';

Vue.use(Router);

import utils from './tea/utils';



let routers = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  
];

export default new Router({
  routes: routers
})