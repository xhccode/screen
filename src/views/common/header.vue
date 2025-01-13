<template>
  <div :class="['header-inner', { 'no-head': $route.meta.header === false }]">
    <div class="nav-box" alt="导航栏">
      <i class="iconfont icon-daohang"></i>
      <el-select v-model="rn" size="mini" value-key="uq_key" popper-class="xs-select-dropdown">
        <el-option v-for="(e, i) in entries" :key="i" :value="e" :label="e.label"></el-option>
      </el-select>
    </div>
    <div class="header-tip">
      <div class="ht-ii left">
        <div class="weather">
          <i class="iconfont icon-cloud"></i>
          <span class="txt">多云</span>
        </div>
        <div class="time">
          <span class="txt">{{ currTime }}</span>
        </div>
      </div>
      <div class="ht-ii right">
        <div class="user">
          <el-dropdown trigger="click" @command="command">
            <span class="">
              <i class="iconfont icon-touxiang"></i>
              <span class="txt">当前登录：</span>
              <span class="txt">{{ orgName }}</span>
              <span class="txt divider">-</span>
              <span class="txt">{{ userName }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="user-op" slot="dropdown">
              <el-dropdown-item command="modifyPwd">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="logout">
          <el-popconfirm title="确定退出吗？" @confirm="logout" @onConfirm="logout" popper-class="xs-popover" class="logout-trigger" cancel-button-type="info">
            <div class="logout-inner" slot="reference">
              <el-tooltip content="退出" effect="light">
                <i class="iconfont icon-poweroff center-dot"></i>
              </el-tooltip>
            </div>
          </el-popconfirm>
        </div>
      </div>
    </div>
    <div class="header-tit" @click="$router.push({ name: 'Dashboard' })" v-show="$route.meta.header !== false">
      <img src="/static/img/title-bg-sf-hq.png" v-if="orgCode == '320205005000'" />
      <img src="/static/img/title-bg-sf-text.png" v-else />
      <!-- <span class="txt sub">({{ orgName }})</span> -->
    </div>
    <!-- 紧急事件 -->
    <div class="jjsj-box">
      <div class="jjcd-tj" :class="{ active: hasExpressEvent }" v-if="statis.expressNum > 0">
        <i class="iconfont icon-lingdang-solid" @click="() => forwardCommand('EXPRESS')">
          <span class="txt">{{ statis.expressNum }}</span>
        </i>
      </div>
      <div class="jjcd-jj" :class="{ active: hasUrgentEvent }" v-if="statis.urgentNum > 0">
        <i class="iconfont icon-lingdang-solid" @click="() => forwardCommand('URGENT')">
          <span class="txt">{{ statis.urgentNum }}</span>
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import data from './footer_data.js'

export default {
  name: 'XsHeader',
  data () {
    return {
      interval: -1,
      timer: -1,
      currTime: '',
      status: false,
      counter: this.$route.query ? parseInt(this.$route.query['xs.router.times'] || 1) : 1
    }
  },
  computed: {
    userName () {
      return this.$store.state[STATE.USER_INFO].realName
    },
    account () {
      return this.$store.state[STATE.USER_INFO].account || this.$store.state[STATE.USER_INFO].loginName
    },
    appName () {
      return process.env.APP_NAME
    },
    orgName () {
      let orgName = this.$store.state[STATE.USER_INFO].orgName
      if (orgName.indexOf('-') > -1) {
        return orgName.split('-').slice(-1)[0]
      } else {
        return orgName
      }
    },
    orgCode () {
      return this.$store.state[STATE.USER_ORG].orgCode
    },
    rn: {
      set (value) {
        LOG.warn('进入路由:' + JSON.stringify(value))
        if (value.href) {
          window.open(value.href, '_self')
        } else {
          this.$router.replace(value)
        }
      },
      get () {
        let path = this.$route.path
        let query = this.$route.query
        let result = _.find(this.entries, e => {
          if (e.path === path) {
            if (query && e.query) {
              return _.every(e.query, (v, k) => query[k] === v)
            } else {
              return true
            }
          }
          return false
        })
        return result
      }
    },
    entries () {
      let entries = _.flatMap(data, d => {
        let result = []
        if (d.path) {
          d.uq_key = d.path
          result.push(d)
        }
        if (d.children && d.children.length) {
          result = result.concat(
            _.filter(d.children, c => c.path).map((c, i) => {
              c.uq_key = `${d.path}/${i}`
              return c
            })
          )
        }
        return result
      })
      // 城市运行提前
      let cityIndex = _.findIndex(entries, { label: '城市运行' })
      entries.unshift(entries[cityIndex])
      entries.splice(cityIndex + 1, 1)
      return entries
    },
    statis () {
      return {
        expressNum: this.$store.state[STATE.EVENTS].ExtraUrgentList.length,
        urgentNum: this.$store.state[STATE.EVENTS].UrgentList.length
      }
    },
    // 是否有特急事件
    hasExpressEvent () {
      return this.$store.state[STATE.HAS_EXPRESS_EVENT]
    },
    // 是否有紧急事件
    hasUrgentEvent () {
      return this.$store.state[STATE.HAS_URGENT_EVENT]
    }
  },
  watch: {
    [`$store.state.${STATE.EVENTS}`]: {
      handler ({ ExtraUrgentList, UrgentList }) {}
    }
  },
  inject: ['loginTrtcAndTim', 'logoutTrtcAndTim'],
  methods: {
    // 点击特急/紧急数字进入指挥页面
    forwardCommand (jjcd) {
      this.$store.dispatch('updateEventReadflag', jjcd).then(() => {
        this.$router.replace({ name: 'Conduct', path: '/conduct', query: { lc: 'CommandCamera', rc: 'CommandPower', jjcd, 'xs.router.times': ++this.counter } })
      })
    },
    command (value) {
      if (this[value]) {
        this[value]()
      }
    },
    // 退出登录
    logout () {
      API.login
        .logout()
        .then(res => {
          if (process.env.NODE_ENV === 'production') {
            this.$store.commit(STATE.USER_INFO, {})
            this.$store.commit(STATE.AUTHORIZATION_CODE, '')
          }
          this.$router.push({ name: 'Login' })
          this.$notify.success({
            title: '成功',
            message: '退出成功'
          })
        })
        .catch(() => {})
    },
    // 修改密码
    modifyPwd (data) {
      this.$data.modalData.flag = true
    },
  },
  created () {
    this.currTime = this.$fmt(new Date(), 'YYYY年MM月DD日 HH:mm:ss dddd')
    this.interval = setInterval(() => {
      this.currTime = this.$fmt(new Date(), 'YYYY年MM月DD日 HH:mm:ss dddd')
    }, 1000)
    this.$bus.$on(EVENT.TIM_STATUS_CHANGE, status => {
      this.status = status
    })
  },
  beforeDestroy () {
    if (this.interval > -1) {
      clearInterval(this.interval)
    }
    if (this.timer > -1) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style lang="scss" scoped>
.header-inner {
  height: 100%;
  position: relative;
  background: url('/static/img/title-bg-sf.png') no-repeat center top;
  background-size: 100% 100%;
  &.no-head {
    height: 180px;
    .nav-box {
      bottom: 10px;
    }
  }
  .nav-box {
    position: absolute;
    left: 1.5rem;
    bottom: -1rem;
    width: 18rem;
    color: #fff;
    display: flex;
    cursor: pointer;
    /deep/ .el-input {
      height: 100%;
      .el-input__inner {
        background: transparent;
        color: #fff;
        border: none;
        height: 100%;
      }
      .el-input__suffix {
        height: 100%;
        line-height: 2.8rem;
        display: flex;
        .el-input__suffix-inner {
          margin: auto;
          height: 2.8rem;
          display: flex;
          i {
            font-size: 1.4rem;
            font-weight: bolder;
            color: #fff !important;
            display: flex;
            &::before {
              margin: auto;
            }
          }
        }
      }
    }
    .iconfont {
      color: #fff;
      font-weight: bolder;
      font-size: 25px;
      margin: auto 8px;
    }
  }
  .header-tip {
    height: 3.2rem;
    line-height: 3.2rem;
    color: #fff;
    display: flex;
    justify-content: space-between;
    .ht-ii {
      display: flex;
    }
    .huishang {
      .txt {
        color: #fff;
        font-size: 1.4rem;
        font-weight: bolder;
        padding: 0.5rem;
        margin-right: 1rem;
        &:hover {
          box-shadow: 0 0 0.5rem #fff;
        }
      }
    }
    .user {
      cursor: pointer;
      .el-dropdown {
        height: 100%;
        .el-dropdown-selfdefine {
          height: 100%;
          display: flex;
          .iconfont {
            margin: auto 5px;
            color: #fff;
            font-weight: bold;
          }
          .txt {
            margin: auto;
            color: #fff;
            &.divider {
              padding: 0 3px;
            }
          }
          .el-icon-arrow-down {
            margin: auto 5px;
            color: #fff;
            font-weight: bolder;
          }
        }
      }
    }
    .trtc-status {
      display: flex;
      .label {
      }
      .trtc-sel {
        width: 12rem;
      }
    }
    .weather {
      display: flex;
      margin: auto 8px;
      .iconfont {
        margin: auto 3px;
      }
      .txt {
        margin: auto 2px;
      }
    }
    .time {
      letter-spacing: 1.5px;
      display: flex;
      .txt {
        margin: auto;
      }
    }
    .logout {
      width: 8rem;
      .logout-trigger {
        height: 100%;
        width: 100%;
        cursor: pointer;
        display: flex;
        .logout-inner {
          margin: auto;
          display: flex;
          .iconfont {
            margin: auto;
            cursor: pointer;
            &:hover {
              box-shadow: 0 0 3px #fff;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  .header-tit {
    position: absolute;
    top: 2rem;
    img {
      width: auto;
      height: 2.6rem;
    }
    @media screen and (min-width: 3600px) {
      top: 1.4rem;
      img {
        height: 3.4rem;
      }
    }
    width: 100%;
    height: 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    .txt {
      color: #fff;
      font-size: 2.4rem;
      @media screen and (min-width: 3600px) {
        font-size: 3.2rem;
      }
      font-weight: bolder;
      text-shadow: 0 0 5px #fff;
      &.sub {
        font-size: 24px;
      }
    }
  }
  .jjsj-box {
    position: absolute;
    right: 2.5rem;
    top: 5rem;
    right: 20rem;
    display: flex;
    .icon-lingdang-solid:after {
      content: '\e606';
    }
    .jjcd-tj {
      display: flex;
      width: 8rem;
      height: 6.4rem;
      line-height: 6.4rem;
      // border: 1px solid #ff0000;
      border-radius: 5px;
      // background: rgba(#ff0000, 0.3);
      cursor: pointer;
      position: relative;
      &.active {
        .iconfont::before {
          // content: '';
          // width: 80px;
          // height: 44px;
          // position: absolute;
          // left: 50%;
          // top: 50%;
          // margin-left: -40px;
          // margin-top: -22px;
          animation: lianyi 1.5s ease-out 0s infinite;
          // border-radius: 5px;
          // background: rgba(#ff0000, 1);
        }
      }
      .iconfont {
        margin: auto;
        height: 6rem;
        width: 6rem;
        display: flex;
        position: relative;
        &::after,
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: -1;
          color: #ff0000;
          font-size: 6rem;
        }
        &::after {
          transform: scale(0.7);
        }
        .txt {
          margin: auto;
          color: #fff;
          font-size: 1.4rem;
          font-weight: bolder;
        }
      }
    }
    .jjcd-jj {
      margin-left: 0px;
      display: flex;
      width: 8rem;
      height: 6.4rem;
      line-height: 6.4rem;
      // border: 1px solid #fdee0f;
      border-radius: 5px;
      // background: rgba(#fdee0f, 0.3);
      cursor: pointer;
      position: relative;
      &.active {
        .iconfont::before {
          // content: '';
          // width: 8rem;
          // height: 6.4rem;
          // line-height: 6.4rem;
          // position: absolute;
          // left: 50%;
          // top: 50%;
          // margin-left: -4rem;
          // margin-top: -2.2rem;
          animation: lianyi 1.5s ease-out 0s infinite;
          // background: rgba(#fdee0f, 1);
        }
      }
      .iconfont {
        margin: auto;
        height: 6rem;
        width: 6rem;
        display: flex;
        position: relative;
        &::after,
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: -1;
          color: #fdee0f;
          font-size: 6rem;
        }
        &::after {
          transform: scale(0.7);
        }
        .txt {
          margin: auto;
          color: #fff;
          font-size: 1.4rem;
          font-weight: bolder;
        }
      }
    }
  }
}

.user-op {
  background: rgba(19, 41, 47, 0.8);
  .el-dropdown-menu__item {
    & + .el-dropdown-menu__item {
      border-top: 1px solid #fff;
    }
    width: 12rem;
    color: #fff;
    box-sizing: border-box;
    text-align: center;
  }
}
</style>
<style lang="scss">
.router-sel-popper {
  border-radius: 0;
  background: transparent;
  box-shadow: 0 0 10px #eee;
  .popper__arrow {
    top: -6px;
    &::after {
      top: 0 !important;
    }
  }
  .el-select-dropdown__wrap {
    background: transparent;
    .el-select-dropdown__list {
      padding: 0;
      .el-select-dropdown__item {
        background: rgba(#000, 0.5);
        color: #fff;
        &.selected {
          color: #41f7f8;
        }
      }
    }
  }
}
</style>
