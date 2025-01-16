<template>
  <div class="chartUnit">
    <div class="chartBox" ref="chart"></div>
    <div class="label">
      <span class="txt">{{ name }}总数</span>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
let color = ['#1EC4FF', '#F99C0F', '#ff7c5a']
export default {
  name: 'ChatFaces',
  props: ['unitType'],
  watch: {
    unitType: {
      deep: true,
      handler (v) {
        this.init()
      }
    }
  },
  data () {
    return { name: undefined }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.name = this.unitType.unitType === '3' ? '事件' : '单位'
      this.initChart()
    },
    initChart () {
      let myCharts = echarts.init(this.$refs.chart)
      myCharts.setOption(
        {
          color: color[Number(this.unitType.unitType) - 1],
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
              name: this.name,
              type: 'pie',
              radius: ['50%', '80%'],
              label: {
                show: true,
                position: 'center',
                textStyle: {
                  fontSize: 20,
                  color: '#fff',
                  fontWeight: 500
                },
                formatter: () => {
                  return this.unitType.total
                }
              },
              data: [{ value: this.unitType.total, name: '总数' }]
            }
          ]
        },
        true
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.chartUnit {
  width: 10rem;
  box-shadow: 0 0 0.5rem #fff;
  color: #fff;
  .chartBox {
    height: 10rem;
  }
  .label {
    height: 2.8rem;
    line-height: 2.8rem;
    display: flex;
    .txt {
      margin: auto;
      font-size: 1.4rem;
    }
  }
}
</style>
