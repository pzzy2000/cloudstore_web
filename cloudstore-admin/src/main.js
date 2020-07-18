import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import ElementUIRWDispatcher from 'element-ui-rw-dispatcher'
import 'element-ui-rw-dispatcher/styles/index.scss'

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control


Vue.use(ElementUI, { locale })
Vue.use(VCharts)
Vue.use(ElementUIRWDispatcher)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
