<template>
  <div class="section-a-wrap">
    <Title title="受理中心"  sub-title="今日总发现" :total="num.today" highest="52"></Title>
    <el-row :gutter="20">
      <el-col :span="12">
        <PassiveBox :num="num"></PassiveBox>
      </el-col>
      <el-col :span="12">
        <InitiativeBox :num="num"></InitiativeBox>
      </el-col>
      <el-col :span="12">
        <AutomicBox :num="num"></AutomicBox>
      </el-col>
      <el-col :span="12">
        <CommonBox :num="num"></CommonBox>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Title from '../../component/Title'
import PassiveBox from './PassiveBox'
import InitiativeBox from './InitiativeBox'
import AutomicBox from './AutomicBox'
import CommonBox from './CommonBox'

export default {
  props: ['num'],
  components: {
    Title,
    PassiveBox,
    InitiativeBox,
    AutomicBox,
    CommonBox
  }
}
</script>

<style lang="scss" scoped>
.section-a-wrap {
  height: 54%;
  display: flex;
  flex-direction: column;
  .el-row {
    padding-top: 10px;
    flex: 1;
    & > div {
      height: 50%;
      .row {
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        & > div {
          height: 50%;
        }
      }
    }
  }
  @media screen and (min-width: 3600px) {
    /deep/ .el-row .title-box {
      font-size: 1.6rem;
    }
  }
}
</style>
