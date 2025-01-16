<template>
  <div class="map-locate-box">
    <div class="map-locator">
      <!-- 区域选择 -->
      <el-cascader
        popper-class="map-locator-cascader"
        size="mini"
        :options="options"
        v-if="showRegionSelected"
        v-model="regionSelected.orgCode"
        :props="{ checkStrictly: true, emitPath: false, label: 'orgSimpleName', value: 'orgCode' }"
        clearable
      >
        <template slot-scope="{ data }">
          <el-radio v-model="regionSelected" :label="data">{{ data.orgSimpleName }}</el-radio>
        </template>
      </el-cascader>
      <!-- 类型选择 -->
      <div class="type-box">
        <div class="type-wrapper" v-for="(t, i) in unitTypes" :key="i">
          <div class="type-inner" :class="{ active: activeType.unitType === t.unitType }" v-show="t.visible" @click="activeType = t">
            <span class="txt">{{ gridName(t) }}</span>
            <span class="txt" v-if="t.num != undefined">({{ t.num }})</span>
          </div>
        </div>
      </div>
      <span class="back-org" v-if="regionSelected.orgCode != orgCode" @click="backLastOrg(options)">返回上一级</span>
      <span class="back-org" v-else-if="$route.path != '/datahome'" @click="clickSearch()">{{ mapSearch ? '隐藏搜索' : '展开搜索' }}</span>
    </div>
    <MapSearch v-if="mapSearch" />
  </div>
</template>
<script>
import CallCenter from '@/components/Base/CallCenter'
import MapGridInfo from '@/components/Base/MapGridInfo.vue'
import YingjiDetail from '@/components/Base/YingjiDetail.vue'
import HuanbaoDetail from '@/components/Base/HuanbaoDetail.vue'
import CityManagerDetail from '@/components/Base/CityManagerDetail.vue'
import ChatFaces from '../command/ChatFaces.vue'
import ChartUnit from '../command/ChartUnit.vue'
import MapSearch from './MapSearch.vue'
import LOG from '@/utils/logger'
import STATE from '@/store/States'
import EVENT from '@/utils/Events'
import API from '@/api'

