<template>
  <div class="geography-wrap">
    <overview-title :icon="Icon" title="总面积" :value="data.areaAll.toString()" unit="平方公里"></overview-title>
    <div class="content">
      <div class="pie">
        <div ref="rose" class="rose"></div>
      </div>
      <div class="item info">
        <overview-title icon="#4FACFE" noIcon title="总面积" :value="data.areaAll.toString()" unit="平方公里"></overview-title>
        <!-- <overview-title icon="#FF6600" noIcon title="中心城区" value="13.4" unit="平方公里"></overview-title>
        <overview-title icon="#DB2E2E" noIcon title="规划区" value="3.2" unit="平方公里"></overview-title> -->
      </div>
    </div>
  </div>
</template>

<script>
import { init } from 'echarts'
import OverviewTitle from './OverviewTitle'
import Icon from '../image/area.png'
export default {
  components: { OverviewTitle },
  props: { data: undefined },
  data () {
    return {
      Icon
    }
  },
  methods: {
    initCharts () {
      let myCharts = init(this.$refs.rose)
      let _this = this
      myCharts.setOption({
        legend: {
          show: false
        },
        color: ['#1EC4FF', '#F99C0F', '#ff7c5a'],
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [20, 60],
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              show: true,
              position: 'inside',
              color: '#fff'
            },
            data: [{ value: _this.data.areaAll, name: '总面积' }]
          }
        ]
      })
    }
  },
  mounted () {
    this.initCharts()
  }
}
</script>

<style lang="scss" scoped>
.geography-wrap {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: calc(100% - 30px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .pie {
      width: 57%;
      height: 100%;
      .rose {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      width: 43%;
      & > div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
