/**
 * 前端所有枚举值
 */
const CommandTaskStatus = {
  running: '处理中',
  terminated: '已终止',
  completed: '已完成'
}
// 指令任务类型
const CommandTaskType = {
  notice: '通知类',
  visit: '走访类',
  affair: '事件类'
}
// 问答类型
const QAType = {
  0: '咨询类',
  1: '协助类'
}

let $enum = {
  // 指令任务状态
  CommandTaskStatus,
  CommandTaskType,
  QAType
}
export default {
  install (Vue) {
    Vue.prototype.$enum = $enum
  },
  $enum: $enum
}
