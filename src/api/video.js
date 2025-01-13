/**
 * 视频中心相关api
 */
import $axios from '@/utils/axios.js'
import axios from 'axios'
import qs from 'qs'
export default {
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3261
   * 获取监控详情-李峥宇
   * @param {orgCode} data
   */
  getMonitorDetail (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/details/getMonitorDetail`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_VIDEO)
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2793
   * 获取直播URL（1雪亮工程；2重点地标（美丽无锡，清新互联））-李峥宇
   * deviceId: 监控ID（设备ID）
   * channelId:  通道ID, monitorSource为重点地标时，必须传
   * monitorAddressCode:  监控点编号（雪亮工程 锡山视频云 有   重点地标 网格中心 没有）
   * monitorSource: 监控业务来源：1雪亮工程（厂家：海康 大华）；2重点地标（厂家：清新互联）3网格中心（厂家：理想自建）5锡山视频云（厂家：海康）
   * @param {deviceId, [channelId], [monitorAddressCode], monitorSource} data
   */
  // 获取视频地址
  getLiveBroadcastUrl (data) {
    let { deviceId, channelId, monitorAddressCode, monitorSource } = data
    switch (+monitorSource) {
      case 3 /* 网格中心 */:
      case 4 /* 理想自建 */:
        return new Promise(function (resolve, reject) {
          axios.post(process.env.VIDEO_API, qs.stringify(data)).then(({ data }) => {
            if (data.code === 1 && data.data.code === 200) {
              // (1 = rtmp), (2 = http), (4 = websocket)
              let playAddress = _.find(data.data.data.playAddressInfos, d => d.playType === 4)
              if (_.isObject(playAddress)) {
                resolve(playAddress.playAddress)
              } else {
                resolve(data.data.data.playAddressInfos[0].playAddress)
              }
            } else {
              LOG.error(data.message)
            }
          })
        })
      case 1 /* 雪亮工程 */:
      case 2 /* 重点地标 */:
      case 5 /* 海康（锡山视频云） */:
    }
    return new Promise(resolve => {
      let service = {
        headers: {
          appid: 'c668b254-05b7-4471-9233-637fc57a71ae',
          auth: localStorage.getItem('authPC') || '',
          orgCode: 320205
        },
        method: 'post',
        url: `/dataView/panoramaView/telephoneVideoCommunication/getLiveBroadcastUrl`
      }
      $axios(service, {
        ...data,
        monitorSource:'1'
      }).then(res => {
        let newUrl = null
        if(res.data.url){
          newUrl = res.data.url.replace('http://2.16.66.38:83', `https://2.16.66.38:8092`)
        }
        resolve(newUrl)
      }).catch(err => {
        console.log(err,'0329')
      })
    })
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/1713
   * monitorSource(非必须): 监控业务来源：1雪亮工程（厂家：海康 大华）；2重点地标（厂家：清新互联）3网格中心（厂家：理想自建）5锡山视频云（厂家：海康）
   * isQueryOneself(非必须): 是否查询本级 0：否（只显示全部下级） 1：是（显示本级及全部下级）2：只看本级
   * @param {pageSize ,currPage ,monitorSource, isQueryOneself} data
   * @returns
   */
  getVidioList (data) {
    const service = {
      method: 'post',
      url: `/dataView/home/videoCenter/queryPage`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data.list, MAP.MARKER_TYPES.MK_VIDEO)
      }
    }
    // 临时修改
    // data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode || '320205' } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/5277
   * 传入 orgCode 返回所属的上级 或下级 或包含本级的监控设备-李峥宇
   * @param {
   *  monitorSource : 监控业务来源：1雪亮工程（厂家：海康 大华）；2重点地标（厂家：清新互联）3网格中心（厂家：理想自建）5锡山视频云（厂家：海康）
   *  queryType : 查询类型 1：查询上级（不含本级）  2：查询下级（不含本级）  3：查询本级  4：查询上级（包含本级）  5：查询下级（包含本级）  6：查询上级本级及下级
   *  deviceStatus: 状态 0：不在线,1：在线,2:未知
   *  feedbackStatus: 用户反馈的监控状态  1：能播放,0：不能播放
   * } data
   */
  getVideoListWithoutPage (data) {
    const service = {
      method: 'post',
      url: '/dataView/home/videoCenter/getVideoList',
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data.list, MAP.MARKER_TYPES.MK_VIDEO)
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3252
   * 获取人员详情（普通人 三官一律 网格员 警官）-周文才
   * @param {primaryKey, businessType} data
   * @returns
   */
  getPersonnelDetails (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/details/getPersonnelDetails`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3171
   * 获取房屋详情-周文才
   * @param {primaryKey, businessType} data
   * @returns
   */
  getHouseDetails (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/details/getHouseDetails`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3180
   * 获取企业详情-周文才
   * @param {primaryKey, businessType} data
   * @returns
   */
  getCompanyDetails (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/details/getCompanyDetails`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/4423
   * 无坐标监控设备分页列表-黄帆
   * @param {primaryKey, businessType} data
   * @returns
   */
  queryPageNonCoordinateDVMonitorDevice (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/mapsPoint/queryPageNonCoordinateDVMonitorDevice`
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4976
   * 获取视频类型集
   * @param {orgCode} data
   * @returns
   */
  queryVideoTypeList (data) {
    const service = {
      method: 'get',
      url: `/api-gate/xsdataview/centralcall/device-sources`
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4990
   * 根据摄像头类型(source)分页查询摄像头-王小娟
   * @param {authorizationCode, token, orgCode, pageNo, pageSize} headers
   * @param {deviceSource, orgCode} data
   * @returns
   */
  queryVideoList (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode!!')
    }
    const service = {
      method: 'get',
      url: `/api-gate/xsdataview/centralcall/devices`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data.records, MAP.MARKER_TYPES.MK_VIDEO)
      }
    }
    Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2235
   * 一标多实 树状结构 左侧获取（管理要素 网格业务 网格力量）查询条件字典-李峥宇
   * @param {criteriaType} data
   * @returns
   */
  getQueryCriteriaDictionary (data) {
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/leftQueryCriteria/getQueryCriteriaDictionary`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2676
   * 一标多实撒点接口
   * @param {orgCode,criteriaCode} data
   */
  getSprinklePoints (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode!!')
    }
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/mapsPoint/getManagementElementsSprinklePoints`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data.records, MAP.MARKER_TYPES.MK_ADDRESS)
      }
    }
    Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2721
   * 一标多实热力图接口
   * @param {orgCode, dMonth, criteriaCode} data
   */
  getManagementElementsHeatMap (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode!!')
    }
    const service = {
      method: 'get',
      url: `/dataView/panoramaView/mapsPoint/getManagementElementsHeatMap`
    }
    Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  }
}
