<template>
  <div class="section-c-wrap">
    <Title title="实时工单" sub-title="工单总量" :total="num.realTime" isHidden="true">></Title>
    <Status :num="num" />
  </div>
</template>

<script>
import Title from '../../component/Title'
import Status from './Status'

export default {
  props: ['num'],
  components: {
    Title,
    Status
  }
}
</script>

<style lang="scss" scoped>
.section-c-wrap {
  height: 36%;
}
</style>
