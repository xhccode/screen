import Vue from 'vue'
import Vuex from 'vuex'
import STATE from './States'
import moment from 'moment'
import EventModel from '@/model/EventModel.js'
import API from '@/api/index'

Vue.use(Vuex)

let userStr = sessionStorage.getItem(STATE.USER_INFO)
let orgStr = sessionStorage.getItem(STATE.USER_ORG)
let pollStr = sessionStorage.getItem(STATE.POLL)
export default new Vuex.Store({
  state: {
    [STATE.USER_INFO]: userStr ? JSON.parse(userStr) : {},
    [STATE.USER_ORG]: orgStr ? JSON.parse(orgStr) : {},
    [STATE.AUTHORIZATION_CODE]:
      sessionStorage.getItem(STATE.AUTHORIZATION_CODE) || '',
    // 轮询组信息
    [STATE.POLL]: pollStr ? JSON.parse(pollStr) : {},
    // 是否有新的特急事件
    [STATE.HAS_EXPRESS_EVENT]: false,
    // 是否有新的紧急事件
    [STATE.HAS_URGENT_EVENT]: false,
    // 当前RTC SDK状态
    [STATE.RTC_ONLINE]: false,
    // 是否为通话发起方
    [STATE.IS_INVITER]: false,
    // 当前RTC通话状态
    [STATE.CALLSTATUS]: 'idle',
    // 当前群呼群组id
    [STATE.GROUPID]: '',
    // 当前群组人员
    [STATE.GROUP_MEMBERS]: [],
    // 受理中心数量
    [STATE.REPORT_CENTER]: {
      passiveAcceptanceNum: 0, // 被动受理统计数
      passiveAcceptanceCompared: 0, // 被动受理对比
      oneHotLineNum: 0, // 12345热线统计数
      nonPoliceNum: 0, // 110非警务统计数
      districtCenterNum: 0, // 区中心热线统计数
      sevenHotLineNum: 0, // 71580热线统计数
      voluntarilyNum: 0, // 主动报送统计数
      voluntarilyCompared: 0, // 主动报送对比
      gridNum: 0, // 网格报送统计数
      districtUrbanManagementNum: 0, // 区城管报送统计数
      cellNum: 0, // 管理单元格报送统计数
      sanitationNum: 0, // 环保统计数
      urbanManagementNum: 0, // 城管统计数
      emergencyNum: 0, // 应急统计数
      comprehensiveNum: 0, // 综治网格统计数
      publicNUm: 0, // 公众号上报统计数
      otherNum: 0, // 其他统计数
      today: 0 // 今日发现
    },
    // 实时工单数量
    [STATE.REALTIME_TICKET]: {
      realTime: 0, // 实时工单:有效未办结的
      expressNum: 0, // 特急工单数量
      urgentNum: 0, // 紧急工单数量
      normalNum: 0, // 标准工单数量
      toBeDispatchNum: 0, // 待分派统计数
      disposalNum: 0, // 处置中统计数
      evaluationNum: 0, // 评价中统计数
      processNum: 0, // 办理中统计数
      superviseNum: 0, // 督办中统计数
      urgeNum: 0 // 催办中统计数
    },
    // 事件列表
    [STATE.EVENTS]: {
      ExtraUrgentList: [],
      UrgentList: [],
      NormalList: []
    },
    // 事件已读
    [STATE.HAS_EXPRESS_EVENT]: false,
    [STATE.HAS_URGENT_EVENT]: false,
    // 当前一键会商是否开启
    meeting: false
  },
  mutations: {
    // 当前用户
    [STATE.USER_INFO] (state, user) {
      state[STATE.USER_INFO] = user
      sessionStorage.setItem(STATE.USER_INFO, JSON.stringify(user))
    },
    // 当前用户所属机构
    [STATE.USER_ORG] (state, org) {
      // org.orgCode = org.orgCode.slice(0, 12)
      state[STATE.USER_ORG] = org
      sessionStorage.setItem(STATE.USER_ORG, JSON.stringify(org))
    },
    // 当前安全令牌
    [STATE.AUTHORIZATION_CODE] (state, authorizationCode) {
      state[STATE.AUTHORIZATION_CODE] = authorizationCode
      sessionStorage.setItem(STATE.AUTHORIZATION_CODE, authorizationCode)
    },
    // 轮询组信息
    [STATE.POLL] (state, poll) {
      state[STATE.POLL] = poll
      sessionStorage.setItem(STATE.POLL, JSON.stringify(poll))
    },
    // 是否有新的特急事件
    [STATE.HAS_EXPRESS_EVENT] (state, hasEagedEvent) {
      state[STATE.HAS_EXPRESS_EVENT] = hasEagedEvent
    },
    // 是否有新的紧急事件
    [STATE.HAS_URGENT_EVENT] (state, hasEagedEvent) {
      state[STATE.HAS_URGENT_EVENT] = hasEagedEvent
    },
    // TRTC 在线状态
    [STATE.TRTC_ONLINE] (state, online) {
      state[STATE.TRTC_ONLINE] = online
    },
    // 是否为通话发起方
    [STATE.IS_INVITER] (state, isInviter) {
      state[STATE.IS_INVITER] = isInviter
    },
    // 当前RTC通话状态
    [STATE.CALLSTATUS] (state, callStatus) {
      state[STATE.CALLSTATUS] = callStatus
    },
    [STATE.GROUPID] (state, groupID) {
      state[STATE.GROUPID] = groupID
    },
    // 当前群组
    [STATE.GROUP_MEMBERS] (state, users) {
      state[STATE.GROUP_MEMBERS] = users || []
    },
    resetRTC (state) {
      state[STATE.IS_INVITER] = false
      state[STATE.CALLSTATUS] = 'idle'
      // state[STATE.GROUPID] = ''
      // state[STATE.GROUP_MEMBERS] = [] //
    },
    joinGroup (state, user) {
      if (
        _.findIndex(
          state[STATE.GROUP_MEMBERS],
          u => u.account === user.account
        ) === -1
      ) {
        state[STATE.GROUP_MEMBERS].push(user)
      }
    },
    levelGroup (state, user) {
      let index = _.findIndex(
        state[STATE.GROUP_MEMBERS],
        u => u.account === user.account
      )
      if (index > -1) {
        state[STATE.GROUP_MEMBERS].splice(index, 1)
      }
    },
    // 修改受理中心数量
    [STATE.REPORT_CENTER] (state, data) {
      state[STATE.REPORT_CENTER] = { ...state[STATE.REPORT_CENTER], ...data }
    },
    // 修改实时工单数量
    [STATE.REALTIME_TICKET] (state, data) {
      state[STATE.REALTIME_TICKET] = {
        ...state[STATE.REALTIME_TICKET],
        ...data
      }
    },
    // 修改事件列表
    [STATE.EVENTS] (state, data) {
      state[STATE.EVENTS] = {
        ExtraUrgentList: data.expressList,
        UrgentList: data.urgentList,
        NormalList: data.normalList
      }
    },
    // 修改事件已读状态
    [STATE.HAS_EXPRESS_EVENT] (state, data) {
      state[STATE.HAS_EXPRESS_EVENT] = data
    },
    [STATE.HAS_URGENT_EVENT] (state, data) {
      state[STATE.HAS_URGENT_EVENT] = data
    },
    //
    meeting (state, meeting) {
      state.meeting = meeting
    }
  },
  actions: {
    /**
     * 获取受理中心数量和实时工单数量
     * @param {object} param0 - context
     * @param {object} payload - 请求参数
     * @returns Promise
     */
    async getEventNumData ({ commit, state }, payload) {
      if (!payload) {
        payload = {
          orgCode: state[STATE.USER_ORG.orgCode],
          dateTime: moment(new Date()).format('YYYY-MM-DD')
        }
      }
      return new Promise((resolve, reject) => {
        API.dispatch
          .getEventNumData({
            orgCode: payload.orgCode || state[STATE.USER_ORG].orgCode,
            typeName: 'bdsl,zdbs,zdyj,bxgj,slzx',
            areaLevel: payload.orgDepth || state[STATE.USER_ORG].orgDepth,
            dataType: '1',
            dateTime:
              payload.dateTime || moment(new Date()).format('YYYY-MM-DD')
          })
          .then(res => {
            if (res.data.code === 1) {
              if (state[STATE.USER_ORG].orgCode == CONSTANT.HQ_ORGCODE) {
                commit(STATE.REALTIME_TICKET, {
                  ...res.data.data,
                  toBeDispatchNum: 2,
                  disposalNum: 2,
                  processNum: 2
                })
                API.command
                  .getGridRegionalStatistical()
                  .then(({ data: { data } }) => {
                    commit(STATE.REPORT_CENTER, {
                      ...res.data.data,
                      oneHotLineNum: 7,
                      passiveAcceptanceNum: 7,
                      gridNum: data.event,
                      voluntarilyNum: res.data.data.voluntarilyNum + data.event
                    })
                  })
              } else {
                commit(STATE.REPORT_CENTER, res.data.data)
                commit(STATE.REALTIME_TICKET, res.data.data)
              }
              resolve()
            } else {
              reject(res.msg)
            }
          })
      })
    },
    /**
     * 获取特急、紧急、普通事件列表
     * @param {object} param0 - context
     * @param {object} payload - 请求参数
     * @returns Promise
     */
    async getEventLists ({ commit, state }, payload) {
      if (!payload) {
        payload = {
          orgCode: state[STATE.USER_ORG].orgCode,
          areaCode: state[STATE.USER_ORG].areaCode,
          dateTime: moment(new Date()).format('YYYY-MM-DD')
        }
      }
      return new Promise((resolve, reject) => {
        API.dataHome
          .getRingEvent({
            areaCode: payload.orgDepth || state[STATE.USER_ORG].orgDepth,
            orgCode: payload.orgCode || state[STATE.USER_ORG].orgCode,
            dateTime:
              payload.dateTime || moment(new Date()).format('YYYY-MM-DD')
          })
          .then(res => {
            if (res.data.code === 1) {
              let hasNewExpress = false
              let hasNewUrgent = false
              let expressList = res.data.data.expressList.map(item => {
                if (item.readFlag === '0') {
                  hasNewExpress = true
                }
                return new EventModel(
                  item.ybeventCode,
                  item.msgTitle,
                  item.acceptTime,
                  item.mapLong,
                  item.mapLat,
                  '',
                  '',
                  item.priority,
                  item.fromDistrict,
                  item.fromAddress
                )
              })
              let urgentList = res.data.data.urgentList.map(item => {
                if (item.readFlag === '0') {
                  hasNewUrgent = true
                }
                return new EventModel(
                  item.ybeventCode,
                  item.msgTitle,
                  item.acceptTime,
                  item.mapLong,
                  item.mapLat,
                  '',
                  '',
                  item.priority,
                  item.fromDistrict,
                  item.fromAddress
                )
              })
              let normalList = res.data.data.normalList.map(item => {
                return new EventModel(
                  item.ybeventCode,
                  item.msgTitle,
                  item.acceptTime,
                  item.mapLong,
                  item.mapLat,
                  '',
                  '',
                  item.priority,
                  item.fromDistrict,
                  item.fromAddress
                )
              })
              commit(STATE.EVENTS, { expressList, urgentList, normalList })
              commit(STATE.HAS_EXPRESS_EVENT, hasNewExpress)
              commit(STATE.HAS_URGENT_EVENT, hasNewUrgent)
              resolve()
            } else {
              reject(res.msg)
            }
          })
      })
    },
    /**
     * 事件已读状态更新
     * @param {object} param0 - context
     * @param {object} payload - 请求参数
     * @returns Promise
     */
    async updateEventReadflag ({ commit, state }, type) {
      let events =
        type === 'EXPRESS'
          ? state[STATE.EVENTS].expressList
          : state[STATE.EVENTS].urgentList
      let eventIDs = _.filter(events, e => e.readFlag === 0).map(
        e => e.primaryKey
      )
      _.forEach(eventIDs, async function (id) {
        await API.dispatch.updateRingEvent(id)
      })
      // 修改事件警告标识
      if (type === 'EXPRESS') {
        commit(STATE.HAS_EXPRESS_EVENT, false)
      } else {
        commit(STATE.HAS_URGENT_EVENT, false)
      }
    }
  }
})
