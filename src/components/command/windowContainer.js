export default {
  data () {
    return {
      windows: []
    }
  },
  provide () {
    return {
      /**
       * 窗口最小化时，将窗口加入windows里，以便显示窗口标题
       */
      addWindow: (win) => {
        this.doAddWindow(win)
      },
      /**
       * 当前窗口关闭时，需从windows里移除
       */
      removeWindow: (win) => {
        this.doRemoveWindow(win)
      }
    }
  },
  methods: {
    // 窗口还原
    recoverWindow (index) {
      this.windows[index].recoverWindow()
    },
    doAddWindow (win) {
      if (_.indexOf(this.windows, win) === -1) {
        this.windows.push(win)
      } else {
        console.debug(`该窗口[${win.title}]已存在!`)
      }
    },
    doRemoveWindow (win) {
      let index = _.indexOf(this.windows, win)
      if (index > -1) {
        this.windows.splice(index, 1)
      }
    }
  }
}
