<template>
  <div class="my-wordcloud" ref="wordcloud"></div>
</template>

<script>
import { init } from 'echarts'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'
export default {
  props: {
    worddata: {
      type: Array,
      default: [
        {
          name: '生态福地',
          value: 2500
        },
        {
          name: '纯美水乡',
          value: 2300
        },
        {
          name: '千亩梨园',
          value: 2000
        },
        {
          name: '宛心花田',
          value: 1900
        },
        {
          name: '宛山湖风光',
          value: 1800
        },
        {
          name: '青团',
          value: 1700
        },
        { name: '推酥麦饼', value: 1600 },
        { name: '鸡头米', value: 1500 },
        { name: '大成桥', value: 1400 }
      ]
    }
  },
  data () {
    return {}
  },
  watch: {
    worddata (newV, oldV) {
      if (newV !== undefined) {
        this.initCharts()
      }
    }
  },
  methods: {
    initCharts: function () {
      let myCharts = init(this.$refs.wordcloud)
      let i = 0
      let colors = ['rgb(255, 0, 0)', 'rgb(255, 255, 0)', 'rgb(75, 255, 0)', 'rgb(192, 0, 255)', 'rgb(255, 0, 129)', 'rgb(255, 255, 255)']
      myCharts.setOption({
        title: {
          //                        text: "热爱祖国",
          x: 'center'
        },
        backgroundColor: 'transparent',
        // tooltip: {
        //   pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        // },
        series: [
          {
            type: 'wordCloud',
            // 用来调整词之间的距离
            gridSize: 10,
            // 用来调整字的大小范围
            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.
            sizeRange: [10, 18],
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
            // 用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
            // rotationRange: [-45, 0, 45, 90],
            // rotationRange: [ 0,90],
            rotationRange: [0, 0],
            layoutAnimation: true,
            // 随机生成字体颜色
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function (item) {
                  if (i > 5) {
                    i = 0
                  }
                  let color = colors[i]
                  i++
                  return color
                }
              }
            },
            // 位置相关设置
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            width: '100%',
            height: '100%',
            // 数据
            data: this.worddata
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
.my-wordcloud {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
