/**
 * 指挥中心的相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2244
   * 右侧获取网格力量（巡查走访 信息采集 离线）数量统计-周文才
   * dMonth 月份（非必填）
   * @param { orgCode ,dMonth} data
   * @returns
   */
  getPowerGridStatistical (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/rightStatisticsAndQueries/getPowerGridStatistical`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3027
   * 网格治理事件冒泡-李峥宇
   * @param {orgCode} data
   * @returns
   */
  getGridGovernanceBubbleQuery (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/popUpBox/getGridGovernanceBubbleQuery`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_EVENT)
      }
    }
    return $axios(service, data)
  },
  /**
   * data: 事件数据的primaryKey
   * @param data 事件的primaryKey
   * @returns frame的url
   */
  // 网格治理事件冒泡 iframe
  getBubbleQueryIframe (data) {
    let eventCode = data.split('|').slice(-1)[0]
    return `${process.env.EVENT_IFRAME}/issuePendingThire/issuePending_commanddetail/${eventCode}`
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2028
   * 点调中心对话框-左下分页查询中心力量人员信息-肖舒文
   * @param {pageSize , currPage , orgCode} data
   * @returns
   */
  queryPageForCenterUser (data) {
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/gridCenter/queryPageForCenterUser`,
      markerable: function ({ data: { data } }) {
        _.forEach(data.list, d => {
          let { account, loginName } = d
          d.account = account || loginName
          d.loginName = loginName || account
        })
      }
    }
    // 临时修改: 因东港返回的人员信息有异常
    if (data.orgCode === '320205107000') {
      return new Promise((resolve, reject) => {
        resolve({
          data: {
            msg: '操作成功',
            code: 1,
            data: {
              totalCount: 6,
              pageSize: 500,
              totalPage: 1,
              currPage: 1,
              list: [
                {
                  url: 'http://2.16.66.41:8881/photo/defaultPhoto/defaultPhoto.jpg',
                  name: '王英飞',
                  post: '中心管理员',
                  phone: '18168860855',
                  userId: '320205|2380',
                  account: 'Awxxsdg001',
                  onlineStatus: null,
                  netType: null,
                  loginType: null,
                  canCall: null,
                  userStatus: null,
                  onDuty: '未值班',
                  orgCode: '320205107000',
                  orgName: '锡山区-东港镇',
                  channelId: '34020000001320000001',
                  deviceId: '32020509021328000001'
                },
                {
                  url: 'http://2.16.66.41:8881/photo/20210409/zx/8e6cbfee-589c-4c1c-a657-2f0f1c8dd9ea.jpg',
                  name: '蒋雅云',
                  post: '中心管理员',
                  phone: '15961742672',
                  userId: '320205|47342',
                  account: 'Dwxxsdg005',
                  onlineStatus: null,
                  netType: null,
                  loginType: null,
                  canCall: null,
                  userStatus: null,
                  onDuty: '未值班',
                  orgCode: '320205107000',
                  orgName: '锡山区-东港镇',
                  channelId: '34020000001320000001',
                  deviceId: '32020509021328000001'
                },
                {
                  url: 'http://2.16.66.41:8881/photo/20210409/zx/ca3ff77f-e0ec-4ec1-a844-b0dbfd4ff9d2.jpg',
                  name: '张薇',
                  post: '中心管理员',
                  phone: '18015320358',
                  userId: '320205|47340',
                  account: 'Dwxxsdg003',
                  onlineStatus: null,
                  netType: null,
                  loginType: null,
                  canCall: null,
                  userStatus: null,
                  onDuty: '未值班',
                  orgCode: '320205107000',
                  orgName: '锡山区-东港镇',
                  channelId: '34020000001320000001',
                  deviceId: '32020509021328000001'
                },
                {
                  url: 'http://2.16.66.41:8881/photo/20210409/zx/c4d913f6-1c1d-4b0c-97f0-e3ee76eee162.jpg',
                  name: '戴立',
                  post: '中心管理员',
                  phone: '13961887444',
                  userId: '320205|47339',
                  account: 'Dwxxsdg002',
                  onlineStatus: null,
                  netType: null,
                  loginType: null,
                  canCall: null,
                  userStatus: null,
                  onDuty: '未值班',
                  orgCode: '320205107000',
                  orgName: '锡山区-东港镇',
                  channelId: '34020000001320000001',
                  deviceId: '32020509021328000001'
                }
              ]
            }
          }
        })
      })
    }
    return $axios(service, data)
  },

  /**
   * http://47.100.91.141:3000/project/105/interface/api/2883
   * 按经纬度查询附近的网格员或监控点位-李峥宇
   * 使用场景: 1、圈选地图画出网格员或者监控点位 2、添加与会人或者监控点位时的下拉列表
   * scope: 1000以内传1，500米以内传0.5 覆盖范围（最小0.1公里 最大3公里）
   * queryType: 统计对象（1：专职网格员 2：监控设备 3事件）只能传 "1", "2", "3", "1,2", "1,3", "2,3", "1,2,3"
   * monitorSource: 监控业务来源：1雪亮工程（厂家：海康 大华）；2重点地标（厂家：清新互联）3网格中心（厂家：理想自建）5锡山视频云（厂家：海康）
   * sign: 查询条件模糊匹配，人员真是姓名 或者 监控点名称
   * @param {longitude , latitude , queryType, scope, monitorSource, sign} data
   * @returns
   */
  getGeospatialData (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/popUpBox/getGeospatialData`,
      markerable: function ({ data: { data } }) {
        _.forEach(data, d => {
          if (d.queryType === '1') {
            MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_GRID)
            _.forEach(data, d => {
              let { account, loginName } = d
              d.account = account || loginName
              d.loginName = loginName || account
              d.name = d.name || d.realName
              d.realName = d.realName || d.name
              d.$timOnline = false
            })
          } else if (d.queryType === '2') {
            MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_VIDEO)
          } else if (d.queryType === '3') {
            MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_EVENT)
          }
        })
      }
    }
    return $axios(service, { ...data })
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2064
   * @param {orgCode} data
   * @returns
   */
  // 中间网格内人员信息<TODO:网格级联弹窗>
  getGridBasicPersonnelInfo (data) {
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/videoBounced/getGridBasicPersonnelInfo`,
      markerable: function ({ data: { data } }) {
        let { gridMember } = data
        if (gridMember && gridMember.length) {
          _.forEach(gridMember, d => {
            let { account, loginName } = d
            d.account = account || loginName
            d.loginName = loginName || account
          })
        }
      }
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3738
   * 点调中心对话框-获取区域门头，挂牌，工作场景照片-肖舒文
   * @param {orgCode} data
   */
  // 中心点调 - 根据orgCode获取指挥中心的图片
  getCenterBackground (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/gridCenter/getCenterBackground`
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * 未找到Yapi地址
   * addressee: 收件人信息，格式："用户XXXXXXXXXXX;用户XXXXXXXXXXX"
   * sender: 发送人的姓名,
   * senderCompany: 发送人的组织信息 格式 {sessionStorage.getItem('orgName')} + '联动指挥',
   * smsContent: 发送的内容,
   * smsTemplate: '通知类'
   *
   * @param {addressee，sender，senderCompany，smsContent，smsTemplate} data
   * @returns
   */
  // 发送短信
  sendShortMsg (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/smsSendSingleShot'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2253
   * 右侧获取网格力量（专职网格员 监控点位 人房企 三个tatale页的接口合并为一个）分页查询-周文才
   * type 类型（1：专职网格员 2：监控点位 3：人  8：房 9：企
   * @param {pageSize, currPage, keyword, type} data
   * @returns
   */
  getPowerTabsData (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/rightStatisticsAndQueries/queryPageForPowerGrid`,
      markerable: function ({ data: { data } }) {
        _.forEach(data.list, d => {
          if (d.loginName) {
            MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_GRID)
            let { account, loginName } = d
            d.account = account || loginName
            d.loginName = loginName || account
            d.$timOnline = false
          } else if (d.deviceId) {
            MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_VIDEO)
          } else {
            // todo 房子
          }
        })
      }
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    // deviceStatus =1  在线，只查看在线的
    return $axios(service, { ...data })
  },
  getPowerTabsData1 (data) {
    let service = {
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
        orgCode: 320205
      },
      baseURL: process.env.EVENT_V2_URL,
      method: 'get',
      url: `/datacenter/dataView/panoramaView/rightStatisticsAndQueries/queryPageForPowerGrid`,
      markerable: function ({ data: { data } }) {
        _.forEach(data.list, d => {
          if (d.loginName || d.account) {
            MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_GRID)
            let { account, loginName } = d
            d.account = account || loginName
            d.loginName = loginName || account
            d.$timOnline = false
          } else if (d.deviceId) {
            MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_VIDEO)
          } else {
            // todo 房子
          }
        })
      }
    }
    return $axios(service, {
      currPage: data.currPage,
      pageSize: data.pageSize,
      keyword: data.keyword,
      type: 'gridMember'
    })
  },
  getImportAddrType (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/leftQueryCriteria/getQueryCriteriaDictionary`
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    // deviceStatus =1  在线，只查看在线的
    return $axios(service, { ...data })
  },
  getImportAddrList (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/mapsPoint/getManagementElementsSprinklePoints`,
      markerable: function ({ data: { data } }) {
        _.forEach(data, d => {
          MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_SITE)
        })
      }
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    // deviceStatus =1  在线，只查看在线的
    return $axios(service, { ...data })
  },
  getImportAddrInfo (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/details/getCompanyDetails`
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    // deviceStatus =1  在线，只查看在线的
    return $axios(service, { ...data })
  },

  /**
   * http://47.100.91.141:3000/project/105/interface/api/2253
   * 右侧获取网格业务（事件 走访 隐患 矛盾）数量统计-周文才
   * @returns
   */
  getGridRegionalStatistical () {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/rightStatisticsAndQueries/getGridBusinessStatistical`
    }
    return $axios(service)
  },
  /**
   * 重点人员
   */
  getStressPersonList (params) {
    const service = {
      method: 'post',
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
      },
      baseURL: process.env.EVENT_V2_URL,
      url: `/datacenter/v1/stressPerson/getStressPersonList`,
      markerable: function ({ data: { data } }) {
        _.forEach(data.list, d => {
          MAP.touchMarkerType(d, MAP.MARKER_TYPES.MK_GRID)
          d.type = 8
          d.title = d.label + ' - ' + d.name
          d.gridName = d.fullName
          d.orgName = d.fullName
          d.time = d.lastDate
          d.latitude = d.zxdzzb
          d.longitude = d.zxdhzb
        })
      }
    }
    return $axios(service, params)
  },
  /**
   * 重点人员-基本信息
   */
  getPeopleData (params) {
    const service = {
      method: 'post',
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
      },
      baseURL: process.env.EVENT_V2_URL,
      url: `/datacenter/v1/peopleInfo/getPeopleData`,
    }
    return $axios(service, params)
  },
  /**
   * 重点人员-走访记录
   */
  getVisitList (params) {
    const service = {
      method: 'post',
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
      },
      baseURL: process.env.EVENT_V2_URL,
      url: `/datalog/v1/passiveVisits/getVisitsList`,
    }
    return $axios(service, params)
  },
  /**
   * 重点人员-走访记录详情
   */
  getFocusPersonnelData (params) {
    const service = {
      method: 'post',
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
      },
      baseURL: process.env.EVENT_V2_URL,
      url: `/datalog/v1/passiveVisits/getFocusPersonnelData`,
    }
    return $axios(service, params)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2271
   * 右侧获取网格业务（事件 走访 隐患 矛盾）分页查询-周文才
   * gridBusinessType : 网格业务类型（4：事件  5：走访  6：隐患  7: 矛盾）
   * @param {pageSize, currPage, gridBusinessType, keyword} data
   * @returns
   */
  getRegionalEvtList (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/rightStatisticsAndQueries/queryPageForGridBusiness`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data.list, MAP.MARKER_TYPES.MK_EVENT)
      }
    }
    return $axios(service, data)
  },
  getEventDetail (id) {
    let service = {
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
      },
      baseURL: process.env.EVENT_V2_URL,
      method: 'get',
      url: `/event-v2/wg-events/${id}`
    }
    return $axios(service)
  },
  secureUrl(key) {
    let service = {
        headers: {
          appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
          auth: localStorage.getItem('authPC') || '',
        },
        baseURL: process.env.EVENT_V2_URL,
        method: 'get',
        url: `/oss/oss/secure-url?objectKey=${key}`
    }
    return $axios(service)
  },
  workers(id) {
      let service = {
        headers: {
          appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
          auth: localStorage.getItem('authPC') || '',
        },
        method: 'get',
        baseURL: process.env.EVENT_V2_URL,
        url: `/event-v2/works/?eventId=${id}&responsible=true&supplement=false`
      }
      return $axios(service)
  },
  getInvolvedAtts(id) {
    let service = {
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
      },
      method: 'get',
      baseURL: process.env.EVENT_V2_URL,
      url: `/event-v2/wg-events/${id}/involved-atts`
    }
    return $axios(service)
  },
  processings(id) {
    return $axios({
      headers: {
        appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
        auth: localStorage.getItem('authPC') || '',
      },
      method: 'get',
      baseURL: process.env.EVENT_V2_URL,
      url: `/event-v2/wg-events/${id}/trajectories`
    })
  },
  login30 (accountName) {
    const service = {
      method: 'post',
      baseURL: process.env.EVENT_URL,
      url: `/dataView/system/authentication`
    }
    return $axios(service, {
      loginName: accountName,
      password: "$!$" + btoa('A123456wx%')
    })
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2955
   * 监控设备（雪亮工程，重点地标，锡山视频云）列表-李峥宇
   * monitorSource : 监控业务来源：1雪亮工程（厂家：海康 大华）；2重点地标（厂家：清新互联）3网格中心（厂家：理想自建）5锡山视频云（厂家：海康）
   * address（模糊查询）: 监控点名称或者安装地址（雪亮工程 重点地标 网格中心 锡山视频云 通用）
   * @param {pageSize, currPage, monitorSource, address, orgCode} data
   * @returns
   */
  getMonitorData (data) {
    const service = {
      method: 'get',
      url: `/dataView/home/videoCenter/queryPageForVideoList`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data.list, MAP.MARKER_TYPES.MK_VIDEO)
      }
    }
    // deviceStatus = 1在线， 目前只查看在线的
    return $axios(service, { ...data, deviceStatus: 1 })
  },
  // 获取轮询组列表
  getPollList (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/video-rotation/page`
    }
    return $axios(service, data)
  },
  // 获取某个轮询组的视频列表
  getPollDetail (id) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/video-rotation/${id}`
    }
    return $axios(service)
  },
  getLiveBroadcastUrl (deviceId) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/video/${deviceId}/playstate`
    }
    return $axios(service)
  },
  getOrgIdFromCode (orgcode) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-upms/sys-org/info/${orgcode}`
    }
    return $axios(service)
  },
  // 点调纪要
  getCentralList (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-command/central-conversation/dapin`
    }
    return $axios(service, data)
  },
  addCentral (data) {
    const service = {
      method: 'post',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-command/central-conversation/dapin/save`
    }
    return $axios(service, data)
  },
  // 无人机
  // 指定街镇下的所有无人机
  getUavList (orgCode) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/uav/of/${orgCode}`,
      markerable: function ({ data: { body } }) {
        MAP.touchMarkerType(body, MAP.MARKER_TYPES.MK_UAV)
      }
    }
    return $axios(service)
  },
  getNearbyUavList (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/uav/nearby`,
      markerable: function ({ data: { body } }) {
        MAP.touchMarkerType(body, MAP.MARKER_TYPES.MK_UAV)
      }
    }
    return $axios(service, data)
  },
  updateUav (data) {
    const service = {
      method: 'put',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/uav`
    }
    return $axios(service, data)
  },

  getLinkerList (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/ec-linker/page`
    }
    return $axios(service, data)
  },
  getLinkerListAll (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/ec-linker`
    }
    return $axios(service, data)
  },
  addLinker (data) {
    const service = {
      method: 'post',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/ec-linker`
    }
    return $axios(service, data)
  },
  updateLinker (data) {
    const service = {
      method: 'put',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/ec-linker`
    }
    return $axios(service, data)
  },
  deleteLinker (id) {
    const service = {
      method: 'delete',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/ec-linker/${id}`
    }
    return $axios(service)
  },
  getOlderVideos () {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-video/video/oldmanVideo`
    }
    return $axios(service)
  },
  getOlders (id) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-ostf/emptynesters/oldman/${id}`
    }
    return $axios(service)
  },
  getOlder (id) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-ostf/emptynesters/oldman/${id}`
    }
    return $axios(service)
  }
}
