<template>
  <div class="impression-wrap">
    <div class="video-wrap">
      <vue-video :autoplay="false" :sourceUrl="areaIntroductionVideo" />
    </div>
    <div class="info-wrap">
      <el-tooltip popper-class="area-content" :content="areaContent">
        <div class="info">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ areaContent }}</div>
      </el-tooltip>
      <div class="echarts">
        <word-cloud :worddata="areaKeyList" />
      </div>
    </div>
  </div>
</template>

<script>
import VueVideo from './components/Video'
import WordCloud from './components/WordCloud'
import API from '@/api'
import STATE from '@/store/States'
export default {
  components: { VueVideo, WordCloud },
  data () {
    return {
      areaContent: '在“厚德崇实、创新奋进”的厚桥精神引领下，街道城镇化有序推进，城乡面貌日新月异，生态环境全面改善，各项社会事业蓬勃发展，“幸福厚桥”建设成效不断凸显。',
      areaKeyList: [],
      areaIntroductionVideo: ''
    }
  },
  mounted () {
    this.getAreaIntroduction()
  },
  methods: {
    getAreaIntroduction () {
      API.dataHome
        .getAreaIntroduction({
          orgCode: this.$store.state[STATE.USER_ORG].orgCode,
          areaLevel: this.$store.state[STATE.USER_ORG].orgDepth,
          state: 1
        })
        .then(res => {
          this.areaContent = res.data.data.areaContent
          this.areaKeyList = res.data.data.areaKeyList
          this.areaIntroductionVideo = res.data.data.areaIntroductionVideo
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.impression-wrap {
  width: 100%;
  height: 260px;
  border: 1px solid #0eb2ff;
  margin: 0 0 10px 0;
  .video-wrap {
    height: 55%;
    width: 100%;
  }
  .info-wrap {
    height: 45%;
    width: 100%;
    background-color: rgba(14, 178, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .info {
      width: 65%;
      height: 100%;
      font-size: 1.4rem;
      font-weight: bold;
      color: #fff;
      padding: 10px;
      box-sizing: border-box;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.9;
    }
    .echarts {
      width: 35%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.area-content {
  max-width: 50rem;
}
</style>
