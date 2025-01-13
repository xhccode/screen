/**
 * 运行城市相关api
 */
import $axios from '@/utils/axios.js'
import axios from 'axios'
import qs from 'qs'
export default {
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5538
   * 整合平台人员信息-吕琛
   * @param {orgCode} data
   */
  getPlatformList (data) {
    const service = {
      method: 'get',
      url: `/xsdataview/power/power-platform/persons`
    }
    return $axios(service, data)
  }
}
