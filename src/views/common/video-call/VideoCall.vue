<template>
  <div class="video-call-section">
    <!-- 拨打声音文件 -->
    <audio ref="audioLoading" loop :src="wav" />
    <div class="videoes" :class="{ wrappable: horizontal !== true }">
      <div class="video-wrapper" :class="[{ less2: powers.length < 3 }, { horizontal: horizontal }]" v-for="power in powers" :key="`video-${power.account}`">
        <div :id="`video-${power.account}`" :ref="`video-${power.account}`" class="user-video-container">
          <div class="username">
            <span class="txt" :class="{ 'is-me': isMe(power) }">{{ power.name }}</span>
          </div>
          <div class="userstatus">
            <div class="us">
              <i class="iconfont icon-shexiangtou" :class="power.isVideoOn ? 'on' : 'off'"></i>
            </div>
            <div class="us">
              <i class="iconfont icon-maike" :class="power.isAudioOn ? 'on' : 'off'"></i>
            </div>
          </div>
          <div class="loading" v-if="power.callStatus === 'calling'">
            <div class="loading-center">
              <div class="loading-center-absolute">
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'VideoCall',
  inject: ['callGroup', 'hangup', 'doWithTrtcAndTim'],
  props: {
    horizontal: { type: Boolean, default: () => true }
  },
  data () {
    return {
      isVideoOn: true,
      isAudioOn: true,
      userId2Name: {},
      wav: require('@/assets/raw/opening.wav'),
      localView: false
    }
  },
  computed: {
    isInviter () {
      return this.$store.state[STATE.IS_INVITER]
    },
    powers () {
      return this.$store.state[STATE.GROUP_MEMBERS]
    },
    callStatus () {
      return this.$store.state[STATE.CALLSTATUS]
    }
  },
  watch: {
    callStatus (status) {
      if (status === 'calling') {
        this.$refs.audioLoading.play()
      } else {
        this.$refs.audioLoading.pause()
      }
    }
  },
  mounted () {
    // this.$bus.$on(EVENT.RTC_USER_ENTER, this.whenUserEntered)
    this.$bus.$on(EVENT.RTC_USER_VIDEO_AVAILABLE, this.whenUserVideoChanged)
    this.$bus.$on(EVENT.RTC_USER_AUDIO_AVAILABLE, this.whenUserAudioChanged)
    // 发布自己的流
    if (this.isInviter === false) {
      this.doWithTrtcAndTim(trtc => {
        // 播放已经加入的流
        _.filter(this.powers, power => power[CONSTANT.JOINED] === true).forEach(power => {
          this.whenUserEntered({ trtc, power })
        })
      })
    }
  },
  destroyed () {
    // this.$bus.$off(EVENT.RTC_USER_ENTER, this.whenUserEntered)
    this.$bus.$off(EVENT.RTC_USER_VIDEO_AVAILABLE, this.whenUserVideoChanged)
    this.$bus.$off(EVENT.RTC_USER_AUDIO_AVAILABLE, this.whenUserAudioChanged)
    this.doWithTrtcAndTim(trtc => {
      try {
        if (trtc.getCallStatus() === 'connected') {
          this.hangup()
        }
      } catch (e) {}
      trtc._resetTRTCClient()
    })
  },
  methods: {
    //
    isMe (power) {
      return power.account === this.$store.state[STATE.USER_INFO].account
    },
    getPower (account) {
      return _.find(this.powers, p => p.account === account)
    },
    //
    publishLocalStream (trtc) {
      let currentAccount = this.$store.state[STATE.USER_INFO].account
      let power = this.getPower(currentAccount)
      if (this.callStatus === 'calling') {
        this.$store.commit(STATE.CALLSTATUS, 'connected')
        this.$set(power, 'isAudioOn', true)
        this.$set(power, 'isVideoOn', true)
        LOG.warn('播放本地流...')
        trtc
          .startLocalView({
            userID: currentAccount,
            videoViewDomID: `video-${currentAccount}`
          })
          .then(() => {
            this.$set(power, CONSTANT.CALLSTATUS, 'connected')
            LOG.warn('成功发布本地视频流...')
          })
      }
    },
    // 当有新成员接入通话时
    whenUserEntered ({ trtc, power }) {
      // this.publishLocalStream(trtc)
      // let currentAccount = this.$store.state[STATE.USER_INFO].account
      // if (power.account !== currentAccount) {
      //   this.$set(power, CONSTANT.CALLSTATUS, 'connected')
      //   this.$set(power, 'isAudioOn', true)
      //   this.$set(power, 'isVideoOn', true)
      //   this.$nextTick(() => {
      //     trtc
      //     .startRemoteView({
      //       userID: power.account,
      //       videoViewDomID: `video-${power.account}`
      //     })
      //     .then(() => {})
      //   LOG.warn('成功订阅远程(' + power.account + ')视频流...')
      //   })
      // }
    },
    // 对方摄像头状态变化时
    whenUserVideoChanged ({ trtc, power, isVideoAvailable }) {
      this.$set(power, 'isVideoOn', isVideoAvailable)
      if (isVideoAvailable === false) {
        if (power[CONSTANT.CALLSTATUS] === 'connected') {
          this.$set(power, CONSTANT.CALLSTATUS, 'calling')
          trtc.stopRemoteView({
            userID: power.account,
            videoViewDomID: `video-${power.account}`
          })
        }
      } else {
        if (power[CONSTANT.CALLSTATUS] !== 'connected') {
          this.$set(power, CONSTANT.CALLSTATUS, 'connected')
          trtc.startRemoteView({
            userID: power.account,
            videoViewDomID: `video-${power.account}`
          })
        }
      }
    },
    // 对方麦克状态变化时
    whenUserAudioChanged ({ trtc, power, isAudioAvailable }) {
      this.$set(power, 'isAudioOn', isAudioAvailable)
    }
  }
}
</script>

