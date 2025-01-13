<template>
  <xs-dialog :title="title" :visible="visible" :fullscreen="fullscreen" :minimize="minimize" :maximize="maximize" :width="width" :height="height" :close="close">
    <el-form ref="form" :model="formData" :rules="rules" class="dialog-form" label-width="8rem">
      <el-form-item prop="receivers" label="收信人">
        <el-input disabled v-model="formData.receivers"></el-input>
      </el-form-item>
      <el-form-item prop="smsTemplate" label="短信模板">
        <el-select v-model="formData.smsTemplate" placeholder="请选择模板">
          <el-option :value="1" label="通知类"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="smsContent" label="短信内容">
        <el-input type="textarea" :rows="4" v-model="formData.smsContent" placeholder="请输入短信内容"></el-input>
      </el-form-item>
      <el-form-item prop="senderInfo" label="发送方">
        <el-input disabled v-model="formData.senderInfo"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <div class="btn-box">
          <el-button type="primary" icon="el-icon-circle-check" @click="sendShortMsg()">发送</el-button>
        </div>
      </el-form-item>
    </el-form>
  </xs-dialog>
</template>

<script>
import XsDialog from '@/components/Base/XsDialog.vue'
import windowOp from '@/components/command/windowOp.js'
export default {
  name: 'orderDialog',
  props: { powers: { type: Array, required: true } },
  components: { XsDialog },
  mixins: [windowOp],
  data () {
    return {
      formData: {
        smsContent: '',
        receivers: '',
        senderInfo: '',
        sender: '',
        smsTemplate: 1
      },
      rules: {
        smsContent: { required: true, message: '请输入短信内容', trigger: 'blur' }
      }
    }
  },
  created () {
    this.initFormData()
  },
  methods: {
    initFormData () {
      this.formData.receivers = this.powers
        .map(item => {
          return item.userName + item.phone
        })
        .join(';')
      this.formData.senderInfo = `${this.$store.state.UserInfo.orgName}-${this.$store.state.UserInfo.realName}`
    },
    sendShortMsg () {
      this.$refs.form.validate(valid => {
        if (valid !== true) {
          return
        }
        API.command
          .sendShortMsg({
            addressee: this.formData.receivers,
            sender: this.$store.state.UserInfo.realName,
            senderCompany: this.$store.state.UserInfo.orgName + '联动指挥',
            smsContent: this.formData.smsContent,
            smsTemplate: '通知类'
          })
          .then(res => {
            if (res.data.code !== 200) {
              return this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
            let success = []
            let fail = []
            res.data.data.map((item, idx) => {
              if (item.code === 200) {
                success.push(item)
              } else {
                fail.push(item)
              }
            })
            this.$notify({
              title: '提示',
              message: success.length + '个人发送成功，' + (fail.length > 0 ? fail.length + '个人发送失败' : ''),
              type: success.length > 0 ? 'success' : 'warning'
            })
            this.close()
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-form {
  height: 100%;
  width: 100%;
  padding: 0 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-select {
    width: 100%;
  }
  .btn-box {
    width: 100%;
    display: flex;
    .el-button {
      margin: auto;
    }
  }
}
</style>
