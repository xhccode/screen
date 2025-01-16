<template>
  <div class="tool-box">
    <!-- 搜索 -->
    <div class="search-box">
      <el-select v-model="addr" filterable remote reserve-keyword :popper-append-to-body="false" placeholder="请输入关键词" :remote-method="searchAddrs" :loading="loading" @change="changeAddr">
        <el-option v-for="item in addrList" :key="item.id" :label="item.address || item.name" :value="item.id"> </el-option>
      </el-select>
    </div>
    <!-- 圈选尺寸设置 -->
    <div class="circle-radius">
      <el-slider v-model="radius" :step="100" :min="300" :max="2000" tooltip-class="xs-el-tooltip--light" :marks="marks" @change="circleScopeChange"> </el-slider>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MapSearch',
  inject: ['searchAddrByName', 'drawCircleWithVideo'],
  data () {
    return {
      loading: false,
      addrList: [],
      addr: undefined,
      center: undefined,
      radius: 500,
      marks: { 300: '300', 500: '500', 700: '700', 1000: '1000', 1500: '1500', 2000: '2000' }
    }
  },
  mounted () {},
  methods: {
    searchAddrs (value) {
      this.loading = true
      this.searchAddrByName(value)
        .then(result => {
          this.loading = false
          this.addrList = result.map(item => {
            item.type = MAP.MARKER_TYPES.MK_VIDEO
            return item
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    changeAddr (value) {
      let anchor = _.find(this.addrList, { id: value })
      this.center = {
        address: anchor.address || anchor.name,
        latitude: anchor.y,
        longitude: anchor.x,
        ...anchor
      }
      this.drawCircleWithVideo(this.center, this.radius)
    },
    circleScopeChange () {
      if (this.center) this.drawCircleWithVideo(this.center, this.radius)
    }
  }
}
</script>
<style scoped lang="scss">
.tool-box {
  width: 35rem;
  margin-top: 2rem;
  .search-box {
    width: 100%;
    z-index: 1;
    .el-select {
      width: 100%;
      /deep/ .el-input__inner {
        background-color: #0000005a;
        border-color: #fff !important;
        color: #fff !important;
        font-weight: bold;
        line-height: 3.2rem;
        height: 3.2rem;
        border-radius: 0 !important;
      }
      /deep/ .el-select-dropdown {
        margin: 0.5rem 0;
        font-size: 1.4rem;
        border: 0.1rem solid #e4e7ed;
        background: rgba(71, 78, 82, 0.8);
        border-radius: 0;
        box-shadow: 0 0.2rem 1.2rem 0 rgba(0, 0, 0, 0.1);
        .el-select-dropdown__list {
          li {
            color: #ffffff;
            &.hover {
              background-color: #284b70ad;
            }
          }
        }
        .popper__arrow {
          display: none;
        }
      }
    }
  }
}
</style>
