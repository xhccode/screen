<template>
  <div class="automic-box-wrap">
    <div class="title-box" :style="`background-image:url(${automicBg})`">
      自动预警
    </div>
    <div class="row">
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          {{ num.sanitationNum }}
        </div>
        <div class="text">环保</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          {{ num.urbanManagementNum }}
        </div>
        <div class="text">城管</div>
      </div>
    </div>
    <div class="row">
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          {{ num.emergencyNum }}
        </div>
        <div class="text">应急</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          {{ num.comprehensiveNum }}
        </div>
        <div class="text">综治网格</div>
      </div>
    </div>
  </div>
</template>

<script>
import automicBg from '../image/automic.png'
import boxBg from './automic-box.png'

export default {
  props: ['num'],
  data () {
    return {
      automicBg,
      boxBg
    }
  }
}
</script>

<style lang="scss" scoped>
.automic-box-wrap {
  .title-box {
    font-size: 2rem;
    color: #fff;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 100% 100%;
    margin-bottom: 8px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    .item {
      min-width: 9rem;
      .box {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 2rem;
        font-weight: bold;
        background-size: 100% 100%;
      }
      .text {
        color: #fff;
        font-size: 1.4rem;
        text-align: center;
        padding-top: 8px;
        padding-bottom: 8px;
      }
    }
  }
}
</style>
