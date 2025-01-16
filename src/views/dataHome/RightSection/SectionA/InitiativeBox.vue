<template>
  <div class="passive-box-wrap">
    <div class="title-box" :style="`background-image:url(${initiativeBg})`">
      主动报送
    </div>
    <div class="info-box initiative-info-box">
      <div class="number">{{ num.voluntarilyNum }}</div>
      <div class="info" v-if="$store.state.UserInfo.orgCode!='320205005000'">
        对比上月：{{ num.voluntarilyCompared }}
        <div :style="`background-image:url(${num.voluntarilyCompared >= 0 ? arrow_up : arrow_down})`"></div>
      </div>
    </div>
    <div class="detail-wrap">
      <div class="row">
        <div class="item-left">
          <div class="number">{{ num.gridNum }}</div>
          <div class="text">网格报送</div>
        </div>
        <div class="item-right">
          <div class="number">{{ num.districtUrbanManagementNum }}</div>
          <div class="text">区城管报送</div>
        </div>
      </div>
      <div class="row">
        <div class="item-left">
          <div class="number">{{ num.cellNum }}</div>
          <div class="text">管理单元格报送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import initiativeBg from '../image/initiative.png'
// eslint-disable-next-line camelcase
import arrow_up from '../image/arrow_up.png'
import arrow_down from '../image/arrow_down.png'

export default {
  props: ['num'],
  data () {
    return {
      initiativeBg,
      arrow_up,
      arrow_down
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
    border-color: #0eb2ff;
    background-color: rgba(14, 178, 255, 0.2);
    border-style: solid;
    border-top-width: 1px;
    border-bottom-width: 1px;
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
      line-height: 1;
      font-weight: bold;
      margin-left: 0.5em;
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
      justify-content: space-around;
      // justify-content: space-between;
      padding-top: 8px;
      padding-bottom: 8px;
      .item-right {
        // width: 80px;
      }
      .number {
        color: #69ffe6;
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
