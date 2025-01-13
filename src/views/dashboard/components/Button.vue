<template>
  <div class="my-button-wrap" :style="`background-image:url(${active ? bgA : bg})`">
    <slot></slot>
  </div>
</template>

<script>
import bg from '../images/button-border.png'
import bgA from '../images/button-border-active.png'
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      bg,
      bgA
    }
  }
}
</script>

<style lang="scss" scoped>
.my-button-wrap {
  width: 150px;
  height: 100px;
  cursor: pointer;
  text-align: center;
  line-height: 100px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  font-size: 32px;
  font-weight: bold;
}
</style>
