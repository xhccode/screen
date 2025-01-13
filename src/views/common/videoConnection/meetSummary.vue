<template>
  <div class="diandiao-summary">
    <div class="diandiao-tit xs-bg-linear-gradient">
      <span class="txt">点调纪要</span>
    </div>
    <div class="diandiao-form">
      <el-form size="mini" :model="form">
        <el-form-item label="点调主题" prop="topic">
          <el-input v-model="form.topic" placeholder="请输入点调主题"></el-input>
        </el-form-item>
        <el-form-item label="发起方" prop="initiatorName">
          <el-input size="mini" disabled v-model="form.initiatorName" placeholder="发起方"></el-input>
        </el-form-item>
        <el-form-item label="接收方" prop="recipientName">
          <el-input size="mini" disabled v-model="form.recipientName" placeholder="接收方"></el-input>
        </el-form-item>
        <el-form-item label="发起时间" prop="startTime">
          <el-input disabled v-model="form.startTime" placeholder="发起时间"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="4" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'MeetSummary',
  data () {
    return {
      form: {
        topic: moment(new Date()).format('YYYY-MM-DD') + '点调',
        initiatorUserId: '',
        initiatorCode: '',
        initiatorName: '',
        recipientUserId: '',
        recipientName: '',
        recipientCode: '',
        startTime: moment(new Date()).format('YYYY-MM-DD'),
        summary: '',
        state: undefined
      }
    }
  },
  computed: {
    isInviter () {
      return this.$store.state[STATE.IS_INVITER]
    }
  },
  mounted () {
    let loginInfo = this.$store.state[STATE.USER_INFO]
    let otherInfo = this.$store.state[STATE.GROUP_MEMBERS].filter(item => item.account != this.$store.state[STATE.USER_INFO].account)[0] || {}
    if (this.isInviter) {
      // 主叫
      this.form = {
        ...this.form,
        dpInitiatorUserId: loginInfo.account,
        initiatorCode: loginInfo.orgCode,
        initiatorName: `${loginInfo.orgName}-${loginInfo.name}`,
        dpRecipientUserId: otherInfo.account,
        recipientName: `${otherInfo.orgName}-${otherInfo.name}`,
        recipientCode: otherInfo.orgCode
      }
    } else {
      // 被叫
      this.form = {
        ...this.form,
        dpInitiatorUserId: otherInfo.account,
        initiatorCode: otherInfo.orgCode,
        sponsorName: `${otherInfo.orgName}-${otherInfo.name}`,
        dpRecipientUserId: loginInfo.account,
        receiveName: `${loginInfo.orgName}-${loginInfo.name}`,
        recipientCode: loginInfo.orgCode,
        state: 1
      }
    }
    this.$bus.$on(EVENT.RTC_USER_ENTER, this.handleTRTCUserEnter)
  },
  methods: {
    handleTRTCUserEnter () {
      this.form.state = 1
    },
    // 保存纪要
    saveRecord () {
      if (this.form.state === undefined) {
        return
      }
      API.command
        .addCentral({
          ...this.form,
          startTime: this.form.startTime.length > 12 ? this.form.startTime + ':00' : this.form.startTime
        })
        .then(res => {
          if (res) {
            if (!res.data.success) {
              this.$notify({
                type: 'warning',
                message: res.data.message
              })
            }
          } else {
            this.$notify({
              type: 'warning',
              message: '点调记录保存失败'
            })
          }
        })
    },
    callStart () {
      this.form.startTime = moment(new Date()).format('YYYY-MM-DD HH:mm')
      this.form.state = 0
    }
  },
  beforeDestroy () {
    this.$bus.$off(EVENT.RTC_USER_ENTER, this.handleTRTCUserEnter)
    this.saveRecord()
  }
}
</script>
<style lang="scss" scoped>
.diandiao-summary {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  flex-direction: column;
  .diandiao-tit {
    line-height: 3.2rem;
    display: flex;
    .txt {
      margin: auto 5px;
    }
  }
  .diandiao-form {
    flex: 1;
    min-height: 0;
    .el-form {
      height: 100%;
      width: 100%;
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      .el-form-item {
        width: 100%;
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
        display: flex;
        /deep/ .el-form-item__label {
          padding: 0;
          width: 7rem;
          color: #fff;
          &::after {
            content: ':';
          }
        }
        /deep/ .el-form-item__content {
          flex: 1;
          min-width: 0;
          padding: 0 10px;
          .el-input__prefix {
            display: none;
          }
          .el-date-editor {
            height: 100%;
            width: 100%;
            .el-icon-time {
              width: 2.5rem;
            }
          }
          .el-input__inner,
          .el-textarea__inner {
            border-radius: 0 !important;
            padding: 5px !important;
          }
        }
      }
    }
  }
}
</style>
