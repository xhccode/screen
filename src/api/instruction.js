/**
 * 督导的相关api
 */
import $axios from '@/utils/axios.js'
export default {
  /**
   * ?????
   * http://47.100.91.141:3000/project/36/interface/api/3693
   * 区级的下级组织分类信息
   * @returns
   */
  getQxAddressBookType () {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/getQxAddressBookType'
    }
    return $axios(service)
  },
  /**
   * ???
   * http://47.100.91.141:3000/project/36/interface/api/3702
   * 组织类型获取区级的下级组织机构
   * @param {orgId, orgType} data
   * @returns
   */
  getQxAddressBook (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/getQxAddressBook'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/36/interface/api/3684
   * 组织ID获取下级组织机构及当前通讯录
   * @param {orgId, account, orgType} data
   * @returns
   */
  getAddressBook (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: '/gunsApi/getAddressBook'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/105/interface/api/3315
   * 指令发布弹出框上传图片
   * @param {file, type} data
   * @returns
   */
  upload (data) {
    const service = {
      method: 'post',
      url: `/integrate-2.0.0/user/upload`,
      'Content-Type': 'multipart/form-data'
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5298
   * 指令发布保存-吕琛
   * @param {senderAccount,senderName,title	,type,description	,completeLimit,noticeMethod,isFeedback,annexName,annexLink,receiver} data
   * @returns
   */
  saveComTaskRecord (data) {
    const service = {
      method: 'post',
      url: `/xsdataview/command/add`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/36/interface/api/4089
   * 指令发布-孙坤
   * @param {senderOrgCode, senderLoginName,commandTitle,commandContent,senderDateTime,
   *          commandImgName,commandImgPath,commandType,receiverType,
   *          feedbackType,achieveStartTime	,achieveEndTime,receiverList} data
   * @returns
   */
  saveComTask (data) {
    const service = {
      method: 'post',
      baseURL: process.env.ZHXS_URL,
      url: `/gunsApi/saveComTask`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5228
   * 紧急通知发布
   * @param {noticeUnit,noticeRange,title,content,sendTime,noticeMethod} data
   * @returns
   */
  sendShortMsgNotice (data) {
    const service = {
      method: 'post',
      // baseURL: process.env.ZHXS_URL,
      url: `/xsdataview/command/emegency/notice`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5221
   * 指令分类查询 - 吕琛
   * @param {type,account} data
   * @returns
   */
  queryClassify (data, headers) {
    const service = {
      method: 'post',
      // baseURL: process.env.ZHXS_URL,
      url: `/xsdataview/command/classify/query`,
      headers: headers
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5214
   * 累计指令统计 - 吕琛
   * @param {account} data
   * @returns
   */
  querySummary (data) {
    const service = {
      method: 'get',
      // baseURL: process.env.ZHXS_URL,
      url: `/xsdataview/command/summary`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5484
   * 查询指令详情 - 吕琛
   * @param {id} data
   * @returns
   */
  queryCommandDetail (data) {
    const service = {
      method: 'get',
      // baseURL: process.env.ZHXS_URL,
      url: `/xsdataview/command/details`
    }
    return $axios(service, data)
  },
  /**
   * http://47.100.91.141:3000/project/125/interface/api/5382
   * 获取发送紧急通知范围的人数 - 吕琛
   * @param {orgInfo} data
   * @returns
   */
  queryNoticeRange (data) {
    const service = {
      method: 'get',
      url: `/xsdataview/command/notice/people/query`
    }
    return $axios(service, data)
  },

  // 指令
  getCommandList ( data) {
    const service = {
      method: 'get',
      baseURL: process.env.EVENT_V2_URL,
      url: `/micc-command/command/dapin/page`
    }
    return $axios(service, data)
  },
  getCommandDetail (id) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-command/command/dapin/info/${id}`
    }
    return $axios(service)
  },
  getTaskList (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-command/command-task/dapin/page`
    }
    return $axios(service, data)
  },
  getFeedbackList (data) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-command/task-feedback/dapin/all`
    }
    return $axios(service, data)
  },
  getFileUrl (objectKey, fileName) {
    const service = {
      method: 'get',
      baseURL: process.env.VUE_WORK_BENCH,
      url: `/micc-oss/oss/secure-url`
    }
    return $axios(service, { objectKey, fileName })
  }
}
