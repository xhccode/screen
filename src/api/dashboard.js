/**
 * 总门户的相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5172
   * 获取街道-季夏吉
   * @param {orgCode} data
   * @returns
   */
  // 根据街道获取网格员信息
  getGeneralPortalInfo (data) {
    const service = {
      method: 'get',
      url: `/xsdataview/generalportal/getGeneralPortalInfo`
    }
    return $axios(service, data)
  }
}
