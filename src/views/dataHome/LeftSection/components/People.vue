<template>
  <div class="geography-wrap">
    <overview-title :icon="Icon" title="总人口" :value="data.cpopulationAll.toString()" unit="人"></overview-title>
    <div class="content">
      <div class="pie">
        <div ref="rose" class="rose"></div>
      </div>
      <div class="item info">
        <overview-title icon="#00FCFF" noIcon title="常住人口" :value="data.cpopulationResident.toString()" unit="人"></overview-title>
        <overview-title icon="#FF6600" noIcon title="流动人口" :value="data.cpopulationFlow.toString()" unit="人"></overview-title>
      </div>
    </div>
    <div class="footer">
      <div class="footer-item">
        <div class="footer-item-content">
          <span style="font-weight: bold; font-size: 1.4rem">{{ data.cpopulationForeigner }}</span
          ><span>人</span>
        </div>
        <div>境外人士</div>
      </div>
      <div class="footer-item">
        <div class="footer-item-content">
          <span style="font-weight: bold; font-size: 1.4rem">{{ data.cpopulationEmphasis }}</span
          ><span>人</span>
        </div>
        <div>重点人员</div>
      </div>
      <div class="footer-item">
        <div class="footer-item-content">
          <span style="font-weight: bold; font-size: 1.4rem">{{ data.cpopulationAsist }}</span
          ><span>人</span>
        </div>
        <div>帮扶对象</div>
      </div>
    </div>
  </div>
</template>

<script>
import { init } from 'echarts'
import OverviewTitle from './OverviewTitle'
import Icon from '../image/people.png'

export default {
  components: { OverviewTitle },
  props: {
    data: undefined
  },
  data () {
    return {
      Icon
    }
  },
  methods: {
    initCharts () {
      let myCharts = init(this.$refs.rose)
      myCharts.setOption({
        color: ['#1EC4FF', '#F99C0F', '#ff7c5a'],
        legend: {
          show: false
        },
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
            data: [
              { value: this.data.cpopulationResident, name: '常住人口' },
              { value: this.data.cpopulationFlow, name: '流动人口' }
            ]
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
    height: calc(100% - 5.83rem);
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
  .footer {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .footer-item {
      min-width: 100px;
      height: 100%;
      color: #fff;
      font-size: 10px;
      text-align: center;
      .footer-item-content {
        padding: 0 10px;
        box-sizing: border-box;
        background-color: rgba(14, 178, 255, 0.2);
        border-bottom: 1px solid #0eb2ff;
        border-top: 1px solid #0eb2ff;
      }
    }
  }
}
</style>
