import Vue from 'vue'
import ElementUI, { Notification } from 'element-ui'
import VueLazyload from 'vue-lazyload'
import DialogEx from '@/utils/dialog.js'
import '@/assets/style/animate.scss'
import '@/assets/style/common.scss'
import '@/assets/style/element-ui.scss'
import '@/assets/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import App from './App.vue'
import vueBar from 'vuebar'
import './filter/filter.js'
import md5 from 'js-md5'
import i18n from './locale/index'
import { isPlainObject } from 'lodash'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(vueBar)
Vue.use(VueLazyload)
Vue.use(DialogEx)

Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()
// 重写通知
let notify = Vue.prototype.$notify
Vue.prototype.$md5 = md5
Vue.prototype.$notify = function (message) {
  let opt = {}
  let duration = 2000
  if (isPlainObject(message)) {
    Object.assign(opt, { position: 'bottom-right', duration }, message)
  } else {
    opt = { message, type: 'success', position: 'bottom-right', duration }
  }
  Notification.closeAll()
  notify.apply(this, [opt])
}

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')
