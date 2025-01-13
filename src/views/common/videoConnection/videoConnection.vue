<template>
  <xs-dialog :visible="visible" :fullscreen="fullscreen" :title="title" :minimize="minimize" :maximize="maximize" :width="width" :height="height" :close="close">
    <div class="video-connetion-wrap">
      <!--  监控视频列表 -->
      <div class="monitor-list" v-if="monitors.length > 0">
        <div class="monitor-item" v-for="(item, index) in monitors" :key="index">
          <camera-video :data="item"></camera-video>
        </div>
      </div>
      <!-- 视频连接区 -->
      <div class="video-connetion-container">
        <div class="camera-box">
          <video-call :powers="powers"></video-call>
        </div>
        <div class="operate-box">
          <div class="operate-btn" @click="toggleSetMicMute">
            <span class="txt">{{ metuTxt }}</span>
          </div>
          <div class="operate-btn" @click="handleCall" :class="callStatus">
            <span class="txt">{{ callStatusTxt }}</span>
          </div>
        </div>
      </div>
      <!-- 中间部分-场景  -->
      <div class="scene-list-container">
        <!-- 广角摄像头 -->
        <div class="monitor-center-list">
          <div class="monitor-center-item" v-if="hostorMonitor">
            <camera-video :data="hostorMonitor" :closable="false"></camera-video>
          </div>
          <div class="monitor-center-item" v-if="otherMonitor">
            <camera-video :data="otherMonitor" :closable="false"></camera-video>
          </div>
        </div>
        <!-- 参与者 -->
        <div class="people-list">
          <div class="scene-item" v-for="(item, idx) in powers" :key="idx">
            <div class="img-box">
              <img :src="item.url && item.url !== '' ? item.url : defaultAvatar" v-if="item.account != account" />
            </div>
            <div class="item-info">
              <div class="ii">
                <span class="txt name">{{ item.name }}</span>
              </div>
              <div class="ii">
                <span class="txt phone">{{ item.phone }}</span>
              </div>
              <div class="ii">
                <el-tooltip effect="light" :content="item.orgName">
                  <span class="txt grid">{{ item.orgName }}</span>
                </el-tooltip>
              </div>
              <div class="ii">
                <span class="txt position">{{ item.post }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧部分 -->
      <div class="chat-wrap">
        <!-- 点调既要 -->
        <div class="summary-box">
          <meet-summary ref="meetSummary" v-if="isCenterAjustment" :powers="powers" />
          <!-- 参会者 -->
          <participants v-else :addCantacts="addCantacts" :addMonitors="addMonitors" :checkedMonitors="monitors" :checkedPowers="powers" :circleOption="circleOption" />
        </div>
        <!-- 对话聊天 -->
        <div class="chat-tit xs-drawer-item-head">
          <div class="title">
            <span class="txt">对话聊天</span>
          </div>
          <div class="line"></div>
          <div class="dot"></div>
        </div>
        <mini-multi-txt-chat :powers="powers" :groupID="groupID" />
      </div>
    </div>
  </xs-dialog>
</template>

<script>
import defaultAvatar from '@/assets/img/common/defaultAvatar.png'
import icons from '@/components/basic/chat/icon/icons.vue'
import videoCall from '@/views/common/video-call/VideoCall.vue'
import XsDialog from '@/components/Base/XsDialog.vue'
import windowOp from '@/components/command/windowOp.js'
import MiniMultiTxtChat from './MiniMultiTxtChat'
import MeetSummary from './meetSummary'
import Participants from '@/views/common/participants/participants'
import CameraVideo from '@/components/video/CameraVideo'
import { mapState } from 'vuex'
const CallStatusTxts = {
  idle: '拨号',
  calling: '拨号中...',
  connected: '挂断'
}
export default {
  name: 'VideoConnection',
  components: {
    XsDialog,
    videoCall,
    MiniMultiTxtChat,
    MeetSummary,
    Participants,
    CameraVideo
  },
  inject: ['callGroup', 'hangup', 'setMicMute'],
  mixins: [windowOp],
  props: {
    isCenterAjustment: { type: Boolean, default: () => false }, // 是否是中心呼中心
    circleOption: {
      longitude: undefined,
      latitude: undefined,
      scope: 1
    }
  },
  data () {
    return {
      account: undefined,
      defaultAvatar,
      monitors: [],
      hostorMonitor: undefined,
      otherMonitor: undefined,
      isAudioOn: true
    }
  },
  computed: {
    metuTxt () {
      return this.isAudioOn ? '静音' : '已静音'
    },
    callStatus () {
      return this.$store.state[STATE.CALLSTATUS]
    },
    callStatusTxt () {
      return CallStatusTxts[this.callStatus]
    },
    isInviter () {
      return this.$store.state[STATE.IS_INVITER]
    },
    powers () {
      return this.$store.state[STATE.GROUP_MEMBERS]
    },
    groupID () {
      return this.$store.state[STATE.GROUPID]
    },
    shouldClose () {
      let currentAccount = this.$store.state[STATE.USER_INFO].account
      // 如果当前用户不在群组里, 或者只有当前用在群组里
      return _.every(this.powers, p => p.account !== currentAccount) || !_.some(this.powers, p => p.account !== currentAccount)
    }
  },
  watch: {
    shouldClose (value) {
      if (value === true) {
        this.close()
      }
    }
  },
  mounted () {
    this.getMonitors()
  },
  beforeDestroy () {
    this.hangup()
  },
  destroyed () {
    // 清空
    this.$store.commit(STATE.GROUP_MEMBERS, [])
    this.$store.commit(STATE.GROUPID, '')
  },
  methods: {
    //  todo 当有新增用户加入/离开时，广角摄像头应该也要随着变化
    //  获取当前用户广角摄像头
    getMonitors () {
      let me = this.$store.state[STATE.USER_INFO]
      API.video.getVidioList({ pageSize: 10, currPage: 1, monitorSource: 3, isQueryOneself: 2 }).then(res => {
        if (me.orgCode === '320205') {
          this.hostorMonitor = res.data.data.list[0]
        } else {
          this.otherMonitor = res.data.data.list[0]
        }
      })
      // 如果是中心点调，获取被点调的街道监控
      if (this.isCenterAjustment) {
        API.video.getVideoListWithoutPage({ monitorSource: 3, queryType: 6, orgCode: '320200' }).then(res => {
          this.powers.map((p, index) => {
            if (p.account !== this.$store.state[STATE.USER_INFO].account) {
              res.data.data.map(item => {
                if (item.orgCode == p.orgCode) {
                  if (me.orgCode === '320205') {
                    this.otherMonitor = item
                  } else {
                    this.hostorMonitor = item
                  }
                }
              })
            }
          })
        })
      }
    },
    toggleSetMicMute () {
      this.isAudioOn = !this.isAudioOn
      this.setMicMute(!this.isAudioOn)
    },
    handleCall () {
      if (this.callStatus === 'idle') {
        // this.$refs.meetSummary.callStart()
        this.callGroup(this.powers)
      } else {
        // 如果是接受方，则关闭当前页面
        this.close()
      }
    },
    filter (orgName) {
      let _orgName = orgName.split('-')
      return _orgName[_orgName.length - 1]
    },
    addCantacts (powers) {
      // if (this.powers.length + powers.length > 4) {
      //   return this.$notify({ title: '提示', message: `最多只支持呼叫3个人`, type: 'warning' })
      // }
      // this.initPowers()
      // powers.map((item, idx) => {
      //   if (_.findIndex(this.powers, p => p.account === item.account) < 0) {
      //     this.joinedPowers.push({
      //       // proImg: item.url,
      //       proImg: '/static/img/user_online.png',
      //       proNm: (item.orgName || '锡山区') + '-' + item.realName + '-' + (item.phone || item.mobilePhone),
      //       account: item.loginName || item.account,
      //       orgName: item.orgName || '',
      //       name: item.realName || item.name,
      //       phone: item.phone || item.mobilePhone
      //     })
      //   }
      // })
    },
    addMonitors (monitors) {
      this.monitors = monitors
    }
  }
}
</script>

<style lang="scss" scoped>
.video-connetion-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  // 摄像头
  .video-connetion-container {
    height: 100%;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    .camera-box {
      flex: 1;
      min-height: 0;
    }
    .operate-box {
      height: 10%;
      box-shadow: 0px -5px 10px #0f6e5e;
      display: flex;
      justify-content: space-evenly;
      .operate-btn {
        margin: auto;
        cursor: pointer;
        // height: 32px;
        // line-height: 32px;
        border-radius: 1.8rem;
        padding: 0.6rem 3rem;
        background: #fff;
        color: #000;
        &:hover {
          box-shadow: 0 0 5px #fff;
        }
        &.idle {
          background: green;
          color: #fff;
        }
        &.connected {
          background: #ff0000;
          color: #fff;
        }

        display: flex;
        .txt {
          margin: auto;
          font-size: 1.4rem;
        }
      }
    }
  }

  // 场景
  .scene-list-container {
    border-left: 1px solid #eee;
    // width: 17re;
    flex: 0.45;
    height: 100%;
    display: flex;
    flex-direction: column;
    .monitor-center-list {
      width: 100%;
      .monitor-center-item {
        width: 100%;
        height: 14rem;
      }
    }
    .people-list {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .scene-item {
        margin-top: 8px;
        border-top: 1px dashed #fff;
        &:last-child {
          border-bottom: 1px dashed #fff;
          margin-bottom: 8px;
        }
        display: flex;
        .img-box {
          margin: auto;
          width: 6.67rem;
          height: 6.67rem;
          display: flex;
          img {
            margin: auto;
            height: 100%;
            width: 100%;
            object-fit: scale-down;
          }
        }
        .item-info {
          flex: 1;
          min-width: 0;
          .ii {
            width: 100%;
            height: 2.4rem;
            display: flex;
            .txt {
              margin: auto 0;
              font-size: 1.2rem;
              color: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &.name {
                &::before {
                  content: '姓名:';
                }
              }
              &.phone {
                &::before {
                  content: '电话:';
                }
              }
              &.grid {
                &::before {
                  content: '网格:';
                }
              }
              &.position {
                &::before {
                  content: '职位:';
                }
              }
            }
          }
        }
      }
    }
  }
  // 聊天
  .chat-wrap {
    flex: 0.5;
    min-width: 0;
    height: 100%;
    border-left: 1px solid #eee;
    color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .summary-box {
      max-height: 30rem;
      overflow: hidden;
      // 参与者
      .chat-attendance {
        max-height: 15rem;
        padding: 0.8rem;
      }
    }
    .chat-tit {
      padding: 0 0.8rem;
      width: 100%;
      height: 3.2rem;
      line-height: 3.2rem;
    }
    .chat-box {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      /deep/ .chat-op-wrapper {
        max-height: 15rem;
      }
    }
  }
}
</style>
