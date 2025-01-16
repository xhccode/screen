<template>
  <div class="overview-wrap">
    <radio-group :value="active" @change="radioChange">
      <radio value="geo">地理</radio>
      <radio value="people">人口</radio>
      <radio value="house">房屋</radio>
      <radio value="unit">单位</radio>
      <radio value="economic">经济</radio>
    </radio-group>
    <div class="charts-wrap">
      <geography v-if="active === 'geo' && dataGeo" :data="dataGeo" />
      <people v-if="active === 'people'" :data="dataPeople" />
      <house v-if="active === 'house'" :data="dataHouse" />
      <unit v-if="active === 'unit'" :data="dataUnit" />
      <economic v-if="active === 'economic'" :data="dataEconomic" />
    </div>
  </div>
</template>

<script>
import RadioGroup from './components/RadioGroup'
import Radio from './components/Radio'
import Geography from './components/Geography'
import People from './components/People'
import House from './components/House'
import Unit from './components/Unit'
import Economic from './components/Economic'
import API from '@/api'
import STATE from '@/store/States'
export default {
  components: { RadioGroup, Radio, Geography, People, House, Unit, Economic },
  data () {
    return {
      active: 'geo',
      dataGeo: undefined,
      dataPeople: undefined,
      dataHouse: undefined,
      dataUnit: undefined,
      dataEconomic: undefined
    }
  },
  props: {
    orgInfo: undefined
  },
  watch: {
    orgInfo (newV, oldV) {
      if (newV && oldV && newV.orgCode !== oldV.orgCode) {
        this.getAreaBasenfo(newV)
      }
    }
  },
  mounted () {
    this.getAreaBasenfo()
  },
  methods: {
    radioChange (value) {
      this.active = value
    },
    getAreaBasenfo (orgInfo = {}) {
      let orgCode = orgInfo.orgCode || this.$store.state[STATE.USER_ORG].orgCode
      let areaLevel = orgInfo.orgDepth || this.$store.state[STATE.USER_ORG].orgDepth
      API.dataHome.getAreaBasenfo({ orgCode, areaLevel }).then(res => {
        if (res && res.status === 200) {
          this.dataGeo = res.data.data.geographyData
          this.dataPeople = res.data.data.cpopulationData
          this.dataHouse = res.data.data.croomData
          this.dataUnit = res.data.data.centerpriseData
          this.dataEconomic = res.data.data.ceconomicData
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-wrap {
  width: 100%;
  margin: 10px 0;
  .charts-wrap {
    width: 100%;
    height: 240px;
    box-sizing: border-box;
    margin-top: 10px;
  }
}
</style>
