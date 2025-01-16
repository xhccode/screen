<template>
  <xs-dialog
    :title="title"
    :visible="visible"
    :fullscreen="fullscreen"
    width="40rem"
    height="30rem
  "
    :close="close"
  >
    <div class="content-box">
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">事件</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.daxiaolei }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">描述</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.description }}</span>
          </div>
        </div>
      </div>

      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">地址</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.locationdescription }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">上报时间</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.reporttime }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">上报人</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.reporter }}</span>
          </div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="item">
          <div class="ii label">
            <span class="txt">上报人电话</span>
          </div>
          <div class="ii value">
            <span class="txt">{{ unit.reportertelephone }}</span>
          </div>
        </div>
      </div>
    </div>
  </xs-dialog>
</template>
<script>
import XsDialog from '@/components/Base/XsDialog.vue'
import windowOp from '@/components/command/windowOp.js'
import API from '@/api'

export default {
  name: 'CityManagerDetail',
  mixins: [windowOp],
  components: { XsDialog },
  props: { casecode: { type: String, required: true } },
  data () {
    return { unit: {} }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      API.map.getCityManagerDetail({ caseCode: this.casecode }).then(({ data: { data } } = res) => {
        this.unit = data
        this.title = data.daxiaolei
      })
    }
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
