<template>
  <div class="assess-wrap">
    <div ref="radar" class="assessment-wrap" />
    <div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);color: white;font-weight: bolder;font-size: 24px;">{{ Zycfz }}</div>
  </div>
</template>

<script>
import { init } from 'echarts'
import API from '@/store/States'
export default {
  data () {
    return {
      ZYCFZ: ''
    }
  },
  props: {
    orgInfo: undefined
  },
  computed: {
    Zycfz () {
      const expecttotal = Number(this.ZYCFZ.expecttotal)
      const predicttotal = Number(this.ZYCFZ.predicttotal)
      let sum = null
      try {
        sum = `${((predicttotal / expecttotal) * 100).toFixed(2)}分`
      } catch (error) {
        sum = '0分'
      }
      return sum
    }
  },
  watch: {
    orgInfo (newV, oldV) {
      if (newV && oldV && newV.orgCode !== oldV.orgCode) {
        this.initCharts(newV)
      }
    }
  },
  methods: {
    initCharts (orgInfo = {}) {
      if(!orgInfo?.orgCode) return
      API.dataHome.getExpectScore({ orgCode: orgInfo?.orgCode, dMonth: new Date().getMonth() + 1 }).then(res => {
        let indicators = []
        res.data.data.forEach(item => {
          if (item.bigtypname !== 'ZYCFZ') {
            indicators.push({ text: item.bigtype, max: 100, value: ((item.predicttotal / item.expecttotal) * 100).toFixed(1) })
          } else {
            this.ZYCFZ = item
            console.log('INFO:RES', item)
          }
        })
        let myCharts = init(this.$refs.radar)
        myCharts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            top: 'middle'
          },
          radar: [
            {
              indicator: indicators,
              radius: 80,
              nameGap: 15,
              name: {
                color: '#fff',
                formatter: function (value, indicator) {
                  return `${value} ${indicator.value}`
                }
              },
              textStyle: {
                fontSize: 16
              },
              axisLine: {
                lineStyle: {
                  color: '#0eb2ff'
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              splitArea: {
                show: false
              },
              center: ['50%', '50%']
            }
          ],
          series: [
            {
              type: 'radar',
              symbol: 'none',
              itemStyle: {
                type: 'linear',
                color: 'rgba(0, 170, 255,0.25)'
              },
              areaStyle: {
                color: 'rgba(0, 170, 255,0.2)'
              },
              data: [
                {
                  value: [95, 95, 95, 95, 95, 95, 95]
                }
              ]
            },
            {
              type: 'radar',
              symbol: 'none',
              itemStyle: {
                type: 'linear',
                color: 'rgba(0, 170, 255,0.4)'
              },
              areaStyle: {
                color: 'rgba(0, 170, 255,0.35)'
              },
              data: [
                {
                  value: [70, 70, 70, 70, 70, 70, 70]
                }
              ]
            },
            {
              type: 'radar',
              symbol: 'none',
              itemStyle: {
                type: 'linear',
                color: 'rgba(0, 170, 255,0.55)'
              },
              areaStyle: {
                color: 'rgba(0, 170, 255,0.5)'
              },
              data: [
                {
                  value: [45, 45, 45, 45, 45, 45, 45]
                }
              ]
            },
            {
              type: 'radar',
              symbol: 'none',
              itemStyle: {
                type: 'linear',
                color: 'rgba(0, 170, 255,0.7)'
              },
              areaStyle: {
                color: 'rgba(0, 170, 255,0.65)'
              },
              data: [
                {
                  value: [20, 20, 20, 20, 20, 20, 20]
                }
              ]
            },
            {
              type: 'radar',
              tooltip: {
                trigger: 'item',
                formatter: value => {
                  return (
                    value.name +
                    '</br>' +
                    indicators
                      .map(item => {
                        return `${item.text} ${item.value}: ${item.max}`
                      })
                      .join('</br>')
                  )
                }
              },
              itemStyle: {
                type: 'linear',
                color: '#cffff8'
              },
              areaStyle: {
                color: '#68c7b9'
              },
              data: [
                {
                  value: indicators.map(item => item.value),
                  name: '全省“高质量发展”考核（模拟监测）'
                }
              ]
            }
          ]
        })
      })
    }
  },
  mounted () {
    this.initCharts()
  }
}
</script>

<style lang="scss" scoped>
.assess-wrap {
  position: relative;
  .assessment-wrap {
    width: 100%;
    height: 100%;
    margin: 0;
  }
}
</style>
