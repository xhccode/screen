<template>
  <div class="passive-box-wrap">
    <div class="title-box" :style="`background-image:url(${passiveBg})`">
      被动受理
    </div>
    <div class="info-box passive-info-box">
      <div class="number">{{ num.passiveAcceptanceNum }}</div>
      <div class="info" v-if="$store.state.UserInfo.orgCode!='320205005000'">
        对比上月：{{ num.passiveAcceptanceCompared }}
        <div :style="`background-image:url(${num.passiveAcceptanceCompared >= 0 ? arrow_up : arrow_down})`"></div>
      </div>
    </div>
    <div class="detail-wrap">
      <div class="row">
        <div class="item-left">
          <div class="number">{{ num.oneHotLineNum }}</div>
          <div class="text">12345热线</div>
        </div>
        <div class="item-right">
          <div class="number">{{ num.nonPoliceNum }}</div>
          <div class="text">110非警务</div>
        </div>
      </div>
      <div class="row">
        <div class="item-left">
          <div class="number">{{ num.districtCenterNum }}</div>
          <div class="text">区中心热线</div>
        </div>
        <div class="item-right">
          <div class="number">{{ num.sevenHotLineNum }}</div>
          <div class="text">71580热线</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import passiveBg from '../image/passive.png'
// eslint-disable-next-line camelcase
import arrow_down from '../image/arrow_down.png'
import arrow_up from '../image/arrow_up.png'

export default {
  props: ['num'],
  data () {
    return {
      passiveBg,
      arrow_down,
      arrow_up
    }
  },
  methods: {
    updateNumber: function () {
      this.startData++
    }
  }
}
</script>

<style lang="scss" scoped>
.passive-box-wrap {
  .title-box {
    font-size: 2rem;
    color: #fff;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 100% 100%;
  }
  .info-box {
    background-color: rgba(14, 178, 255, 0.2);
    border: 1px solid #0eb2ff;
    border-left-width: 0;
    border-right-width: 0;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 6px;
    padding-bottom: 6px;
    .number {
      color: #fff;
      font-size: 2rem;
      font-weight: bold;
      margin-left: 0.5em;
      line-height: 1;
    }
    .info {
      font-size: 1.2rem;
      color: #fff;
      display: flex;
      align-items: center;
      div {
        height: 2rem;
        width: 2rem;
        margin-left: 3px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
  .detail-wrap {
    .row {
      display: flex;
      justify-content: space-between;
      padding-top: 8px;
      padding-bottom: 8px;
      .item-right {
        // width: 80px;
      }
      .number {
        color: #0eb2ff;
        font-size: 1.3rem;
        font-weight: bold;
        text-align: center;
      }
      .text {
        color: #fff;
        font-size: 1.4rem;
        text-align: center;
      }
    }
  }
}
</style>
