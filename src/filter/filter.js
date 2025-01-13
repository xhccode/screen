/* eslint-disable */
/**
 * Created by zzg on 2017/12/19.
 */
import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
// 设置默认为中文
moment.locale('zh-cn')

Vue.prototype.$fmt = (value, fmt = 'LLL') => {
  if (value) {
    let m = moment(value)
    if (m.isValid()) {
      return m.format(fmt)
    }
  }
}

Vue.filter('df', function(value, fmt) {
  if (value) {
    let m = moment(value)
    if (m.isValid()) {
      return m.format(fmt)
    }
  }
  return ''
})

function padLeftZero(value, length) {
  if (value) {
    let str = String(value)
    if (str.length >= length) {
      return str.substring(0, length)
    }
    return str.padStart(length, '0')
  }
  return ''.padStart(length, '0')
}

Vue.filter('plz', padLeftZero)
