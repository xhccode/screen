/**
 * 平台日志
 */
export default {
  log () {
    console.info.apply(null, Array.prototype.slice.call(arguments))
  },
  debug () {
    console.debug.apply(null, Array.prototype.slice.call(arguments))
  },
  info () {
    console.info.apply(null, Array.prototype.slice.call(arguments))
  },
  warn () {
    console.warn.apply(null, Array.prototype.slice.call(arguments))
  },
  error () {
    console.error.apply(null, Array.prototype.slice.call(arguments))
  },
  dir () {
    if (process.env.NODE_ENV === 'development') {
      console.dir.apply(null, Array.prototype.slice.call(arguments))
    }
  },
  // 监控函数执行时间
  monitor (funcName, func) {
    if (process.env.NODE_ENV === 'development') {
      console.time(funcName)
      new Promise(function (resolve, reject) {
        func(resolve, reject)
      })
        .then(function () {
          console.timeEnd(funcName)
        })
        .catch(function (e) {
          console.timeEnd(funcName)
        })
    }
  }
}
