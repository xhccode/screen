/**
 * 督导的相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3126
   * 各个区县评分排名-周文才
   * @param {businessType} data
   * @returns
   */
  // 各个区县评分排名
  getExpectScoreRanks (data) {
    const service = {
      method: 'get',
      url: `/dataView/home/getExpectScoreRanks`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_ADDRESS)
      }
    }
    return $axios(service, data)
  },
  /**
   * 监督考核中心左侧区域排名-沈晟
   * @param {orgCode} data
   * @returns
   */
  getAssessmentInfo (data) {
    const service = {
      method: 'get',
      url: `/xsdataview/assessment/getRankList`
    }
    return $axios(service, data)
  },
  /**
   * 监督考核中心-右侧上方办件实时监控(季夏吉)
   * @param {orgCode} data
   * @returns
   */
  getRealTimeInfo (data) {
    const service = {
      method: 'get',
      url: `/xsdataview/assessment/getRealTimeInfo`
    }
    return $axios(service, data)
  },
  /**
   * 即将逾期办件列表查询(吕琛)
   * @param {orgCode} data
   * @returns
   */
  queryOverdueEvent (data, headers) {
    const service = {
      method: 'get',
      url: `/xsdataview/assessment/will-overdue-event/query`,
      headers: headers
    }
    return $axios(service, data)
  }
}
