<template>
  <div class="chat-box">
    <div class="chat-logs" ref="chatLogs">
      <div class="log" v-for="(log, index) in logs" :key="index" :class="log.direction">
        <!-- 头像 -->
        <div class="avatar">
          <img src="@/assets/img/power/userOnline.png" />
        </div>
        <!-- 消息 -->
        <div class="msg">
          <!-- 发送者 -->
          <div class="sender">
            <span class="name">{{ log.diaUser }}</span>
            <span class="time">{{ log.diaTime }}</span>
          </div>
          <!-- 消息内容 -->
          <div class="content" :class="log.direction">
            <span :class="log.direction" v-html="log.diaContent"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-op-wrapper">
      <chat-input-box @inputed="sendChatLog"></chat-input-box>
    </div>
  </div>
</template>
<script>
import ChatInputBox from '@/components/command/ChatInputBox'
import moment from 'moment'
export default {
  components: { ChatInputBox },
  name: 'MiniMultiTxtChat',
  inject: ['sendTxtMessage', 'destroyChatGroup'],
  props: {
    powers: { type: Array, required: true },
    groupID: { type: String }
  },
  provide () {
    return {
      doSend: log => {
        this.sendChatLog(log)
      }
    }
  },
  data () {
    return {
      logs: []
    }
  },
  created () {
    this.$bus.$on(EVENT.TIM_MESSAGE_RECEIVED, this.whenMsgArrived)
    LOG.warn('当前参与文字聊天的成员有：')
    LOG.dir(this.powers)
  },
  beforeDestroy () {
    this.$bus.$off(EVENT.TIM_MESSAGE_RECEIVED, this.whenMsgArrived)
    // todo 如何销毁群组
  },
  methods: {
    /**
     *  user 消息发送者id
     *  chatLog 消息内容
     */
    sendChatLog (chatLog) {
      // this.$emit('aa', chatLog)
      let log = {
        diaUser: `${this.$store.state[STATE.USER_INFO].name}`,
        diaTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        diaContent: chatLog,
        direction: 'sent'
      }
      // todo 保存记录
      this.appendLog(log)
      this.sendTxtMessage(this.groupID, chatLog)
    },
    /**
     * 追加消息
     */
    appendLog (log) {
      if (!log.diaContent) return
      this.logs.push(log)
      this.$nextTick(() => {
        if (this.$refs.chatLogs) {
          this.$refs.chatLogs.scrollTop = this.$refs.chatLogs.scrollHeight
        }
      })
    },
    /**
     * 消息到达时
     */
    whenMsgArrived ({ msg: message, tim }) {
      _.map(message, m => {
        if (m.to == this.groupID) {
          return {
            diaUser: this.getPower(m.from).name,
            diaTime: moment(new Date(m.time * 1000)).format('YYYY-MM-DD HH:mm:ss'),
            diaContent: m.payload.text,
            direction: 'received'
          }
        }
      })
        .filter(m => m != undefined)
        .forEach(log => this.appendLog(log))
    },
    getPower (account) {
      return _.find(this.powers, p => p.account === account) || { mame: '系统消息' }
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-box {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .chat-logs {
    flex: 1;
    min-height: 0;
    padding: 15px;
    overflow: hidden;
    overflow-y: scroll;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      display: none;
    }
    .log {
      & + .log {
        margin-top: 2rem;
      }
      display: flex;
      &.sent {
        justify-content: end;
        flex-direction: row-reverse;
      }
      &.received {
      }
      .avatar {
        width: 3.6rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: text-bottom;
        > img {
          padding: 6px 6px 0px 6px;
        }
      }
      .msg {
        display: flex;
        flex-direction: column;
        .sender {
          color: #fff;
          font-size: 1rem;
          .name {
          }
          .time {
          }
        }
        .content {
          margin-top: 4px;
          color: #fff;
          border-radius: 1.5px;
          display: flex;
          &.sent {
            justify-content: flex-end;
          }
          &.received {
            justify-content: flex-start;
          }
          > span {
            display: inline-block;
            padding: 5px;
            font-size: 1.2rem;
            border-radius: 5px;
            &.received {
              color: #222222;
              background-color: #fff;
            }
            &.sent {
              color: #fff;
              background-color: #03b028;
            }
          }
        }
      }
    }
  }
  .chat-op-wrapper {
    height: 20rem;
    padding: 3px;
  }
}
</style>
