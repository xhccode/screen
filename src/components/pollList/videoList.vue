<template>
  <xs-dialog :visible="visible" :title="title" width="80vw" height="80vh" :fullscreen="fullscreen" :minimize="minimize" :maximize="maximize" :close="closeDialog">
    <div class="dialog-wrap">
      <div class="search-box">
        <el-form :inline="true" :model="params" class="demo-form-inline">
          <el-form-item label="显示模式">
            <el-select v-model="params.model" placeholder="请选择">
              <el-option v-for="item in optionsModel" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示间隔">
            <el-select v-model="params.interval" placeholder="请选择">
              <el-option v-for="item in optionsInterval" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="循环播放">
            <el-radio-group v-model="params.loop">
              <el-radio :label="1" :value="1">是</el-radio>
              <el-radio :label="0" :value="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="播放时间">
            <el-time-picker is-range v-model="params.time" value-format="HH:mm:ss" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleOK">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div :class="`video-list video-list${playParams.model}`">
        <div class="video-item" v-for="(item, index) in playVideoList" :key="index">
          <CameraVideo1 :data="item" style="width: 100%; height: 100%;" :closable="false"></CameraVideo1>
        </div>
      </div>
    </div>
  </xs-dialog>
</template>

<script>
import windowOp from '@/components/command/windowOp.js'
import XsDialog from '@/components/Base/XsDialog.vue'
import CameraVideo1 from './CameraVideo1'
import * as utils from '@/utils'
export default {
  name: 'VideoListDialog',
  components: { XsDialog, CameraVideo1 },
  mixins: [windowOp],
  inject: {
    addWindow: { default: () => {} },
    removeWindow: { default: () => {} }
  },
  props: {
    pollInfo: {},
    pollParams: {}
  },
  data () {
    return {
      optionsModel: [
        { label: '9屏', value: 9 },
        { label: '4屏', value: 4 }
      ],
      optionsInterval: [
        { label: '10S', value: 10 },
        { label: '20S', value: 20 },
        { label: '30S', value: 30 }
      ],
      data: [],
      playVideoList: [],
      pageNo: 0,
      params: { model: 9, interval: 30, loop: 1 },
      playParams: {},
      timer: undefined
    }
  },
  mounted () {
    this.getPollDetail()
    if (this.pollParams) {
      // 自动弹开对话框时
      this.params = { ...this.pollParams }
      this.playParams = { ...this.pollParams }
      this.$bus.$emit(EVENT.POLL_START, this)
    } else {
      // 从轮询组列表打开对话框时
      let pollInfo = this.$store.state[STATE.POLL]
      if (pollInfo.pollInfo.id == this.pollInfo.id) {
        this.params = { ...pollInfo.pollParams }
        this.playParams = { ...pollInfo.pollParams }
      }
    }
  },
  methods: {
    getPollDetail () {
      API.command.getPollDetail(this.pollInfo.id).then(res => {
        if (res) {
          this.data = res.data.body.rotationDeviceVOList || []
          this.startPoll()
        }
      })
    },
    startPoll () {
      this.playParams = { ...this.params }
      this.playVideo()
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.pageNo < this.data.length / this.playParams.model - 1) {
          this.pageNo++
        } else {
          this.pageNo = 0
        }
        this.playVideo()
      }, this.playParams.interval * 1000)
    },
    playVideo () {
      let start = this.pageNo * this.playParams.model
      let end = (this.pageNo + 1) * this.playParams.model
      this.playVideoList = this.data.slice(start, end)
    },
    handleOK () {
      this.startPoll()
      if (this.params.time && this.params.time.length == 2) {
        this.$store.commit(STATE.POLL, { ...this.$store.state[STATE.POLL], pollInfo: this.pollInfo, pollParams: this.params })
        this.$bus.$emit(EVENT.POLL_START, this)
        this.$notify({
          title: '提示',
          message: '轮询开始，且轮询时间设置成功',
          type: 'success'
        })
      } else {
        this.$notify({
          title: '提示',
          message: '轮询开始',
          type: 'success'
        })
      }
    },
    closeDialog () {
      let now = new Date()
      let pollState = this.$store.state[STATE.POLL]
      // 轮询组有定时
      if (pollState.pollParams && pollState.pollParams.time && pollState.pollParams.time.length == 2) {
        // 关闭的是正在轮组的视频组
        if (pollState.pollInfo && this.pollInfo.id == pollState.pollInfo.id) {
          // 关闭的是正在轮组的视频组
          if (now >= utils.getCurDayTime(pollState.pollParams.time[0]) && now <= utils.getCurDayTime(pollState.pollParams.time[1])) {
            this.minimize()
          } else {
            this.close()
            // 关闭的是轮组结束的视频组
            this.$bus.$emit(EVENT.POLL_END)
          }
        } else {
          this.close()
        }
      } else {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  height: 86.75%;
  padding: 0;
  padding-bottom: 45px;
  margin: 10px 22px;

  .dialog-wrap {
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    .search-box {
      input {
        background-color: rgba(255, 255, 255, 0.4);
      }
      .el-input {
        width: 100%;
      }
      button:first-child {
        height: 100%;
        text-align: center;
        outline: none;
        border: none;
        max-width: 10rem;
        background: url('../../assets/img/common/button.png') no-repeat 0 0;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .video-list {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      align-content: flex-start;
      .video-item {
        border: 0.1rem solid #727272;
      }
      &.video-list9 .video-item {
        width: 33.3%;
        height: 33.33%;
      }
      &.video-list4 .video-item {
        width: 50%;
        height: 50%;
      }
    }
  }
}
</style>
