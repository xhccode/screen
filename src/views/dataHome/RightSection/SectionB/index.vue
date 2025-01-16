<template>
  <div class="section-b-wrap">
    <Title title="预警工单" sub-title="工单总量" :total="num.realTime" isHidden="true"></Title>
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
.section-b-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
