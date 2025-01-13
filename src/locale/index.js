import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './English/index'
import zhLocale from './Chinese/index'

Vue.use(VueI18n)

const messages = {
  'en-US': {
    ...enLocale,
    ...elementEnLocale
  },
  'zh-CN': {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: sessionStorage.getItem('lang') || 'zh-CN',
  messages
})

export default i18n
