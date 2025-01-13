window.config = {
  assetsPublicPath: './xishan/',
  baseUrl: 'http://192.168.3.194:7775/api-gate', // 开发1
  // baseUrl: 'http://192.168.3.229:7775/api-gate', // 开发1
  // baseUrl: 'http:///2.16.66.41:7775/api-gate', // 开发1
  // iframeUrl:`http://192.168.124.3:8888/zhwx-2.0.0`,// iframe
  iframeUrl: 'http://2.16.66.41:8888/zhwx-2.0.0', // iframe
  zhxsUrl: 'http://180.101.184.111:8888/zhxs',
  // baseUrl: 'http://2.16.66.41:7771',vedio-item
  upmsUrl: 'http://219.232.104.100:8066/upmsapi', // 权限管理子系统接口地址
  uploadApiUrl: 'http://219.232.104.100:8066/vlweb/fileTransfer/upload', // 文件上传接口路径
  fileUrl: 'ws://61.147.197.202:8081/rtp/0BEBE1B9.FLV', // 文件显示接口路径
  timeout: 20000,
  WebSocketTimeOut: 5000,
  baseErrorCode: 'E01',
  langInit: false,
  dicPrm: true,
  allLanguage: 'zh-CN,ru-RU,en-US',
  conmmonLang: 'zh-CN',
  EmptyLocale: true // 至少有一种国际化信息
}
// module.exports = {
//   dev: {
//     assetsSubDirectory: 'static',
//     assetsPublicPath: './xishan/'
//   }
// }
// 无锡市大屏应用（政务网）  http://2.16.66.41:7775/api-gate
// 无锡市县区网格化平台（政务网）  http://2.16.66.41:8888/zhwx-2.0.0
// 无锡市县区网格化平台文件（政务网）  http://2.16.66.41:8190
// 锡山区网格化平台（互联网） http://180.101.184.111:8888/zhxs
