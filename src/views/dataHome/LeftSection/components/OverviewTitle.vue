<template>
  <div class="overview-title-wrap flex">
    <div class="left flex">
      <span v-if="noIcon" class="circle" :style="{ backgroundColor: icon }"></span>
      <img v-else :src="icon" style="width: 18px; margin-right: 6px" />
      <span>{{ title }}</span>
    </div>
    <div class="right flex">
      <span class="big-font">{{ value }}</span>
      <span>{{ unit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    value: String,
    unit: String,
    noIcon: Boolean
  }
}
</script>

<style lang="scss" scoped>
.overview-title-wrap {
  width: 100%;
  justify-content: space-between;
  color: #fff;
  font-size: 1.2rem;
  box-sizing: border-box;
  padding: 0 5px;
  background-color: rgba(14, 178, 255, 0.2);
  border-bottom: 1px solid #0eb2ff;
  .left {
    .circle {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 4px;
    }
  }
  .right {
    .big-font {
      font-size: 18px;
      font-weight: bold;
      margin-right: 4px;
    }
  }
}
.flex {
  display: flex;
  align-items: center;
}
</style>
