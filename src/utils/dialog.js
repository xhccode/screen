import merge from 'element-ui/src/utils/merge'
import _default from 'vuex'

export default {
  install (Vue) {
    Vue.prototype.$extendDialog = function (DialogComponent, options = {}, propsData) {
      return new Promise((resolve, reject) => {
        options = merge({ resolve, reject }, options)
        const constructor = Vue.extend(DialogComponent)
        const instance = new constructor({
          el: document.createElement('div'),
          data: options,
          propsData,
          parent: this,
          methods: {
            close () {
              this.visible = false
              this.$destroy()
              document.body.removeChild(instance.$el)
              resolve()
            }
          }
        })
        document.body.appendChild(instance.$el)
        Vue.nextTick(() => {
          instance.visible = true
        })
      })
    }
  }
}
