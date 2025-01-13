// 弹框窗口操作
export default {
  props: { title: { type: String, required: true }, width: { type: String }, height: { type: String } },
  inject: {
    addWindow: { default: () => {} },
    removeWindow: { default: () => {} }
  },
  data () {
    return {
      visible: false,
      fullscreen: false,
      badge: 0
    }
  },
  methods: {
    // 最小化
    minimize () {
      this.visible = false
      this.addWindow(this)
    },
    // 最大化
    maximize () {
      this.fullscreen = !this.fullscreen
    },
    // 窗口还原
    recoverWindow () {
      this.visible = true
      if (this.badge) this.badge = 0
      this.removeWindow(this)
    }
  },
  // 从父容器的windows里移除
  beforeDestroy () {
    if (this.removeWindow) {
      this.removeWindow(this)
    }
  }
}
