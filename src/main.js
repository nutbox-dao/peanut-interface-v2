import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.filter('amountForm', function (value, digit=3) {
  if (!value) return ''
  const str =
      digit != null && digit >= 0
          ? Number(value)
              .toFixed(digit)
              .toString()
          : value.toString()
  let integer = str
  let fraction = ''
  if (str.includes('.')) {
    integer = str.split('.')[0]
    fraction = '.' + str.split('.')[1]
  }
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fraction
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
