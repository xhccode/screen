/**
 * 系统事件类型
 */
export default {
  /**
   * ======= 通话相关事件 =======
   */
  // 视频通话邀请
  // RTC_INVITED: 'RTC_INVITED',
  // 呼叫用户进入通话房间
  RTC_USER_ENTER: 'RTC_USER_ENTER',
  // 对方拒绝通话
  RTC_REJECT: 'RTC_REJECT',
  // 重复登录，被踢出房间
  KICKED_OUT: 'KICKED_OUT',
  // 发起方取消拨号
  RTC_CALLING_CANCEL: 'RTC_CALLING_CANCEL',
  // 本次通话结束
  RTC_CALL_END: 'RTC_CALL_END',
  // 对方摄像头可用
  RTC_USER_VIDEO_AVAILABLE: 'RTC_USER_VIDEO_AVAILABLE',
  // 对方麦克风可用
  RTC_USER_AUDIO_AVAILABLE: 'RTC_USER_AUDIO_AVAILABLE',
  // 超时未应答
  RTC_USER_CALLING_TIMEOUT: 'RTC_USER_CALLING_TIMEOUT',
  // 对方无应答
  RTC_USER_NO_RESP: 'RTC_USER_NO_RESP',
  // 对方忙线
  RTC_USER_LINE_BUSY: 'RTC_USER_LINE_BUSY',
  // 对方无应答
  RTC_USER_USER_LEAVE: 'RTC_USER_USER_LEAVE',
  // 消息到达
  TIM_MESSAGE_RECEIVED: 'TIM_MESSAGE_RECEIVED',
  // 消息被撤回
  TIM_MESSAGE_REVOKED: 'TIM_MESSAGE_REVOKED',
  // TIM登录状态变更事件
  TIM_STATUS_CHANGE: 'TIM_STATUS_CHANGE',

  /**
   * ======== 地图事件 ========
   */
  // 标点点击
  MARKER_CLICK: 'MARKER_CLICK',
  // 图层鼠标事件： mouseover mouseout
  LAYER_MOUSE: 'LAYER_MOUSE',
  // 图层双击事件
  LAYER_DBCLICK: 'LAYER_DBCLICK',
  // 地图上单元格类型切换
  MAP_UNIT_TYPE_CHANGE: 'MAP_UNIT_TYPE_CHANGE',
  // 地图上区域选择
  MAP_REGION_CHANGE: 'MAP_REGION_CHANGE',
  // 圈选事件（绘制圆圈后 或 移除圆圈后，触发该事件）
  MAP_CIRCLE_CHANGED: 'MAP_CIRCLE_CHANGED',
  // 圈选事件事件类型（绘制圆圈）
  MAP_CIRCLE_DRAW: 'MAP_CIRCLE_DRAW',
  // 圈选事件事件类型（移除圆圈）
  MAP_CIRCLE_REMOVED: 'MAP_CIRCLE_REMOVED',
  // 全选范围修改
  MAP_CIRCLE_SCOPE_CHANGE: 'MAP_CIRCLE_SCOPE_CHANGE',

  /**
   * 全局日历
   */
  CALENDAR_DATA_PICKED: 'CALENDAR_DATA_PICKED',

  // 发布指令
  PUBLIC_DIRECT: 'PUBLIC_DIRECT',

  // 轮询开始
  POLL_START: 'POLL_START',
  // 轮询开始
  POLL_END: 'POLL_END'
}
