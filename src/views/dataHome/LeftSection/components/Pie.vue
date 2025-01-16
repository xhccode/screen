<template>
    <div ref="pie" class="pie-wrap"></div>
</template>

<script>
import { init } from 'echarts'
export default {
  props: { options: Object },
  methods: {
    initCharts () {
      let myCharts = init(this.$refs.pie)
      myCharts.setOption(this.options)
    }
  },
  mounted () {
    this.initCharts()
  }
}
</script>

<style lang="scss" scoped>
.pie-wrap {
    width: 100%;
    height: 100%;
}
</style>
