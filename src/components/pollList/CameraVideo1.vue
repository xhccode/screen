<template>
  <div class="camera-video">
    <!-- 编号 -->
    <div class="camera-num" v-if="data.$$label">
      <span class="txt">{{ data.$$label }}</span>
    </div>
    <!-- 关闭 -->
    <el-tooltip title="关闭" class="close-box" effect="light" v-if="closable">
      <div class="close-box" @click="$emit('close', data)">
        <i class="el-icon-close"></i>
      </div>
    </el-tooltip>
    <!-- 播放器 -->
    <video ref="cameraVideo" class="video vjs-matrix video-js" :id="'camera-video' + data.deviceId" muted></video>
    <!-- 底部信息与操作 -->
    <div class="camera-foot">
      <!-- 详情 -->
      <el-tooltip effect="light" popper-class="x-a-tooltip--small" v-if="tooltip">
        <div class="video-trigger">
          <span class="txt">{{ data.name || data.address }}</span>
        </div>
        <div class="video-box" slot="content">
          <div class="ii">
            <span class="txt">监控名称：{{ data.name || data.address }}</span>
          </div>
          <div class="ii">
            <span class="txt">监控状态：{{ data.state }}</span>
          </div>
          <div class="ii">
            <span class="txt">监控业务来源：{{ data.sourceName }}</span>
          </div>
          <div class="ii">
            <span class="txt">监控点编号：{{ data.code }}</span>
          </div>
        </div>
      </el-tooltip>
      <div class="video-trigger" v-else>
        <span class="txt">{{ data.name || data.address }}</span>
      </div>
      <!-- 全屏 -->
      <el-tooltip content="全屏" class="op-wrapper" effect="light" @hover.native.stop.prevent="">
        <i class="iconfont icon-quanping" @click="fullScreen"></i>
      </el-tooltip>
    </div>
    <!-- 错误提示 -->
    <div class="error-tips" v-if="errorMsg">
      <div>{{ errorMsg }}</div>
    </div>
  </div>
</template>
<script>
import flvjs from 'flv.js'
// 引入视频资源
import videojs from 'video.js/dist/video.min'
import 'video.js/dist/video-js.min.css'

const options = {
  bigPlayButton: false,
  textTrackDisplay: false,
  posterImage: true,
  errorDisplay: false,
  controls: false,
  muted: false,
  children: {
    mediaLoader: {},
    loadingSpinner: {},
    resizeManager: {},
    controlBar: {
      fullscreenToggle: true
    }
  }
}
export default {
  name: 'CameraVideo1',
  props: {
    data: {
      type: Object,
      require: true
    },
    closable: {
      type: Boolean,
      default: () => true
    },
    tooltip: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      full: false,
      player: null,
      errorMsg: undefined
    }
  },
  mounted () {
    this.getLiveBroadcastUrlByMoniterId()
  },

  beforeDestroy () {
    try {
      if (this.player) {
        if (_.isFunction(this.player.dispose)) {
          this.player.dispose()
        } else {
          this.player.destroy()
        }
      }
    } catch (e) {
      LOG.warn(e)
    }
    LOG.warn('视频播放器销毁...')
  },
  methods: {
    getLiveBroadcastUrlByMoniterId () {
      API.command.getLiveBroadcastUrl(this.data.id).then(({ data: { success, message, body } }) => {
        if (success) {
          this.playVideo(body.liveUrl)
        } else {
          this.errorMsg = message
        }
      })
    },
    playVideo (liveUrl) {
      // 根据视频流类型使用不同的播放器
      // {"playType": 3}  .m3u8
      if (liveUrl.indexOf('.m3u8') > -1) {
        this.player = videojs(this.$refs.cameraVideo, options)
        this.player.src([{ src: liveUrl, type: 'application/x-mpegURL' }])
        this.player.play()
        LOG.warn('当前采用video-js播放器', liveUrl)
      } else {
        this.player = flvjs.createPlayer(
          { type: 'flv', cors: true, isLive: true, hasAudio: false, url: liveUrl },
          {
            showfullscreen: true,
            enableWorker: false,
            autoCleanupSourceBuffer: true, // 清理缓冲区
            enableStashBuffer: false,
            stashInitialSize: 128, // 减少首桢显示等待时长
            statisticsInfoReportInterval: 600,
            autoCleanupMaxBackwardDuration: 10,
            autoCleanupMinBackwardDuration: 10
          }
        )
        this.player.attachMediaElement(this.$refs.cameraVideo)
        this.player.load()
        LOG.warn('当前采用flvjs播放器', liveUrl)
      }
    },
    fullScreen () {
      LOG.warn('尝试全屏播放...')
      if (_.isFunction(this.$refs.cameraVideo.webkitRequestFullScreen)) {
        this.$refs.cameraVideo.webkitRequestFullScreen()
      } else if (_.isFunction(this.$refs.cameraVideo.msRequestFullscreen)) {
        this.$refs.cameraVideo.msRequestFullscreen()
      } else if (_.isFunction(this.$refs.cameraVideo.requestFullscreen)) {
        this.$refs.cameraVideo.requestFullscreen()
      } else {
        LOG.error('当前浏览器不支持播放器全屏')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.camera-video {
  height: 100%;
  width: 100%;
  position: relative;
  /deep/ .video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    video {
      width: 100%;
      height: 100%;
      position: relative;
      object-fit: cover;
    }
  }
  .error-tips {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }
  .camera-num {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 24px;
    height: 24px;
    z-index: 1;
    display: flex;
    .txt {
      margin: auto;
      color: #fff;
      font-size: 1.2rem;
    }
  }
  .close-box {
    display: block;
    position: absolute;
    z-index: 1;
    top: 5px;
    right: 5px;
    cursor: pointer;
    display: flex;
    i {
      margin: auto;
      color: #fff;
      font-size: 1.6rem;
      font-weight: bold;
    }
  }
  .camera-foot {
    position: absolute;
    bottom: 0px;
    left: 0;
    z-index: 2;
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: #fff;
  }
  .video-trigger {
    flex: 1;
    min-width: 0;
    display: flex;
    .txt {
      margin: auto 5px;
      font-size: 1.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .op-wrapper {
    margin: auto 5px;
    display: flex;
    cursor: pointer;
    .iconfont {
      font-size: 1.6rem;
      &::before {
        margin: auto 10px;
        &:hover {
          box-shadow: 0 0 5px #fff;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
