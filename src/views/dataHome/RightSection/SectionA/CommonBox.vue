<template>
  <div class="common-box-wrap">
    <div class="title-box" :style="`background-image:url(${commonBg})`">
      百姓共建
    </div>
    <div class="row">
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          {{ num.publicNUm }}
        </div>
        <div class="text">公众号上报</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          {{ num.otherNum }}
        </div>
        <div class="text">其他</div>
      </div>
    </div>
  </div>
</template>

<script>
import commonBg from '../image/common.png'
import boxBg from './common-box.png'
export default {
  props: ['num'],
  data () {
    return {
      commonBg,
      boxBg
    }
  }
}
</script>

<style lang="scss" scoped>
.common-box-wrap {
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
      min-width: 89px;
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
