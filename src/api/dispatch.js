/**
 * 登录的相关api
 */
import $axios from '@/utils/axios.js'

export default {
  /**
   * @param {} data
   */
  getDispatchData (data) {
    const service = {
      method: 'post',
      secure: false,
      url: `/dataView/system/authentication`
    }
    return $axios(service, data)
  },

  /**
   * http://47.100.91.141:3000/project/125/interface/api/5193
   * 事件接口-沈晟
   */
  getEventNumData (data) {
    const service = {
      method: 'get',
      url: `/xsdataview/city/getEventNumData`,
      markerable: function ({
        data: {
          data: { expressList, urgentList }
        }
      }) {
        let jjcdTxts = ['特急', '紧急', '一般']
        // MAP.touchMarkerType(expressList, d => {
        //   d.title = d.title || d.msgtitle
        //   d.orgName = d.orgName || d.fromdistrict
        //   d.time = d.time || d.accepttime
        //   d.address = d.address || d.fromaddress
        //   d.jjcd = d.jjcd || d.priority
        //   // 0=特急 1=紧急 2=一般
        //   d.jjcdTxt = d.jjcdTxt || jjcdTxts[+d.jjcd]
        //   d.primaryKey = d.primaryKey || d.eventCode
        //   d.longitude = d.maplong
        //   d.latitude = d.maplat
        //   d.issueActivitiId = d.issueActivitiId || d.eventCode
        //   return MAP.MARKER_TYPES.MK_EVENT
        // })
        // MAP.touchMarkerType(urgentList, d => {
        //   d.title = d.title || d.msgtitle
        //   d.orgName = d.orgName || d.fromdistrict
        //   d.time = d.time || d.accepttime
        //   d.address = d.address || d.fromaddress
        //   d.jjcd = d.jjcd || d.priority
        //   // 0=特急 1=紧急 2=一般
        //   d.jjcdTxt = d.jjcdTxt || jjcdTxts[+d.jjcd]
        //   d.primaryKey = d.primaryKey || d.eventcode
        //   d.longitude = d.maplong
        //   d.latitude = d.maplat
        //   d.issueActivitiId = d.issueActivitiId || d.eventCode
        //   return MAP.MARKER_TYPES.MK_EVENT
        // })
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5263
   * 典型事件列表接口-沈晟
   */
  getTypicalEvent (data) {
    const service = {
      method: 'get',
      url: `/xsdataview/city/getTypicalEvent`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_EVENT)
      }
    }
    return $axios(service, data)
  },
  /**
   * 紧急事件已读状态更新--沈晟
   */
  updateRingEvent (id) {
    const service = {
      method: 'get',
      url: `/xsdataview/city/updateRingEvent`
    }
    return $axios(service, { autoId: id })
  },

  // 获取应急预案
  yingjiyuyan (resolutionName) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-oa/emergency-resolution/page`
    }
    return $axios(service, { page: 0, size: 5, sort: 'id,desc', resolutionName })
  },

  // 获取人员管控或者预警事项
  warnLink (type, orgCode) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-message/stablize/get/${type}/${orgCode}`
    }
    return $axios(service)
  },
  url (objectKey, fileName) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-oss/oss/secure-url`
    }
    return $axios(service, { objectKey, fileName })
  }
}
