/**
 * 地图相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2127
   * 获取地图边界
   * @param {orgCode} data
   */
  getOrgRegionalBoundary (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/index/getOrgRegionalBoundary`,
      markerable: function ({ data: { data } }) {
        // MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_ADDRESS)
      }
    }
    Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },






  /**
   * http://47.100.91.141:3000/project/105/interface/api/1875
   * 子级区域边界查询-周文才（地图通用 在网格首页 网格比较）
   * @param {orgCode} data
   */
  getRegionalBoundary (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/index/getRegionalBoundary`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_ADDRESS)
      }
    }
    Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/2811
   * 根据区域返回网格边界查询-周文才
   * @param {orgCode} data
   */
  getGridRegionalBoundary (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/index/getGridRegionalBoundary`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_ADDRESS)
      }
    }
    Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },

  /**
   * http://47.100.91.141:3000/project/105/interface/api/4353
   * 根据网格code、管理单元格类型 获取子级地图区域管理单元格边界-孙坤
   * unitType: 管理单元类型 (1:环保 2：应急 3：城管)
   * @param {orgCode,unitType} data
   */
  getUnitRegionalBoundary (data) {
    if (!data || !data.orgCode) {
      throw new Error('请提供参数orgCode')
    }
    let unitType = +data.unitType
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/index/getUnitRegionalBoundary`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, e => {
          // 城管是事件
          if (unitType === 3) {
            return MAP.MARKER_TYPES.MK_EVENT
          } else {
            return MAP.MARKER_TYPES.MK_ADDRESS
          }
        })
      }
    }
    Object.assign(service, { headers: { orgCode: data.orgCode } })
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/1686
   * 街道人员单位信息<TODO:网格级联弹窗>
   * @param {orgCode} data
   * @returns
   */
  getMapRegion (data) {
    const service = {
      method: 'get',
      url: `/dataView/home/getMapRegion`,
      headers: {
        dMonth: new Date().getMonth() + 1,
        orgCode: data.orgCode
      }
    }
    data.orgCode && Object.assign(service, data)
    return $axios(service, data)
  },
  /**
   * 街道房屋人口信息<TODO:网格级联弹窗>
   * http://47.100.91.141:3000/project/105/interface/api/1704
   * @param {orgCode} data
   * @returns
   */
  getMapGridInfo (data) {
    const service = {
      method: 'get',
      url: `/dataView/home/getMapGridInfo`,
      headers: {
        dMonth: new Date().getMonth() + 1
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5242
   * 应急管理信息 季夏吉
   * areaLevel = 机构里的orgDepth
   * @param {orgCode,areaLevel} data
   */
  getMergencyCompanyInfo (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/emergencycompany/getMergencyCompanyInfo',
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_UNIT)
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5256
   * 应急单位巡检记录 季夏吉
   * unifiedCode： getMergencyCompanyInfo 接口返回的 所属公司/统一社会信用代码
   * @param {unifiedCode} data
   */
  getMergencyCompanyLogInfo (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/emergencycompany/getMergencyCompanyLogInfo'
    }
    return $axios(service, data)
  },
  /**
   * 沈晟
   * 获取指定日期城管事件撒点接口
   * @param {dateTime，areaLevel,orgCode} data
   * @returns
   */
  getCityManagerInfo (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/city/getDayMap',
      markerable: function ({ data: { data } }) {
        data.map(item => {
          item.longitude = item.maplong
          item.latitude = item.maplat
          return item
        })
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_EVENT)
      }
    }
    return $axios(service, data)
  },
  /**
   * 沈晟
   * 获取城管事件撒点详情
   * @param {dateTime，areaLevel,orgCode} data
   * @returns
   */
  getCityManagerDetail (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/city/getCityManageData'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5235
   * 环保巡检-沈晟
   * @param {orgCode} data
   */
  getEnvCompany (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/city/getEnvCompany',
      markerable: function ({
        data: {
          data: { companyList, envList }
        }
      }) {
        MAP.touchMarkerType(companyList, MAP.MARKER_TYPES.MK_UNIT)
      }
    }
    return $axios(service, data)
  },
  /**
   *
   * 获取环保应急等网格数-沈晟
   * @param {orgCode,areaLevel} data
   */

  getTopCount (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/city/getTopCount'
    }
    return $axios(service, data)
  }
}
