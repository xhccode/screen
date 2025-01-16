<template>
  <div class="top-section-wrap" :style="`background-image:url(${bg})`">
    <div class="item" v-for="(item, idx) in topData" :key="idx">
      <div class="image" :style="`background-image:url(${collection})`"></div>
      <div class="info">
        <div class="number"><countTo :startVal="0" :endVal="item.ctotalNum" :duration="3000"></countTo></div>
        <div class="text">{{ item.ctype }}</div>
        <div class="text" v-if="item.cdayNum!=null">当日:<countTo :startVal="0" :endVal="item.cdayNum" :duration="3000"></countTo></div>
      </div>
    </div>
  </div>
</template>

<script>
import bg from './bg.png'
import collection from './collection.png'
import cases from './cases.png'
import information from './information.png'
import visit from './visit.png'
import countTo from 'vue-count-to'
import API from '@/api'

export default {
  components: { countTo },

  data () {
    return {
      bg,
      collection,
      cases,
      information,
      visit,
      topData: [
        {
          ctype: '总信息量',
          ctotalNum: 0,
          cdayNum: 0
        },
        {
          ctype: '信息采集',
          ctotalNum: 0,
          cdayNum: 0
        },
        {
          ctype: '走访服务',
          ctotalNum: 0,
          cdayNum: 0
        },
        {
          ctype: '事件处理',
          ctotalNum: 0,
          cdayNum: 0
        }
      ]
    }
  },
  methods: {
    updateNumber () {
      this.topData.handleNumberStart++
      this.topData.totalStart++
    },
    getRealTimeInfo () {
      let orgCode = this.$store.state.UserOrg.orgCode
      let areaLevel = this.$store.state.UserOrg.orgDepth
      API.dataHome.getRealTimeInfo({ orgCode: orgCode, areaLevel: areaLevel }).then(({ data }) => {
        if (data.code === 1) {
          let dataList = data.data
          if (dataList && dataList.length) {
            let tmp = dataList[dataList.length - 1]
            // 总信息量
            this.topData[0].ctotalNum = tmp.totalHis
            this.topData[0].cdayNum = tmp.totalNum

            // 信息采集
            this.topData[1].ctotalNum = tmp.pluckHis
            this.topData[1].cdayNum = tmp.pluckNum

            // 走访服务
            this.topData[2].ctotalNum = tmp.visitHis
            this.topData[2].cdayNum = tmp.visitNum

            // 事件处理
            this.topData[3].ctotalNum = tmp.handleHis
            this.topData[3].cdayNum = tmp.handleNum
            if (this.$store.state.UserInfo.orgCode === '320205005000') {
              this.topData[0].ctotalNum = 45888
              this.topData[0].cdayNum = null
              this.topData[1].ctotalNum = 12674
              this.topData[1].cdayNum = null
              this.topData[2].ctotalNum = 4167
              this.topData[2].cdayNum = null
              this.topData[3].ctotalNum = 4571
              this.topData[3].cdayNum = null
            }
          }
        } else {
          throw new Error(res.msg)
        }
      })
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      this.getRealTimeInfo()
    }, 30000)
    this.getRealTimeInfo()
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
.top-section-wrap {
  // height: 100px;
  padding: 10px;
  /* background-color: #333; */
  width: 80rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  position: absolute;
  top: 7rem;
  left: 50%;
  margin-left: -40rem;
  z-index: 1;
  .item {
    display: flex;
    align-items: center;
    .image {
      width: 72px;
      height: 72px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 8px;
    }
    .number {
      font-size: 24px;
      color: #fff;
      font-weight: bold;
    }
    .text {
      font-size: 1.4rem;
      color: #fff;
    }
  }
}
</style>