<style lang="scss" scoped>
.video-call-section {
  width: 100%;
  height: 100%;
  audio {
    display: none;
  }
  .videoes {
    height: 100%;
    width: 100%;
    display: flex;
    &.wrappable {
      flex-wrap: wrap;
      justify-content: flex-start;
      .video-wrapper {
        height: 50%;
        width: 50%;
        &.less2 {
          height: 100%;
        }
      }
    }
    padding: 0.5rem;
    .video-wrapper {
      &.horizontal {
        flex: 1;
        min-width: 0;
        height: 100%;
      }
      padding: 0.5rem;
      .user-video-container {
        border: 1px dashed #fff;
        width: 100%;
        height: 100%;
        position: relative;
        .username {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          display: flex;
          padding: 0.3rem;
          .txt {
            color: #fff;
            font-size: 1.2rem;
            margin: auto 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.is-me {
              &::after {
                content: '(我)';
              }
            }
          }
        }
        .loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          .loading-center {
            margin: auto;
            .loading-center-absolute {
              display: flex;
              .object {
                & + .object {
                  margin-left: 5px;
                }
                width: 5px;
                height: 5px;
                background-color: #fff;
                border-radius: 50%;
                animation: object 1s infinite;
                &:last-child {
                  margin-right: 0px;
                }
                &:nth-child(9) {
                  animation-delay: 0.9s;
                }
                &:nth-child(8) {
                  animation-delay: 0.8s;
                }
                &:nth-child(7) {
                  animation-delay: 0.7s;
                }
                &:nth-child(6) {
                  animation-delay: 0.6s;
                }
                &:nth-child(5) {
                  animation-delay: 0.5s;
                }
                &:nth-child(4) {
                  animation-delay: 0.4s;
                }
                &:nth-child(3) {
                  animation-delay: 0.3s;
                }
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
              }
            }
          }
        }
        .userstatus {
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 1;
          width: 100%;
          display: flex;
          padding: 3px;
          justify-content: space-evenly;
          .us {
            margin: auto;
            color: #fff;
            .iconfont {
              &.off {
                color: #ff0000;
              }
            }
          }
        }
        /deep/ video {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}

@keyframes object {
  50% {
    transform: translate(0, -10px);
  }
}
</style>
