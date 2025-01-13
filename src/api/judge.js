/**
 * 研判的相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * 督办事件列表
   */
  querySuperviseEventsByPage (headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/querySuperviseEventsByPage`,
      headers: headers
    }
    return $axios(service, {})
  },
  /**
   * 热点事件
   */
  queryTopicEventsByPage (headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryTopicEventsByPage`,
      headers: headers
    }
    return $axios(service)
  },
  /**
   * 逾期事件列表
   */
  queryBeOverdueEventsByPage (headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryBeOverdueEventsByPage`,
      headers: headers
    }
    return $axios(service)
  },
  /**
   * 左侧顶部统计数据
   * @param {span} params
   * @param {pageSize,pageNo} headers
   */
  queryEventCountSummary (params, headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryEventCountSummary`,
      headers: headers
    }
    return $axios(service, params)
  },
  /**
   * 热点问题
   * @param {span} params
   * @param {pageSize,pageNo} headers
   */
  queryTopicCountSummary (params, headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryTopicCountSummary`,
      headers: headers
    }
    return $axios(service, params)
  },
  /**
   * 行政区
   * @param {span} params
   * @param {pageSize,pageNo} headers
   */
  queryXzqCountSummary (params, headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryXzqCountSummary`,
      headers: headers
    }
    return $axios(service, params)
  },
  /**
   * 职能部门
   * @param {span} params
   * @param {pageSize,pageNo} headers
   * @returns
   */
  queryDeptCountSummary (params, headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryDeptCountSummary`,
      headers: headers
    }
    return $axios(service, params)
  },

  /**
   * 服务类型
   * @param {span} params
   * @param {pageSize,pageNo} headers
   */
  queryServeCountSummary (params, headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryServeCountSummary`,
      headers: headers
    }
    return $axios(service, params)
  },
  /**
   * 效能监控
   * @param {span} params
   * @param {pageSize,pageNo} headers
   */
  queryEventSummaryReport (params, headers) {
    const service = {
      method: 'get',
      //   baseURL: process.env.LZQ,
      url: `/xsdataview/event/judge/queryEventSummaryReport`,
      headers: headers
    }
    return $axios(service, params)
  }
}
