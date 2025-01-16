import LOG from '@/api'
export default {
  provide () {
    return {
      /**
       * Depreched, instead of pushLeft
       */
      switchLeftComponet: this.pushLeft,
      /**
       * Depreched, instead of pushRight
       */
      switchRightComponet: this.pushRight,
      // 还原左右两侧侧栏组件
      popBoth: cb => {
        this.popLeft(cb)
        this.popRight(cb)
      },
      // 还原左侧栏组件
      popLeft: this.popLeft,
      // 切换左侧栏组件
      pushLeft: this.pushLeft,
      /**
       * 改变左侧组件属性值
       * @param comp 组件名称（通过该名称定位到对应到frame）
       * @param cb 改变值的回调函数 (props) => void
       */
      changeLeftData: this.changeLeftData,
      // 还原右侧栏组件
      popRight: this.popRight,
      // 切换右侧栏组件
      pushRight: this.pushRight,
      /**
       * 改变右侧组件属性值
       * @param comp 组件名称（通过该名称定位到对应到frame）
       * @param cb 改变值的回调函数 (props) => void
       */
      changeRightData: this.changeRightData
    }
  },
  data () {
    return {
      _$$leftCompStack: [],
      _$$rightCompStack: []
    }
  },
  computed: {
    leftComp () {
      let tile = this._data._$$leftCompStack.slice(-1)[0]
      return tile.comp
    },
    leftCustomProps () {
      let tile = this._data._$$leftCompStack.slice(-1)[0]
      return tile.data
    },
    rightComp () {
      let tile = this._data._$$rightCompStack.slice(-1)[0]
      return tile.comp
    },
    rightCustomProps () {
      let tile = this._data._$$rightCompStack.slice(-1)[0]
      return tile.data
    },
    leftPopable () {
      return this._data._$$leftCompStack.length > 1
    },
    rightPopable () {
      return this._data._$$rightCompStack.length > 1
    }
  },
  methods: {
    popLeft (predicate) {
      if (this._data._$$leftCompStack.length > 1) {
        if (_.isFunction(predicate)) {
          _.reverse(_.clone(this._data._$$leftCompStack)).forEach(s => {
            let result = predicate(s)
            if (result === true) {
              try {
                let tile = this._data._$$leftCompStack.pop()
                if (_.isFunction(tile.whenPoped)) {
                  tile.whenPoped(tile)
                }
              } catch (e) {}
            }
            return !!result && this._data._$$leftCompStack.length > 1
          })
        } else {
          let tile = this._data._$$leftCompStack.pop()
          if (_.isFunction(tile.whenPoped)) {
            tile.whenPoped(tile)
          }
        }
      } else {
        LOG.warn('左侧已经是底层...')
      }
    },
    pushLeft (comp, data, whenPoped) {
      let top = this._data._$$leftCompStack.slice(-1)[0]
      if (top && top.comp === comp) {
        top.data = { ...top.data, ..._.clone(data) }
        top.whenPoped = whenPoped
        LOG.warn('[左侧]请不要重复push两次相关组件')
      } else {
        let tile = { comp, data: _.clone(data), whenPoped }
        this._data._$$leftCompStack.push(tile)
      }
    },
    changeLeftData (comp, cb) {
      let tile = _.find(this._data._$$leftCompStack, s => s.comp === comp)
      if (tile && _.isFunction(cb)) {
        cb(tile.data)
      }
    },
    popRight (predicate) {
      if (this._data._$$rightCompStack.length > 1) {
        if (_.isFunction(predicate)) {
          _.reverse(_.clone(this._data._$$rightCompStack)).forEach(s => {
            let result = predicate(s)
            if (result === true) {
              try {
                let tile = this._data._$$rightCompStack.pop()
                if (_.isFunction(tile.whenPoped)) {
                  tile.whenPoped(tile)
                }
              } catch (e) {}
            }
            return !!result && this._data._$$rightCompStack.length > 1
          })
        } else {
          let tile = this._data._$$rightCompStack.pop()
          if (_.isFunction(tile.whenPoped)) {
            tile.whenPoped(tile)
          }
        }
      } else {
        LOG.warn('右侧已经是底层...')
      }
    },
    pushRight (comp, data, whenPoped) {
      let top = this._data._$$rightCompStack.slice(-1)[0]
      if (top && top.comp === comp) {
        top.data = { ...top.data, ..._.clone(data) }
        top.whenPoped = whenPoped
        LOG.warn('[右侧]请不要重复push两次相关组件')
      } else {
        let tile = { comp, data: _.clone(data), whenPoped }
        this._data._$$rightCompStack.push(tile)
      }
    },
    changeRightData (comp, cb) {
      let tile = _.find(this._data._$$rightCompStack, s => s.comp === comp)
      if (tile && _.isFunction(cb)) {
        cb(tile.data)
      }
    }
  }
}
