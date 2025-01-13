<template>
  <div class="my-circle-power-wrap" :style="`background-image:url(${highLight ? bgH : bg});font-size:${highLight ? '30px' : '26px'}`">
    {{ text }}
  </div>
</template>

<script>
import bg from '../images/bottom-bg1.png'
import bgH from '../images/bottom-bg2.png'
export default {
  props: {
    highLight: Boolean,
    text: String
  },
  data () {
    return {
      bg,
      bgH
    }
  }
}
</script>

<style lang="scss" scoped>
.my-circle-power-wrap {
  width: 210px;
  height: 155px;
  cursor: pointer;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  // font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 40px;
}
</style>
