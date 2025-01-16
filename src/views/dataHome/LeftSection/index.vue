<template>
  <div class="left-section-wrap">
    <Title :title="`区域印象(${orgInfo.orgName})`"></Title>
    <Impression />
    <Title title="区域概况"> </Title>
    <Overview :orgInfo="orgInfo" />
    <Title title="全省 “高质量发展” 考核（模拟监测）"></Title>
    <Assessment :orgInfo="orgInfo" />
  </div>
</template>

<script>
import Title from '../component/Title'
import Impression from './Impression'
import Overview from './Overview'
import Assessment from './Assessment'

export default {
  components: {
    Title,
    Impression,
    Overview,
    Assessment
  },
  props: {
    orgInfo: undefined
  }
}
</script>

<style lang="scss" scoped>
.left-section-wrap {
  width: 400px;
  flex-shrink: 0;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 50%;
  margin-left: 10px;
  margin-top: -40vh;
  height: 80vh;
  display: flex;
  flex-direction: column;
  /deep/ .impression-wrap,
  /deep/ .assess-wrap {
    flex: 1;
  }
  /deep/ .overview-wrap {
    min-height: 21rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    .charts-wrap {
      flex: 1;
    }
  }
}
@media screen and (min-width: 3600px) {
  .left-section-wrap {
    width: 20vw;
    height: 86vh;
    margin-top: -43vh;
    margin: auto 0;
  }
}
@media screen and (min-height: 1200px) {
  .left-section-wrap {
    height: 80vh;
    margin-top: -40vh;
  }
}
</style>
