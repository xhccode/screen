<template>
  <div class="footer-inner">
    <div class="fast-entries">
      <div class="fe-wrapper" v-for="e in entries" :key="e.uq_key" :class="{ 'no-label': e.nolabel }">
        <div class="fast-entry" :class="{ red: e.red }">
          <transition name="el-zoom-in-bottom">
            <div v-show="e.visible" class="sub-fast-entry" v-if="e.children && e.children.length">
              <div class="sfe-item" v-for="c in e.children" :key="c.uq_key" @click.prevent.stop="() => forwardRouteOrPage(e, c)" :class="{ active: routeMatched(c) }">
                <span class="txt">{{ c.label }}</span>
              </div>
            </div>
          </transition>
          <div class="img" @click.prevent.stop="() => switchModule(e)">
            <div class="i-box">
              <i class="iconfont" :class="[e.icon, e.class]" v-if="e.icon"></i>
              <img :src="e.img" alt="" v-else />
            </div>
            <div class="fg-bg"></div>
          </div>
          <div class="label" v-if="e.ready" @click.prevent.stop="() => forwardRouteOrPage(e)" :class="{ 'no-label': e.nolabel }">
            <span class="txt" :class="e.class">{{ e.label }}</span>
          </div>
          <el-popover v-else popper-class="func-not-ready-popper" trigger="hover" class="label">
            <span class="txt" slot="reference">{{ e.label }}</span>
            <div class="tip-box">
              <i class="el-icon-warning"></i>
              <span class="txt">该模块板块建设中...</span>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="fe-wrapper">
        <div class="day-box">
          <span class="txt">{{ value | df('LL') }}</span>
        </div>
        <el-popover class="circle-wrapper" v-model="calendarVisible">
          <div class="circle" slot="reference">
            <div class="circle-inner">
              <i class="iconfont icon-rili"></i>
            </div>
          </div>
          <div class="calendar-box">
            <el-calendar v-model="value">
              <template slot="dateCell" slot-scope="{ date }">
                <span @click="calendarVisible = false">{{ date | df('D') }}</span>
              </template>
            </el-calendar>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script>
