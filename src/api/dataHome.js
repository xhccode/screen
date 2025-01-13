/**
 * 数据首页相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * http://47.100.91.141:3000/project/105/interface/api/1623
   * 首页雷达图 - 周文才
   */
  getExpectScore (data) {
    const service = {
      method: 'get',
      url: `/dataView/home/getExpectScore`,
      headers: { dMonth: new Date().getMonth() + 1 }
    }
    return $axios(service, data)
  },
  /**
   * 顶端数据-季夏吉
   * 曾用-季夏吉：/xsdataview/screenpage/getRealTimeInfo
   */
  getRealTimeInfo (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/xsdataview/screenpage/getRealCurInfo`
    }
    data.orgCode && Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5284
   * 事件响铃接口--沈晟
   * @param {object} data - 查询参数
   * @returns promise
   */
  getRingEvent (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/xsdataview/city/getRingEvent`
    }
    return $axios(service, data)
  },

  /**
   * /api-gate/xsdataview/screenpage/getAreaIntroduction
   * 区域简介-吕琛
   * @param {object} data - 查询参数
   * @returns promise
   */
  getAreaIntroduction (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/xsdataview/screenpage/getAreaIntroduction`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5018
   * 区域概况-吕琛
   * @param {object} data - 查询参数
   * @returns promise
   */
  getAreaBasenfo (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/xsdataview/screenpage/getAreaBaseInfo2`,
      headers: data
    }
    return $axios(service)
  }
}
