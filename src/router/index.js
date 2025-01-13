import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index.js'
import { Notification } from 'element-ui'
//
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
const routerReplace = Router.prototype.replace
Router.prototype.replace = function replace (location) {
  return routerReplace.call(this, location).catch(error => error)
}
Vue.use(Router)
export const routers = [
  {
    path: '/',
    name: 'Login',
    component: () =>
      // import(/* webpackChunkName: "login_ex" */ '@/pages/Login.vue')
      import(/* webpackChunkName: "login_ex" */ '@/components/HelloWorld.vue')
  },
  {
    path: '/home',
    redirect: '/home',
    meta: {
      title: '系统首页'
    },
    component: resolve => require(['@/views/common/index'], resolve),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'
          ),
        meta: {
          footer: false
        }
      },
      // {
      //   name: 'DataHome',
      //   path: '/datahome',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "data_home" */ '@/views/dataHome/index.vue'
      //     ),
      //   meta: {
      //     title: '首页'
      //   }
      // },
      // {
      //   name: 'Party',
      //   path: '/party',
      //   component: () =>
      //     import(/* webpackChunkName: "party" */ '@/views/party/index.vue'),
      //   hidden: false,
      //   meta: {
      //     title: '党建引领'
      //   }
      // },
      // {
      //   name: 'Conduct',
      //   path: '/conduct',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "data_home" */ '@/pages/conduct/Conduct.vue'
      //     ),
      //   props: route => {
      //     return {
      //       ...route.params,
      //       ...route.query
      //     }
      //   },
      //   meta: {
      //     title: '城市运行',
      //     customClass: route => {
      //       let query = route.query
      //       return query.lc === 'PowerLeft' && query.rc === 'PowerRight'
      //         ? 'power'
      //         : ''
      //     }
      //   }
      // },
      // {
      //   name: 'Video',
      //   path: '/video',
      //   component: () =>
      //     import(/* webpackChunkName: "video" */ '@/views/video/Video.vue'),
      //   meta: {
      //     title: '视频中心'
      //   }
      // },
      // {
      //   name: 'Public',
      //   path: '/public',
      //   component: () =>
      //     import(/* webpackChunkName: "public" */ '@/views/public/Public.vue'),
      //   meta: {
      //     title: '政务服务'
      //   }
      // },
      // {
      //   name: 'Security',
      //   path: '/security',
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "security" */ '@/pages/security/Security.vue'
      //     ),
      //   meta: {
      //     title: '公共安全'
      //   }
      // }
    ]
  }
]
let router = new Router({
  mode: 'hash', // hash
  routes: routers
})

router.beforeEach(async (to, from, next) => {
  let authorizationCode = localStorage.getItem('auth')
  if (authorizationCode &&
    !store.state[STATE.USER_INFO].realName
  ) {
    let userInfo = await API.login.getUserInfo()
    if(userInfo.data.code === 712){
      Notification.error({
        title: '错误',
        message: userInfo.data.msg
      })
      next()
      return
    }
    store.commit(STATE.USER_INFO, userInfo.data.data)
    let orgInfo = await API.map.getOrgRegionalBoundary({
      orgCode: userInfo.data.data.orgCode
    })
    store.commit(STATE.USER_ORG, orgInfo.data.data)
    next({ path: to.fullPath })
  } else {
    next()
  }
})
export default router