import data from './footer_data.js'
import LOG from '@/utils/logger'
import API from '@/api'
import EVENT from "@/utils/Events";
export default {
  name: 'XsFooter',
  data () {
    return { entries: [], calendarVisible: false, value: new Date() }
  },
  created () {
    this.entries = _.map(
      _.filter(data, d => d.footable !== false),
      d => {
        if (d.path) {
          d.uq_key = d.path
        }
        if (d.children && d.children.length) {
          if (this.$store.state.UserInfo.orgCode === '320205005000') {
            d.children.splice(4)
          }
          _.forEach(d.children, (c, i) => {
            c.uq_key = `${d.path}/${i}`
          })
        }
        return d
      }
    )
  },
  watch: {
    value (v) {
      LOG.dir(v)
      this.$nextTick(() => {
        // 全局日历日期变化时
        this.$bus.$emit(EVENT.CALENDAR_DATA_PICKED, v)
      })
    }
  },
  methods: {
    // 当前路由是否匹配
    routeMatched (e) {
      let path = this.$route.path
      let query = this.$route.query
      if (e.path === path) {
        if (query && e.query) {
          return _.every(e.query, (v, k) => query[k] === v)
        } else {
          return true
        }
      }
      return false
    },
    // 切换模块
    switchModule (r) {
      let active = _.find(this.entries, e => e.visible)
      if (active !== r) {
        active && (active.visible = false)
        r.visible = true
      } else {
        r.visible = !r.visible
      }
      if (r.nolabel === true) {
        // 不显示文字时，点击图片自动切换模块
        this.forwardRouteOrPage(r)
      }
    },
    // 路由跳转
    forwardRouteOrPage (e, c) {
      console.info(e, 'forwardRouteOrPage')
      console.info(c, 'forwardRouteOrPage')
      e.visible = false
      if (c) {
        if (c.href) {
          this.openOutterPage(c)
        } else if (c.href2) {
          this.openOutterPage2(c)
        } else {
          c.path && this.$router.replace({ path: c.path, query: c.query, params: c.params })
        }
      } else {
        if (e.href2) {
          this.openOutterPage2(e)
        }
        // 如果当前用户是区用户
        if (this.$store.state[STATE.USER_INFO].orgCode === CONSTANT.XS_ORGCODE) {
          if (e.top_url) {
            this.openOutterPage(e, e.top_url)
            return
          }
        }
        if (e.href) {
          this.openOutterPage(e)
        } else {
          e.path && this.$router.push({ path: e.path, query: e.query, params: e.params })
        }
      }
    },
    // 打开外部页面
    openOutterPage (e, href) {
      if (e.beforeOpen) {
        // todo 传入当前登录账号
        e.beforeOpen().then(token => {
          window.open((href || e.href) + '?token=' + token, '_blank')
        })
      } else {
        window.open((href || e.href) + '?loginName=' + this.$store.state[STATE.USER_INFO].account, '_self')
      }
    },
    // 打开外部页面
    openOutterPage2 (e, href) {
      console.info(e, 'forwardRouteOrPage')
      console.info(href, 'forwardRouteOrPage')
      console.info(localStorage.getItem('auth'), 'forwardRouteOrPage')
      console.info(localStorage.getItem('loginName'), 'forwardRouteOrPage')
      const loginName = localStorage.getItem('loginName')
      API.command.login30(loginName)
      .then(res => {
        if (res.status == 200) {
          const token = res.data.data.authorizationCode
          window.open((href || e.href || e.href2) + e.module + '?token=' + token + '&title=锡山区区域治理现代化综合指挥中心')
        }
      })
      .catch((err) => {
        console.info(err)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.footer-inner {
  margin: auto;
  width: 100%;
  display: flex;
  .fast-entries {
    height: 100%;
    margin: auto;
    display: flex;
    position: relative;
    align-items: flex-end;
    .fe-wrapper {
      height: 100%;
      & + .fe-wrapper {
        margin-left: 8px;
      }
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      &.no-label {
        position: absolute;
        left: -10rem;
        bottom: 3.2rem;
        width: 10rem;
        .fast-entry {
          margin: 0 auto;
        }
      }
      .fast-entry {
        width: 10rem;
        margin: 0 auto;
        cursor: pointer;
        padding: 8px;
        display: flex;
        flex-direction: column;
        .sub-fast-entry {
          padding: 5px;
          // box-shadow: 0 0 5px #fff;
          .sfe-item {
            height: 2.8rem;
            border-radius: 1.4rem;
            display: flex;
            &:hover {
              box-shadow: 0 0 10px #fff;
            }
            &.active {
              background: #288abb;
              animation: faguang 2s ease-out 0.5s infinite;
            }
            .txt {
              // width: 100%;
              // text-align: justify;
              // text-align-last: justify;
              margin: auto;
              padding: 0 10px;
              font-size: 1.3rem;
              font-weight: bold;
              color: #fff;
              &:hover {
                font-weight: bolder;
              }
            }
          }
        }
        .img {
          display: flex;
          height: 7rem;
          width: 100%;
          display: flex;
          .i-box {
            margin: auto;
            display: flex;
            .iconfont {
              margin: auto;
              font-size: 5rem;
              color: #fff;
              line-height: 1;
              &::before {
                animation: faguang 2s ease-out 0.5s infinite;
                background: radial-gradient(circle, #164b74, transparent);
                border-radius: 50%;
              }
              &.red {
                color: #f00;
                &::before {
                  animation: faguang-red 2s ease-out 0.5s infinite;
                  background: radial-gradient(circle, #f00, transparent);
                  border-radius: 50%;
                }
              }
            }
            img {
              border-radius: 50%;
              height: 5.2rem;
              width: 5.2rem;
              margin: auto;
              object-fit: contain;
              animation: faguang 2s ease-out 0.5s infinite;
            }
          }
          position: relative;
          .fg-bg {
            position: absolute;
            height: 0;
            width: 0;
            top: 50%;
            left: 50%;
            box-shadow: 0 0 25px #fff;
            z-index: 1;
          }
        }
        .label {
          height: 3.2rem;
          padding: 0 5px;
          display: flex;
          border-radius: 2.4rem;
          &:hover {
            box-shadow: 0 0 10px #fff;
          }
          .txt {
            margin: auto;
            color: #fff;
            font-weight: bolder;
            font-size: 1.8rem;
            &:hover {
              font-weight: bolder;
            }
            &.red {
              color: #f00;
            }
          }
          &.no-label {
            display: none;
          }
        }
      }
      &:last-child {
        min-height: 100px;
        width: 100px;
        margin-bottom: 30px;
        display: none;
        // display: flex;
        flex-direction: column;
        justify-self: start;
        align-content: flex-start;
        .day-box {
          height: 24px;
          width: 100%;
          display: flex;
          .txt {
            margin: auto;
            color: #f8ea9a;
            font-size: 1.2rem;
            font-weight: bolder;
          }
        }
        .circle {
          margin: 0 auto;
          height: 60px;
          width: 60px;
          cursor: pointer;
          box-shadow: 0 0 25px #f8ea9a;
          border-radius: 50%;
          border: 3px dotted #f8ea9a;
          display: flex;
          .circle-inner {
            margin: auto;
            height: 50px;
            width: 50px;
            border-radius: 50%;
            border: 5px solid #f8ea9a;
            display: flex;
            .iconfont {
              margin: auto;
              color: #f8ea9a;
              font-size: 24px;
            }
          }
        }
      }
    }
  }
}
.tip-box {
  height: 100%;
  display: flex;
  justify-content: center;
  i {
    margin: auto 5px;
  }
  .txt {
    margin: auto 0;
  }
}
</style>
<style lang="scss">
.calendar-box {
  width: 400px;
  height: 32rem;
  .el-calendar__body {
    padding: 10px 2rem;
    .el-calendar-table {
      thead {
        th {
          text-align: center;
        }
      }
    }
    .current {
      &.is-selected {
        .el-calendar-day {
          background: #19dcbc;
          color: #fff;
        }
      }
    }
    .el-calendar-day {
      height: 32px;
      padding: 0;
      display: flex;
      > span {
        line-height: 32px;
        height: 100%;
        width: 100%;
        text-align: center;
      }
    }
  }
}
.func-not-ready-popper {
  background: transparent;
  color: #fff;
  position: absolute;
  height: 60px;
  top: auto !important;
  bottom: 85px;
}
</style>
