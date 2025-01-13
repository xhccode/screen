/**
 * 党建相关api
 */
import $axios from '@/utils/axios.js'
/**
 * http://47.100.91.141:3000/project/125/interface/api/4752
 * TODO:左上第一列-党员各性别人数汇总-王小娟
 * http://47.100.91.141:3000/project/125/interface/api/4871
 * TODO:左中第一列-党员地区分布人数汇总-王小娟
 * http://47.100.91.141:3000/project/125/interface/api/4780
 * TODO:左下第二列-党员得分前十排行榜-王小娟
 *
 * http://47.100.91.141:3000/project/125/interface/api/4892
 * TODO:右中第一列-各个活动类型的数量汇总-王小娟
 * http://47.100.91.141:3000/project/125/interface/api/4899
 * TODO:右中第一列-主题活动类型下的活动数量汇总-王小娟
 * http://47.100.91.141:3000/project/125/interface/api/4913
 * TODO:右下第一列-支部生活类型下的活动数量汇总-王小娟
 * http://47.100.91.141:3000/project/125/interface/api/4920
 * TODO:右下第二列-近半年内的活动数量汇总-王小娟
 */
export default {
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4675
   * 左上角-各维度的党员人数汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  total:      总党员数,
   *  excellent:  优秀党员数,
   *  poor:       困难党员数,
   *  punishment: 受处分的党员数,
   *  notFixed:   流动党员数,
   *  orgCount:   党组织数量
   * }
   */
  getMemberSummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/member/summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4752
   * 左上第一列-党员各性别人数汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  sex:        性别,
   *  num:        性别人数
   * }
   */
  getMemberSexSummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/member/sex-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4871
   * 左中第一列-党员地区分布人数汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  area:       分布地区,
   *  num:        分布人数
   * }
   */
  getMemberAreaSummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/member/area-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4773
   * 左下第一列-各学历下党员人数汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  edu:        学历信息,
   *  num:        分布人数
   * }
   */
  getMemberEduSummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/member/edu-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4759
   * 左上第二列-党员各年龄段人数汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  range:      年龄区间,
   *  num:        人数
   * }
   */
  getMemberAgeuSummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/member/age-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4780
   * 左下第二列-党员得分前十排行榜-王小娟
   * @param {orgCode} data
   * @returns {
   *  name:       党员姓名,
   *  points:     党员得分
   * }
   */
  getMemberPointsRank (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/member/points-rank'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5165
   * 获取党活动分类-刘作奇
   * @param {orgCode} data
   * @returns {
   *  value:     党员姓名,
   *  lavel:     党员得分
   * }
   */
  getActivityQuerySecondCategories (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/activity/querySecondCategories'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5081
   * 根据条件查询某党组织下的党员清单-王小娟
   * @param {organizationCode, name} data
   * @returns {
   *  name:         姓名,
   *  sex:          性别,
   *  birthday:     出生日期,
   *  joinPartyTime:入党时间,
   *  positiveTime: 转正时间,
   *  type:         人员类别,
   *  orgName:      所在党支部
   * }
   */
  getMemberByOrganizationCode (data) {
    const service = {
      method: 'post',
      url: '/xsdataview/party-building/member/members'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5095
   * 党组织详情-王小娟
   * @param {
   *  orgCode:           区域编码,
   *  organizationCode:  党组织编码,
   *  name:              身份证或者姓名,
   *  excellent:         是否为优秀党员,
   *  poor:              是否为困难党员,
   *  notFixed:          是否为流动党员,
   *  punishments:       是否为受处分党员,
   *  edu:               学历,
   *  region:            所在区域:镇、市、区等
   * } data
   * @returns {
   *  name:             名称,
   *  secretary:        书记,
   *  leaders:          领导班子,
   *  address:          地址,
   *  membersNum:       党员个数,
   * }
   */
  getOrganizationDetail (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/organization/detail'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5130
   * 条件分页查询党活动-刘作奇
   * @param {
   *  pageNo:             页码,
   *  pageSize:           每页显示条数,
   * * ============================= *
   *  name:               名称,
   *  startDate:          书记,
   *  closingDate:        领导班子,
   *  theme:              领导班子,
   *  partyOrganizationId:领导班子,
   *  firstCategory:      地址,
   *  secondCategory:     党员个数,

   * } data
   * @returns {
   *  name:               名称,
   *  startDate:          书记,
   *  closingDate:        领导班子,
   *  theme:              领导班子,
   *  partyOrganizationId:领导班子,
   *  firstCategory:      地址,
   *  secondCategory:     党员个数,
   * }
   */
  getActivityQuery (data) {
    const service = {
      method: 'post',
      url: '/xsdataview/party-building/activity/query',
      headers: {}
    }
    if (data.pageNo) {
      Object.assign(service.headers, { pageNo: data.pageNo })
      delete data.pageNo
    }
    if (data.pageSize) {
      Object.assign(service.headers, { pageSize: data.pageSize })
      delete data.pageSize
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5144
   * 根据autoid查询党活动详情-刘作奇
   * @param { autoid: UUID } data
   * @returns {
   *  name:         名称,
   *  agenda:       书记,
   *  theme:        领导班子,
   *  autoid:       UUID
   * }
   */
  getActivityGetById (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/activity/getById'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4829
   * 正中-党组织分布-王小娟
   * @param {orgCode} data
   * @returns {
   *  name:       党组织名称,
   *  gridCode:   网格代码,
   *  longitude:  经度,
   *  latitude:   纬度
   * }
   */
  getOrganizationDistributed (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/organization/distributed',
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_PARTY)
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4885
   * 右上第一列-党组织类别数量汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  category:    总党员数,
   *  categoryName:党组织类别名称,
   *  num:         数量
   * }
   */
  getOrganizationCategorySummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/organization/category-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4794
   * 右上第二列-党组织积分前十排行-王小娟
   * @param {orgCode} data
   * @returns {
   *  name:       党组织名称,
   *  score:      党组织的得分
   * }
   */
  getOrganizationPointsRank (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/organization/points-rank'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4892
   * 右中第一列-各个活动类型的数量汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  category:   活动类型,
   *  num:        数量
   * }
   */
  getActivityCategorySummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/activity/category-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4899
   * 右中第一列-主题活动类型下的活动数量汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  category:   活动类型名称,
   *  num:        数量
   * }
   */
  getActivityThemeActivitySummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/activity/theme-activity-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4913
   * 右下第一列-支部生活类型下的活动数量汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  category:   活动类型名称,
   *  num:        数量
   * }
   */
  getActivityBranchActivitySummary (data) {
    const service = {
      method: 'get',
      url: '/api-gate/xsdataview/party-building/activity/branch-activity-summary'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/4920
   * 右下第二列-近半年内的活动数量汇总-王小娟
   * @param {orgCode} data
   * @returns {
   *  month:      月份,
   *  num:        数量
   * }
   */
  getActivityHalfYearActivitySummary (data) {
    const service = {
      method: 'get',
      url: '/xsdataview/party-building/activity/half-year-activity-summary'
    }
    return $axios(service, data)
  }
}
