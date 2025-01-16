<template>
  <div class="page-box">
    <main-map>
      <div class="locator-box">
        <map-locator @MAP_REGION_CHANGE="initData" />
      </div>
      <LeftSection :orgInfo="orgInfo"></LeftSection>
      <TopSection></TopSection>
      <RightSection></RightSection>
    </main-map>
  </div>
</template>

<script>
import MainMap from '@/components/Base/MainMap.vue'
import MapLocator from '@/components/Base/MapLocator.vue'
import Switchable from '@/views/common/Switchable'
import RightSection from './RightSection'
import TopSection from './TopSection'
import LeftSection from './LeftSection'
import STATE from '@/store/States'

export default {
  components: {
    MainMap,
    RightSection,
    TopSection,
    LeftSection,
    MapLocator
  },
  data () {
    return {
      orgInfo: this.$store.state[STATE.USER_ORG]
    }
  },
  mixins: [Switchable],
  methods: {
    initData (orgInfo) {
      // 下钻时更新相应的受理中心和实时数据
      this.$store.dispatch('getEventNumData', orgInfo)
      this.orgInfo = orgInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  .locator-box {
    position: fixed;
    top: 240px;
    width: 100%;
    z-index: 99;
    display: flex;
  }
  .header {
    position: absolute;
    top: 0;
    z-index: 1;
    height: 12rem !important;
  }
}
@media screen and (min-width: 4600px) {
  .page-box .locator-box {
    top: 320px;
  }
}
</style>
