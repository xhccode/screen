<template>
  <div class="video-content">
    <video
      ref="video"
      style="width: 100%; height: 100%; object-fit: cover"
      :src="sourceUrl || 'https://2.16.66.38:8092/video/centervideo/320205005000/320205005000.mp4'"
      preload="auto"
      @click="handleClick"
      @dblclick="handleFullscreenClick"
    />
    <div class="power-wrap">
      <img :src="play ? PauseIcon : PlayIcon" alt="播放" @click="handleClick" style="cursor: pointer; width: 16px; height: 16px" />
      <img :src="FullScreenIcon" alt="全屏" title="全屏" style="cursor: pointer; width: 16px; height: 16px" @click="handleFullscreenClick" />
    </div>
  </div>
</template>

<script>
import PlayIcon from '../image/play.png'
import PauseIcon from '../image/pause.png'
import FullScreenIcon from '../image/full-screen.png'
export default {
  props: {
    poster: {
      type: String,
      default: ''
    },
    sourceUrl: {
      type: String,
      default: 'https://2.16.66.38:8092/video/centervideo/320205005000/320205005000.mp4'
    }
  },
  data () {
    return {
      PlayIcon,
      PauseIcon,
      FullScreenIcon,
      play: false
    }
  },
  methods: {
    handleClick () {
      if (!this.play) {
        this.play = true
        this.$refs.video.play()
      } else {
        this.play = false
        this.$refs.video.pause()
      }
    },
    handleFullscreenClick () {
      this.$refs.video.requestFullscreen()
    }
  }
}
</script>

<style lang="scss" scoped>
.video-content {
  width: 100%;
  height: 100%;
  position: relative;
  .power-wrap {
    position: absolute;
    width: 100%;
    height: 2rem;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    box-sizing: border-box;
  }
  // .mask {
  //     position: absolute;
  //     width: 44px;
  //     height: 44px;
  //     top: 50%;
  //     left: 50%;
  //     margin-left: -22px;
  //     margin-top: -22px;
  // }
}
</style>
