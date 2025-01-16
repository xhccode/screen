<template>
  <div class="bottom-section-wrap">
    <div class="item" :style="`background-image:url(${inactive})`" @click="$router.push('/party')">
      <div class="image" :style="`background-image:url(${item1})`"></div>
      <div class="text">党建引领</div>
    </div>
    <div class="item" :style="`background-image:url(${inactive})`" @click="$router.push('/power')">
      <div class="image" :style="`background-image:url(${item2})`"></div>
      <div class="text">城市运行</div>
    </div>
    <div class="item" :style="`background-image:url(${inactive})`">
      <div class="image" :style="`background-image:url(${item3})`"></div>
      <div class="text">政务服务</div>
    </div>
    <div class="item" :style="`background-image:url(${inactive})`">
      <div class="image" :style="`background-image:url(${item4})`"></div>
      <div class="text">基层治理</div>
    </div>
    <div class="item" :style="`background-image:url(${inactive})`">
      <div class="image" :style="`background-image:url(${item5})`"></div>
      <div class="text">公共安全</div>
    </div>
  </div>
</template>

<script>
import item1 from './item1.png'
import item2 from './item2.png'
import item3 from './item3.png'
import item4 from './item4.png'
import item5 from './item5.png'
import active from './active.png'
import inactive from './inactive.png'

export default {
  data () {
    return {
      item1,
      item2,
      item3,
      item4,
      item5,
      active,
      inactive
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-section-wrap {
  display: flex;
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 50%;
  margin-left: -32rem;
  .item {
    margin-left: 8px;
    margin-right: 8px;
    padding: 16px;
    cursor: pointer;
    background-size: cover;
    .image {
      width: 80px;
      height: 80px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .text {
      color: #fff;
      text-align: center;
      margin-top: 8px;
    }
  }
}
</style>
