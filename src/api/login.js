/**
 * 登录的相关api
 */
import $axios from '@/utils/axios.js'
import store from '@/store/index.js'

export default {
  /**
   * http://47.100.91.141:3000/project/105/interface/api/1893
   * 验证用户并返回授权码-李峥宇
   * @param {loginName, password} data
   */
  login (data) {
    const service = {
      method: 'post',
      secure: false,
      url: `/dataView/system/authentication`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/1866
   * 获取(当前)用户信息-李峥宇
   */
  getUserInfo () {
    const service = {
      method: 'get',
      secure: false,
      url: `/dataView/system/getUserInfo`,
      markerable: function ({ data: { data } }) {
        if(data){
          let { account, loginName, userName, realName, mobilePhone, profilePicture } = data
          data.phone = data.phone || mobilePhone
          data.name = data.name || userName || realName
          data.account = account || loginName
          data.loginName = loginName || account
          data.post = data.post || data.postName
          data.url = data.url || profilePicture
        }
      }
    }
    return $axios(service)
  },
  /**
   * @version 1.0.0
   * @author tangyuchen
   * @description 登出接口
   * @param {*}
   * @return
   */
  logout (data) {
    // if (process.env.NODE_ENV === 'development') {
    //   return new Promise(function (resolve) {
    //     resolve()
    //   })
    // }
    const service = {
      method: 'get',
      url: '/dataView/system/logout'
    }
    return $axios(service, data)
  },








  /**
   * http://47.100.91.141:3000/project/105/interface/api/1803
   * 区域选择下拉查询-周文才（地图通用 在网格首页 网格比较）
   * rank: 层级（2：区县 3：街道 4：社区 5：网格）
   * @param {orgCode, rank} data
   */
  getOrgTree (data) {
    const service = {
      method: 'get',
      url: `/dataView/gridConstruction/index/getOrgTree`,
      markerable: function ({ data: { data } }) {
        MAP.touchMarkerType(data, MAP.MARKER_TYPES.MK_ADDRESS)
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/36/interface/api/5207
   * 组织ID获取下级组织机构及当前通讯录
   * @param {account} data
   * @returns
   */
  getAddressBookNew (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/getAddressBookNew',
      markerable: function ({ data: { data } }) {
        function _t (data) {
          if (data.userInfoVOList && data.userInfoVOList) {
            MAP.touchMarkerType(data.userInfoVOList, MAP.MARKER_TYPES.MK_GRID)
            _.forEach(data.userInfoVOList, u => {
              let { account, loginName, userName, realName, mobilePhone, profilePicture } = u
              u.phone = u.phone || mobilePhone
              u.name = u.name || userName || realName
              u.account = account || loginName
              u.loginName = loginName || account
              u.post = u.post || data.postName
              u.url = u.url || profilePicture
            })
          }
          if (data.orgVOList && data.orgVOList.length) {
            _.forEach(data.orgVOList, _t)
          }
        }
        //
        _t(data)
      }
    }
    let account = store.state[STATE.USER_INFO].account
    return $axios(service, { account, ...data })
  },
  /**
   * http://47.100.91.141:3000/project/36/interface/api/3720
   * 获取通讯录的个人详情 孙坤
   * @param {account} data
   * @returns
   */
  getUserInfoById (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/getUserInfoById',
      markerable: function ({ data: { data } }) {
        if (_.isObject(data)) {
          let { account, loginName, userName, realName, mobilePhone, profilePicture } = data
          data.phone = data.phone || mobilePhone
          data.name = data.name || userName || realName
          data.account = account || loginName
          data.loginName = loginName || account
          data.post = data.post || data.postName
          data.url = data.url || profilePicture
        } else {
          LOG.error(`未找到账号为${data.account}的用户信息!!!`)
        }
      }
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/36/interface/api/5472
   * 根据组织id获取其下属职能部门列表 孙坤
   * @param {account} data
   * @returns
   */

  getZnOrgInfos (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/getLdbmList'
    }
    return $axios(service, { ...data })
  },
  /**
   * http://47.100.91.141:3000/project/36/interface/api/37
   * 根据组织id获取其下属职能部门的联动人员 孙坤
   * @param {account} data
   * @returns
   */
  getUserInfoListByOrgCode (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/getLdbmWorkerList'
    }
    return $axios(service, { ...data })
  },
  /**
   * 获取社会组织 沈晟
   * @param {*} data
   */
  getSocialOrgList ({ orgCode, areaLevel }) {
    const service = {
      method: 'get',
      url: '/xsdataview/socialorg/socialOrgList'
    }
    return $axios(service, { orgCode, areaLevel })
  },
  /**
   * @version 1.0.0
   * @author tangyuchen
   * @description 获取密码验证规则接口
   * @param {*} data
   * @return
   */
  initPwdRule (data) {
    const service = {
      method: 'post',
      baseURL: process.env.UPMS_URL,
      url: '/user/initPwdRule'
    }
    return $axios(service, data)
  },
  /**
   * @version 1.0.0
   * @author tangyuchen
   * @description 修改密码接口
   * @param {*}
   * @return
   */
  changePassword (data) {
    const service = {
      method: 'post',
      baseURL: process.env.UPMS_URL,
      url: '/user/changePassword'
    }
    return $axios(service, data)
  },
  /**
   * @param {*} data
   * @returns
   */
  getPrmList (data) {
    const service = {
      method: 'post',
      baseURL: process.env.UPMS_URL,
      url: '/prm/getPrmCodeList'
    }
    return $axios(service, data)
  },
  chooseLogin (data) {
    const service = {
      method: 'get',
      secure: false,
      baseURL: process.env.UPMS_URL,
      url: '/user/isLogon'
    }
    return $axios(service, data)
  },
  getKaptcha (data) {
    const service = {
      method: 'get',
      secure: false,
      baseURL: process.env.UPMS_URL,
      url: '/kaptcha/captcha'
    }
    return $axios(service, data)
  },
  /**
   * 从腾讯云音视频获取用户在线状态
   */
  batchQueryUserstate (members) {
    if (members.length > 500) {
      LOG.warn('一次最多查询500个用户状态')
    }
    let data = {
      To_Account: _.filter(members, m => m.account)
        .map(m => m.account)
        .slice(0, 500)
    }
    let service = {
      method: 'post',
      outter: true, // 外围
      secure: false, // 无需校验是否登录
      url: ''
      // url: `https://console.tim.qq.com/v4/openim/querystate?sdkappid=${SDKAppID}&identifier=wangyanpeng&usersig=${genTestUserSig('wangyanpeng').userSig}&random=&contenttype=json`
    }
    return new Promise(function (resolve, reject) {
      $axios(service, data)
        .then(({ data: { QueryResult: states } }) => {
          let powers = _.map(members, p => {
            let r = _.find(states, s => s.To_Account === p.account)
            if (r) {
              p.$timOnline = r.Status === 'Online'
            } else {
              p.$timOnline = false
            }
            return p
          }).sort((a, b) => (a.$timOnline === true ? -1 : 1))
          //
          resolve(powers)
        })
        .catch(reject)
    })
  },
  /**
   * 登录维稳系统
   */
  getToken4Weiwen ({ loginName, password }) {
    let service = {
      method: 'post',
      secure: false,
      baseURL: process.env.WEIWEN_URL,
      url: '/noPassLogin'
    }
    return $axios(service, { loginName })
  },
  /**
   * 单点登录
   */
  singleLogin (data) {
    let service = {
      method: 'get',
      secure: false,
      baseURL: process.env.EVENT_IFRAME,
      url: '/hongxing/singleLogin'
    }
    return $axios(service, data)
  },
  /**
   * 开启一键会商
   */
  toggleMeeting (enable) {
    const service = {
      method: 'put',
      baseURL: process.env.EVENT_V2_URL,
      url: `/micc-oa/portal/toggle-meeting?enable=${enable}`
    }
    return $axios(service)
  },
  /**
   * 当前开启会商
   */
  isMeeting () {
    const service = {
      method: 'get',
      baseURL: process.env.EVENT_V2_URL,
      url: `/micc-oa/portal/meeting-status`
    }
    return $axios(service)
  }
}
