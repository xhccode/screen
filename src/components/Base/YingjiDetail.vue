<template>
  <xs-dialog :title="title" :visible="visible" :fullscreen="fullscreen" width="400px" height="300px" :close="close">
    <div class="content-box">
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">单位名称</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.unitName }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">统一信用码</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.unitCode }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">状态</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.status }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">地址</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.address }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">发布日期</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.releaseTime }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">应急方案</span>
          </div>
          <div class="ii value">
            <a class="txt" :href="unit.emergencyLink" target="_blank">{{ unit.emergencyName }}</a>
          </div>
        </div>
      </div>
    </div>
  </xs-dialog>
</template>
<script>
import XsDialog from '@/components/Base/XsDialog.vue'
import windowOp from '@/components/command/windowOp.js'

export default {
  name: 'YingjiDetail',
  mixins: [windowOp],
  components: { XsDialog },
  props: { unit: { type: Object, required: true } },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.content-box {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  padding: 10px;
  .item-wrapper {
    width: 100%;
    .item {
      color: #fff;
      font-size: 1.2rem;
      padding: 5px;
      &:hover {
        box-shadow: 0 0 5px #fff;
      }
      display: flex;
      .ii {
        &.label {
          width: 8rem;
          display: flex;
          justify-content: space-between;
          .txt {
            margin: auto 5px;
          }
          &::after {
            content: ':';
            margin: auto 3px;
          }
        }
        &.value {
          flex: 1;
          min-width: 0;
          display: flex;
          .txt {
            margin: auto 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
