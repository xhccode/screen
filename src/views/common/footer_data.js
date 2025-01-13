export default [
  { label: '指挥体系', img: '/static/img/home.png', path: '/dashboard', visible: true, ready: true, footable: false },
  {
    label: '首页',
    img: '/static/img/home-big.png',
    path: '/datahome',
    top_url: 'https://2.16.66.38:8094/analystrunner/!4856ac84-a1d0-4ce8-a4fe-d6a222420256/#/770aca0f-16e9-4ea4-911d-8c37ced8f816?isHome= ',
    visible: true,
    ready: true,
    nolabel: true
  },
  {
    label: '城市运行',
    img: '/static/img/command.png',
    icon: 'icon-chengshiyunhang-icon',
    visible: false,
    path: '/conduct',
    top_url: 'https://2.16.66.38:8094/analystrunner/!4856ac84-a1d0-4ce8-a4fe-d6a222420256/#/f0731334-1ee6-4821-8cd2-7ccc2e040f34',
    query: { lc: 'PowerLeft', rc: 'PowerRight' },
    children: [
      { label: '指  挥', path: '/conduct', query: { lc: 'CommandCamera', rc: 'CommandPower' } },
      { label: '调  度', path: '/conduct', query: { lc: 'DispatchLeft', rc: 'DispatchRight' } },
      { label: '指  令', path: '/conduct', query: { lc: 'InstructionLeft', rc: 'InstructionRight' } },
      { label: '服  务', path: '/conduct', query: { lc: 'ServiceLeft', rc: 'ServiceRight' } },
      { label: '研  判', path: '/conduct', query: { lc: 'JudgeLeft', rc: 'JudgeRight' } },
      { label: '考  核', path: '/conduct', query: { lc: 'ControlLeft', rc: 'ControlRight' } }
    ],
    ready: true
  },
  {
    label: '基层治理',
    img: '/static/img/power.png',
    icon: 'icon-jicengzhili-icon',
    top_url: 'https://2.16.66.38:8094/analystrunner/!4856ac84-a1d0-4ce8-a4fe-d6a222420256/#/022e52ee-584b-4c3b-bfff-eee9d5b80343',
    visible: false,
    children: [
      // { label: '网格建设', href: 'http://2.16.66.38:7775/#/mesh' },
      // { label: '一标多实', href: 'http://2.16.66.38:7775/#/fullview' },
      // { label: '指标监测', href: 'http://2.16.66.38:7775/#/monitor' },
      // { label: '网格质态', href: 'http://2.16.66.38:7775/#/mesh-info' }
      { label: '网格建设', href2: 'https://2.22.128.38:27020/jumpview/#/', module: 'mesh' },
      { label: '一标多实', href2: 'https://2.22.128.38:27020/jumpview/#/', module: 'fullview' },
      { label: '指标监测', href2: 'https://2.22.128.38:27020/jumpview/#/', module: 'monitor' },
      { label: '网格质态', href2: 'https://2.22.128.38:27020/jumpview/#/', module: 'mesh-info' },
      // { label: '一企一档', href2: 'https://2.22.128.38:27020/jumpview/#/', module: 'archives' }
    ],
    ready: true
  },
  {
    label: '党建引领',
    img: '/static/img/party.png',
    icon: 'icon-dangjianyinling-icon',
    class: 'red',
    path: '/party',
    top_url: 'https://2.16.66.38:8094/analystrunner/!4856ac84-a1d0-4ce8-a4fe-d6a222420256/#/438d7619-aa6d-4ad9-8474-7541e6e4e5fa?isHome=',
    visible: true,
    ready: true
  },
  {
    label: '政务服务',
    img: '/static/img/service.png',
    icon: 'icon-zhengwufuwu-icon',
    path: '/public',
    top_url: 'https://2.16.66.38:8094/analystrunner/!4856ac84-a1d0-4ce8-a4fe-d6a222420256/#/d3018183-a3a0-4b68-a005-61c1994c8016',
    ready: true
  },
  {
    label: '社会稳定',
    img: '/static/img/security.png',
    icon: 'icon-gonggonganquan-icon',
    visible: false,
    ready: true,
    href: 'http://2.16.66.33:8091/zwww/#/leaderIndex',
    top_url: 'https://2.16.66.38:8094/analystrunner/!4856ac84-a1d0-4ce8-a4fe-d6a222420256/#/38a86a43-2e82-4c6e-a782-11a7a867719e',
    beforeOpen: function (loginName = 'Dwxxshq001') {
      return new Promise(function (resolve, reject) {
        API.login.getToken4Weiwen({ loginName }).then(({ data: { data: token } }) => {
          resolve(token)
        })
      })
    }
  },
  {
    label: '一企一档',
    img: '/static/img/barIcon7.png',
    icon: '',
    visible: false,
    href2: 'https://2.22.128.38:27020/jumpview/#/',
    module: 'archives',
    top_url: '',
    ready: true
  }
]
