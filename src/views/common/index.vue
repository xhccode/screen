<template>
  <div class="main-box">
    <audio ref="audioMsgArrived" :src="audioMsgArrived" />
    <div class="header-box">
      <xs-header />
    </div>
    <div class="body-box">
      <router-view :key="currentRouteKey" />
    </div>
    <div class="footer-box" v-show="$route.meta.footer !== false">
      <xs-footer />
    </div>
    <!-- 左下最小化窗口 -->
    <div class="min-win-holder">
      <div class="min-win" v-for="(w, index) in windows" :key="index" @click.stop.prevent="() => recoverWindow(index)">
        <el-badge v-if="w.badge" :value="w.badge" class="item">
          <span class="txt">{{ w.title }}</span>
        </el-badge>
        <span v-else class="txt">{{ w.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import XsFooter from './footer'
import XsHeader from './header'
import WindowContainer from '@/components/command/windowContainer'
import VideoListDialog from '@/components/pollList/videoList.vue'
import * as utils from '@/utils'
export default {
  name: 'index',
  components: { XsHeader, XsFooter },
  mixins: [WindowContainer],
  data () {
    return {
      audioMsgArrived: require('@/assets/raw/msgArrived.mp3'),
      dialogPoll: undefined
    }
  },
  provide () {
    return {
      customClass: () => {
        let meta = this.$route.meta
        if (meta && meta.customClass && _.isFunction(meta.customClass)) {
          return meta.customClass(this.$route)
        }
        return ''
      }
    }
  },
  mounted () {
    this.$bus.$on(EVENT.TIM_MESSAGE_RECEIVED, this.whenMsgArrived)
    this.$bus.$on(EVENT.POLL_START, this.whenPollStart)
    this.$bus.$on(EVENT.POLL_END, this.whenPollEnd)
    setInterval(() => {
      if (this.$route.fullPath != '/conduct?lc=CommandCamera&rc=CommandPower') {
        // 只在指挥界面自动弹出
        return
      }
      let { pollInfo, pollParams } = this.$store.state[STATE.POLL]
      let now = new Date()
      if (pollParams && pollParams.time && pollParams.time.length == 2) {
        if (now >= utils.getCurDayTime(pollParams.time[0]) && now <= utils.getCurDayTime(pollParams.time[1])) {
          if (!this.dialogPoll) {
            this.$extendDialog(VideoListDialog, {}, { title: '轮询组-' + pollInfo.rotationName, pollInfo, pollParams })
          }
        }
        if (now > new Date(pollParams.time[1])) {
          if (this.dialogPoll) {
            this.dialogPoll = undefined
          }
        }
      }
    }, 1000)
  },
  beforeDestroy () {
    this.$bus.$off(EVENT.TIM_MESSAGE_RECEIVED, this.whenMsgArrived)
    this.$bus.$off(EVENT.POLL_START, this.whenPollStart)
  },
  computed: {
    currentRouteKey () {
      if (_.isFunction(this.$route.meta.dynamicKey)) {
        return this.$route.meta.dynamicKey(this.$route)
      } else {
        return this.$route.name || this.$route.path
      }
    }
  },
  methods: {
    whenMsgArrived ({ msg }) {
      this.windows.map(item => {
        if (msg[0].to == item.groupID) {
          this.$refs.audioMsgArrived.pause()
          this.$refs.audioMsgArrived.play()
          item.badge++
        }
      })
    },
    whenPollStart (pollInfo) {
      if (pollInfo.close) {
        this.dialogPoll = pollInfo
      } else {
        if (this.dialogPoll) {
          this.dialogPoll.recoverWindow()
        } else {
          this.$extendDialog(VideoListDialog, {}, { title: '轮询组-' + pollInfo.rotationName, pollInfo, pollParams: this.$store.state[STATE.POLL].pollParams })
        }
      }
    },
    whenPollEnd () {
      if (this.dialogPoll) {
        this.dialogPoll = undefined
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/style/min-win-container.scss';
.main-box {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  .header-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: 6rem;
  }
  .body-box {
    width: 100%;
    height: 100%;
    overflow: visible;
    position: relative;
  }
  .footer-box {
    position: fixed;
    bottom: 5rem;
    left: 32vw;
    z-index: 100;
    width: 36vw;
    @media screen and(min-width: 3600px) {
      bottom: 4rem;
      width: 30vw;
      left: 35vw;
    }
    display: flex;
  }
}
</style>
