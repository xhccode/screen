/**
 * 事件模型
 * @class
 */
export default class EventModel {
  /**
   * 事件构造函数
   * @param {string} primaryKey - 事件编码
   * @param {string} title - 标题
   * @param {string} time - 发生时间
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @param {string} sjStatusTxt - 处理状态说明
   * @param {string} typicalEventType - 事件分类，例如“疑难”
   * @param {number} jjcd - 0=特急1=紧急2=一般
   * @param {string} orgName - 发生地机构名称
   * @param {string} address - 发生地点
   * @param {string} jjcdTxt - 紧急程度文本
   * @param {string} sjStatus - 处理状态编码
   * @param {string} gridName - 发生地网格名
   */
  constructor (primaryKey, title, time, longitude, latitude, sjStatusTxt, typicalEventType, jjcd, orgName, address, jjcdTxt, sjStatus, gridName) {
    this.primaryKey = primaryKey // 事件编码
    this.issueActivitiId = primaryKey // 事件编码
    this.title = title // 标题
    this.time = time // 发生时间
    this.longitude = longitude // 经度
    this.latitude = latitude // 纬度
    this.orgName = orgName // 发生地机构名称
    this.address = address // 发生地点
    this.jjcd = jjcd // 0=特急1=紧急2=一般
    this[MAP.MAP_MARKER_TYPE] = MAP.MARKER_TYPES.MK_EVENT // 撒点类型
    switch (jjcd) {
      case 0:
        this.jjcdTxt = '特级'
        break
      case 1:
        this.jjcdTxt = '紧急'
        break
      case 2:
        this.jjcdTxt = '一般'
        break
    }
    this.jjcdTxt = jjcdTxt // 紧急程度文本
    this.sjStatus = sjStatus // 处理状态编码
    this.sjStatusTxt = sjStatusTxt // 处理状态说明
    this.gridName = gridName // 发生地网格名
    this.typicalEventType = typicalEventType
  }
}
