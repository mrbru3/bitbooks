import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Products from '@/pages/products'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/products',
    name: 'Products',
    component: Products
  }]
})