const unitTypes = [
  { unitType: '4', name: '网格', num: 35, strokeColor: 'yellowgreen', fillColor: '#f9fa14', visible: true },
  { unitType: '1', name: '环保', num: 11, total: 0, strokeColor: 'green', fillColor: '#d3ff81', visible: true },
  { unitType: '2', name: '应急', num: 4, total: 0, strokeColor: '#ff0000', fillColor: '#00fffd', visible: true },
  { unitType: '3', name: '城管', num: 11, total: 0, strokeColor: 'yellowgreen', fillColor: '#ffe500', visible: true }
]
export default {
  components: { ChatFaces, ChartUnit, MapSearch },
  name: 'MapLocator',
  data () {
    return {
      unitTypes,
      activeType: {},
      options: [{ ...this.$store.state[STATE.USER_ORG] }],
      regionSelected: {},
      showRegionSelected: false,
      orgCode: this.$store.state[STATE.USER_ORG].orgCode,
      mapSearch: false
    }
  },
  watch: {
    regionSelected (value) {
      LOG.dir(value)
      _.forEach(this.unitTypes, t => {
        t.visible = +t.unitType > 3 || +value.orgDepth <= 3
      })
      this.$nextTick(() => {
        this.changeActiveUnit()
        this.getTopCount(value)
        this.drawManagedUnit('1', true)
        this.drawManagedUnit('2', true)
        this.drawManagedUnit('3', true)
      })
      this.regionSelected.orgCode = value.orgCode
      LOG.log('INFO:EVENT-', EVENT.MAP_REGION_CHANGE, value)
      this.$emit(EVENT.MAP_REGION_CHANGE, { ...value })
      this.$bus.$emit(EVENT.MAP_REGION_CHANGE, { ...value })
      this.mapSearch = false
    },
    activeType (value) {
      // 类型切换
      this.mapSearch = false
      this.$bus.$emit(EVENT.MAP_UNIT_TYPE_CHANGE, value)
      this.$nextTick(() => {
        this.changeActiveUnit()
      })
    }
  },

  mounted () {
    this.loadRegionOptionsNode(this.options[0])
    // 默认选中网格
    this.activeType = this.unitTypes[0]
    this.regionSelected = this.options[0]
  },
  // inject: ['flyTo', 'addMarkers', 'drawRegionBoundaries', 'openPopup', 'popBoth', 'clusterMarkers', 'clearCustomerLayers'],
  methods: {
    loadRegionOptionsNode (orgInfo) {
      if (!orgInfo.children && parseInt(orgInfo.orgDepth) <= 4) {
        API.login.getOrgTree({ orgCode: orgInfo.orgCode, rank: 5 }).then(({ data: { data } }) => {
          let datas = data.map(d => ({
            ...d,
            leaf: d.orgDepth >= 5
          }))
          if (orgInfo.orgDepth == 4) {
            this.showRegionSelected = true
          }
          orgInfo.children = datas
          orgInfo.children.map(item => {
            this.loadRegionOptionsNode(item)
          })
        })
      }
    },
    backLastOrg (orgs) {
      orgs.map(item => {
        if (item.orgCode === this.regionSelected.orgParentCode) {
          this.regionSelected = item
        } else if (item.children) {
          this.backLastOrg(item.children)
        }
      })
    },
    // 切换网格单元时
    changeActiveUnit () {
      let onTime = null
      let { unitType } = this.activeType
      // '4', name: '网格',
      // '1', name: '环保',
      // '2', name: '应急',
      // '3', name: '城管',
      switch (+unitType) {
        case 1: // 环保
          // 绘制管理单元边界
          this.drawManagedUnit(unitType)
          // 撒点
          setTimeout(() => {
            this.drawEnvCompanyDots()
          }, 500)
          break
        case 2: // 应急
          // 绘制管理单元边界
          this.drawManagedUnit(unitType)
          // 撒点
          setTimeout(() => {
            this.drawMergencyDots()
          }, 500)
          break
        case 3: // 城管
          // 绘制管理单元边界
          this.drawManagedUnit(unitType)
          // 撒点
          setTimeout(() => {
            this.getCityManagerInfo()
          }, 500)
          break
        case 4: // 网格
          // 绘制网格边界
          return this.drawMapGrid(unitType)
      }
      //
    },
    // 应急撒点
    drawMergencyDots () {
      let { orgCode, orgDepth: areaLevel } = this.regionSelected
      API.map.getMergencyCompanyInfo({ orgCode, areaLevel }).then(({ data: { data } }) => {
        this.activeType.total = data.length || 0
        // 类型切换
        this.$bus.$emit(EVENT.MAP_UNIT_TYPE_CHANGE, this.activeType)
        if (data && data.length) {
          // this.clusterMarkers(
          //   this.regionSelected,
          //   data,
          //   {
          //     name: 'MergencyDots',
          //     clickMarkerHandler: (layer, data) => {
          //       this.$extendDialog(YingjiDetail, {}, { title: data.unitName, unit: data })
          //     }
          //   },
          //   MAP.ZOOMS[+this.regionSelected.orgDepth]
          // )
        }
      })
    },
    // 环保撒点
    drawEnvCompanyDots () {
      let { orgCode } = this.regionSelected
      LOG.dir(this.regionSelected)
      API.map.getEnvCompany({ orgCode }).then(
        ({
          data: {
            data: { companyList, envList }
          }
        }) => {
          this.activeType.total = companyList.length || 0
          // 类型切换
          this.$bus.$emit(EVENT.MAP_UNIT_TYPE_CHANGE, this.activeType)
          if (companyList && companyList.length) {
            // this.clusterMarkers(
            //   this.regionSelected,
            //   companyList,
            //   {
            //     name: 'EnvCompanyDots',
            //     clickMarkerHandler: (layer, data) => {
            //       LOG.dir(data)
            //       this.$extendDialog(HuanbaoDetail, {}, { title: data.ename, unit: data })
            //     }
            //   },
            //   MAP.ZOOMS[+this.regionSelected.orgDepth]
            // )
          }
        }
      )
    },
    // 城管撒点
    getCityManagerInfo () {
      let { orgCode, orgDepth } = this.regionSelected
      API.map.getCityManagerInfo({ orgCode, areaLevel: orgDepth, dateTime: '' }).then(({ data: { data } }) => {
        this.activeType.total = data.length || 0
        // 类型切换
        this.$bus.$emit(EVENT.MAP_UNIT_TYPE_CHANGE, this.activeType)
        if (data && data.length) {
          // this.clusterMarkers(
          //   this.regionSelected,
          //   data,
          //   {
          //     name: 'CityManagerCompanyDots',
          //     clickMarkerHandler: (layer, data) => {
          //       LOG.dir(data)
          //       this.$extendDialog(CityManagerDetail, {}, { title: '', casecode: data.casecode })
          //     }
          //   },
          //   MAP.ZOOMS[+this.regionSelected.orgDepth]
          // )
        }
      })
    },
    // 显示网格
    drawMapGrid () {
      // 如果是最后一级，则绘制自己本身的边框
      if (this.regionSelected.orgDepth === '5') {
        API.map.getOrgRegionalBoundary({ orgCode: this.regionSelected.orgCode }).then(({ data: { data } }) => {
          this.drawBoundaries(
            this.regionSelected,
            [data],
            true,
            (layer, data, map) => {
              this.$notify('已经是最小单元，无法下钻!!!')
            },
            (marker, data) => {
              if (+data.orgDepth > 2) {
                // 区中心才出现中心点调
                this.$notify('区中心才出现中心点调!!!')
              }
            }
          )
        })
      } else {
        API.map.getRegionalBoundary({ orgCode: this.regionSelected.orgCode }).then(({ data: { data } }) => {
          // this.activeType.num = data.length || 0
          // this.drawBoundaries(
          //   this.regionSelected,
          //   data,
          //   true,
          //   (layer, data, map) => {
          //     // todo 下钻
          //     if (+data.orgDepth < 5) {
          //       this.regionSelected = data
          //       this.flyTo(data, MAP.ZOOMS[+data.orgDepth])
          //     }
          //   },
          //   (marker, data) => {
          //     // 区中心才出现中心点调
          //     if (+data.orgDepth === 3) {
          //       this.$extendDialog(CallCenter, {}, { regionalData: data, title: '中心点调', width: '80vw' })
          //     } else {
          //       this.$extendDialog(MapGridInfo, {}, { title: data.orgSimpleName, orgCode: data.orgCode })
          //     }
          //   }
          // )
        })
      }
    },
    drawManagedUnit (unitType, justGetData) {
      API.map.getUnitRegionalBoundary({ orgCode: this.regionSelected.orgCode, unitType }).then(({ data }) => {
        if (justGetData) {
          return this.unitTypes.map(item => {
            if (item.unitType === unitType) {
              item.num = data.data.length || 0
            }
            return item
          })
        }
        // 区以下才显示
        // this.drawBoundaries(
        //   this.regionSelected,
        //   data.data,
        //   +this.$store.state[STATE.USER_ORG].orgDepth > 2,
        //   // 双击
        //   (layer, data, map) => {
        //     // todo 下钻
        //     this.flyTo(data, MAP.ZOOMS[+data.orgDepth])
        //   },
        //   // 单击
        //   (marker, data, map) => {
        //     this.openPopup(data, {
        //       popupCreator: () => {
        //         let vnode = MAP.createUnitPopup(data, {})
        //         return vnode.$el
        //       }
        //     })
        //   }
        // )
      })
    },
    // 显示边界
    drawBoundaries (center, data, markerable, layerDbClickHandler, markerClickHandler) {
      let { fillColor } = this.activeType
      let currentZoom = MAP.ZOOMS[+center.orgDepth]
      // 绘制街道边界
      // this.drawRegionBoundaries(center, data, currentZoom, {
      //   name: MAP.MAP_LAYER_BOUNDARIES,
      //   clearLayer: MAP.MAP_CLEAR_LAYERS_EXC_URGENT_EVENT,
      //   strokeColor: this.activeType.strokeColor,
      //   fillColor: MAP.DEFAULT_FILLCOLOR,
      //   markerable,
      //   markerClickHandler,
      //   mouseEventHandler: (layer, data, type, map) => {
      //     if (type === 'mouseover') {
      //       layer.setStyle({ fillColor })
      //     } else if (type === 'mouseout') {
      //       layer.setStyle({ fillColor: MAP.DEFAULT_FILLCOLOR })
      //     }
      //   },
      //   layerClickHandler: (layer, data, map) => {
      //     // 移动到指定点
      //     this.flyTo(data, currentZoom)
      //   },
      //   layerDbClickHandler
      // })
    },
    // 加载机构树数据
    regionalDataLazyLoad (node, resolve) {
      API.login.getOrgTree({ orgCode: node.value, rank: 5 }).then(({ data: { data } }) => {
        let datas = data.map(d => ({
          ...d,
          leaf: d.orgDepth >= 5
        }))
        node.data.children = datas
        resolve(datas)
      })
    },
    // 计算网格名称
    gridName (t) {
      if (t.unitType === '4') {
        let orgDepth = +this.regionSelected.orgDepth
        switch (orgDepth) {
          case 2:
            return '街镇'
          case 3:
            return '村/社区'
          case 4:
            return '网格'
          case 5:
            return '网格'
        }
      }
      return t.name
    },
    getTopCount ({ orgCode, orgDepth }) {
      API.map.getTopCount({ orgCode, areaLevel: orgCode }).then(
        ({
          data: {
            data: { countStreetTown }
          }
        }) => {
          this.unitTypes[0].num = countStreetTown
        }
      )
    },
    clickSearch () {
      this.mapSearch = !this.mapSearch
      if (!this.mapSearch) {
        // this.clearCustomerLayers()
        // this.popBoth()
      }
    },
  }
}
</script>
<style scoped lang="scss">
.map-locate-box {
  display: flex;
  margin: 0 auto;
  position: relative;
  align-items: center;
  flex-direction: column;
  .map-locator {
    display: flex;
    flex-wrap: nowrap;
  }
  .el-cascader,
  .el-select {
    /deep/ .el-input {
      .el-input__inner {
        background-color: #0000005a;
        border-color: #fff !important;
        color: #fff !important;
        font-weight: bold;
        line-height: 3.2rem;
        height: 3.2rem;
        border-radius: 0 !important;
      }
      .el-input__suffix {
        .el-input__icon {
          color: #fff !important;
          font-weight: bold;
        }
      }
    }
  }
  .type-box {
    // min-width: 375px;
    display: flex;
    justify-content: flex-start;
    .type-wrapper {
      line-height: 3rem;
      margin-left: 0.8rem;
      min-width: 7.4rem;
      .type-inner {
        padding: 0 10px;
        cursor: pointer;
        &.active {
          background: rgba($color: #089aae, $alpha: 0.8);
          border: 1px solid #fff;
          box-shadow: 0 0 5px #fff;
          font-weight: bold;
        }
        border: 1px dashed #fff;
        display: flex;
        .txt {
          margin: auto;
          color: #fff;
        }
      }
    }
  }
  .back-org {
    margin-left: 0.8rem;
    border: 1px solid #fff;
    color: #fff;
    line-height: 3rem;
    padding: 0 10px;
    cursor: pointer;
    &:hover {
      background: rgba($color: #089aae, $alpha: 0.8);
      border: 1px solid #fff;
      box-shadow: 0 0 5px #fff;
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
.map-locator-cascader {
  background-color: transparent;
  border-radius: 0;
  .popper__arrow {
    display: none;
  }
  .el-cascader-menu__wrap {
    .el-cascader-menu__list {
      background: rgba(71, 78, 82, 0.8);
      .el-cascader-node {
        &:hover {
          background-color: transparent;
        }
        &:focus {
          background-color: transparent;
        }
        > label {
          .el-radio__input {
            .el-radio__inner {
              display: none;
            }
          }
        }
        .el-cascader-node__label {
          .el-radio {
            color: #fff;
            .el-radio__label {
              color: #fff;
            }
          }
          .el-radio__input {
            &.is-checked {
              .el-radio__inner {
                border-color: #108ca4;
                background: #108ca4;
              }
            }
          }
        }
        .el-cascader-node__postfix {
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
