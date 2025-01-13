/**
 * 服务的相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * 左侧顶部数据汇总--刘作奇
   * @returns
   */
  queryCountSummary () {
    const service = {
      method: 'get',
      url: '/xsdataview/serve/queryCountSummary'
    }
    return $axios(service)
  },
  /**
   * 左侧 根据阅读量排序分页查询--刘作奇
   * @returns
   */
  queryTopReadCountByPage (data, headers) {
    const service = {
      method: 'get',
      url: '/xsdataview/serve-knowledge/queryTopReadCountByPage',
      headers: headers
    }
    return $axios(service, data)
  },
  /**
   * 左侧 根据收藏量排序分页查询--刘作奇
   * @returns
   */
  queryTopCollectCountByPage (data, headers) {
    const service = {
      method: 'get',
      url: '/xsdataview/serve-knowledge/queryTopCollectCountByPage',
      headers: headers
    }
    return $axios(service, data)
  },
  /**
   * 右侧顶部左侧环形图--刘作奇
   * @returns
   */
  querySourceCountSummary () {
    const service = {
      method: 'get',
      url: '/xsdataview/serve/querySourceCountSummary'
    }
    return $axios(service)
  },
  /**
   * 右侧顶部右侧环形图--刘作奇
   * @returns
   */
  queryStarCountSummary () {
    const service = {
      method: 'get',
      url: '/xsdataview/serve/queryStarCountSummary'
    }
    return $axios(service)
  },
  /**
   * 右侧顶部右侧事件列表--刘作奇
   * @returns
   */
  queryEventByPage (data, headers) {
    const service = {
      method: 'get',
      url: '/xsdataview/serve-log/queryByPage',
      headers
    }
    return $axios(service, data)
  },
  queryServices (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-oa/service_asker/dapin/list`
    }
    return $axios(service, data)
  }
}
