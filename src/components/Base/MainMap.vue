<template>
  <div class="map-box">
    <div class="geo-map" ref="GeoMap" :class="skin" id="geo-map" />
    <slot></slot>
    <!-- 圈选尺寸设置 -->
    <div class="circle-radius">
      <el-slider v-if="holder" v-model="radis" :step="100" :min="300" :max="2000" tooltip-class="xs-el-tooltip--light" :marks="marks" @change="circleScopeChange"> </el-slider>
    </div>
  </div>
</template>
<script>
// import MapInitializer from './MapInitializer'
// import MapOp from './MapOp'
import EVENT from '@/utils/Events'
export default {
  // mixins: [MapOp, MapInitializer],
  data () {
    return {
      radis: 500,
      holder: undefined, // 当前地图上圆圈
      skin: 'dark'
    }
  },
  computed: {
    marks () {
      return { 300: '300', 500: '500', 700: '700', 1000: '1000', 1500: '1500', 2000: '2000' }
    }
  },
  created () {
    this.$bus.$on(EVENT.MAP_CIRCLE_CHANGED, this.storeCircleReference)
  },
  beforeDestroy () {
    this.$bus.$off(EVENT.MAP_CIRCLE_CHANGED, this.storeCircleReference)
  },
  methods: {
    // 记录circle
    storeCircleReference (e) {
      let { circle, data, options, type } = e
      if (type === EVENT.MAP_CIRCLE_REMOVED) {
        this.holder = undefined
      } else {
        this.holder = e
      }
    },
    // 圈选范围变化时
    circleScopeChange () {
      let { circle, data, options } = this.holder
      // this.circleSelect(data, this.radis / 1000, options)
    }
  }
}
</script>
<style scoped lang="scss">
.map-box {
  width: 100%;
  height: 100%;
  position: relative;
  .geo-map {
    width: 100%;
    height: 100%;
    z-index: 1;
    background: #001e2e;
  }
  .circle-radius {
    position: absolute;
    top: 12rem;
    left: calc(50% - 17.5rem);
    width: 35rem;
    z-index: 5;
    /deep/ .el-slider__runway {
      background: #0d869c;
      .el-slider__bar {
        background: #8ec239;
      }
      .el-slider__button {
        background: #19dcbc;
        border-color: #8ec239;
      }
      .el-slider__marks {
        .el-slider__marks-text {
          color: #fff;
        }
      }
    }
  }
}
</style>
<style lang="scss">
@import '~@/assets/style/map.scss';
</style>
