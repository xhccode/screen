<template>
  <div class="geography-wrap">
    <overview-title :icon="Icon" title="总房屋数" :value="total.toString()" unit="套"></overview-title>
    <div class="content">
      <div class="pie">
        <div ref="rose" class="rose"></div>
      </div>
      <div class="item info">
        <overview-title icon="#00FCFF" noIcon title="普通住宅" :value="common" unit="套"></overview-title>
        <overview-title icon="#43EA80" noIcon title="出租房" :value="rental" unit="套"></overview-title>
        <overview-title icon="#FF6600" noIcon title="群租房" :value="group" unit="套"></overview-title>
        <overview-title icon="#FF0048" noIcon title="空置房" :value="empty" unit="套"></overview-title>
        <overview-title icon="#FF0048" noIcon title="其它" :value="others" unit="套"></overview-title>
      </div>
    </div>
  </div>
</template>

<script>
import { init } from 'echarts'
import OverviewTitle from './OverviewTitle'
import Icon from '../image/house.png'

export default {
  components: { OverviewTitle },
  props: { data: undefined },
  data () {
    return {
      Icon,
      common: this.data.croomCommon,
      rental: this.data.croomRent,
      group: this.data.croomGroup,
      empty: this.data.croomVacant,
      others: this.data.croomOthers,
      total: this.data.croomAll
    }
  },
  methods: {
    initCharts () {
      let myCharts = init(this.$refs.rose)
      myCharts.setOption({
        color: ['#1EC4FF', '#3cf3b7', '#F99C0F', '#ff7c5a'],
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
            radius: [30, 40],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              show: true,
              position: 'outside',
              color: '#fff'
            },
            lineLabel: {
              length: 5,
              length2: 10
            },
            data: [
              { value: this.common, name: '普通住宅', color: '#1EC4FF' },
              { value: this.rental, name: '出租房', color: '#FF6600' },
              { value: this.group, name: '群租房', color: '#F99C0F' },
              { value: this.empty, name: '空置房', color: '#4FACFE' },
              { value: this.others, name: '其它', color: '#00F2FE' }
            ]
          }
        ]
      })
    }
  },
  mounted () {
    // this.common = data[5].num
    // this.rental = data[3].num
    // this.group = data[4].num
    // this.empty = data[0].num
    // this.others = data[2].num
    // this.total = data[1].num
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
      width: 60%;
      height: 100%;
      .rose {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      width: 40%;
      & > div {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
