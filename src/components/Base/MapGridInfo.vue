<template>
  <xs-dialog :title="title" :visible="visible" :fullscreen="fullscreen" width="50rem" height="36rem" :close="close">
    <div class="content-box">
      <div class="statis-box">
        <div class="sb-item-wrapper" v-for="(s, i) in statisItems" :key="i">
          <div class="sb-item">
            <div class="icon">
              <i class="iconfont" :class="s.icon"></i>
            </div>
            <div class="label">
              <span class="txt">{{ s.label }}</span>
            </div>
            <div class="value">
              <span class="txt person">{{ statis[s.prop] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-box">
        <div class="chart-wrapper">
          <div class="chart" v-xschart:pie=""></div>
        </div>
        <div class="chart-wrapper">
          <div class="chart" v-xschart:ring=""></div>
        </div>
      </div>
    </div>
  </xs-dialog>
</template>
<script>
import echarts from 'echarts'
import XsDialog from '@/components/Base/XsDialog.vue'
import windowOp from '@/components/command/windowOp.js'
import builder from './data_map_grid_info'
import API from '@/api'

export default {
  name: 'MapGridInfo',
  mixins: [windowOp],
  components: { XsDialog },
  props: { orgCode: { type: String, required: true } },
  data () {
    return {
      statisItems: [
        { label: '人口数', unit: '人', prop: 'syrkCount', icon: 'icon-renkou' },
        { label: '重点人员', unit: '人', prop: 'zdryCount', icon: 'icon-zhongdianrenqun' },
        { label: '房屋数', unit: '间', prop: 'syfwCount', icon: 'icon-fangwu' },
        { label: '帮扶对象', unit: '人', prop: 'bfdxCount', icon: 'icon-linlibangfu' },
        { label: '重点单位', unit: '家', prop: 'zddwCount', icon: 'icon-renkou' },
        { label: '累计事件', unit: '件', prop: 'ljsjCount', icon: 'icon-shijian' },
        { label: '重点场所', unit: '家', prop: 'zdcsCount', icon: 'icon-zhongdianchangsuo' },
        { label: '网格力量', unit: '个', prop: 'wgllCount', icon: 'icon-wanggeguanli-wanggeliliang' }
      ],
      statis: {},
      ring: {},
      pie: {}
    }
  },
  directives: {
    xschart: {
      inserted (el, binding, { context }) {
        let chart = echarts.init(el)
        chart.setOption(context[binding.arg])
      },
      update (el, binding, { context }) {
        let chart = echarts.init(el)
        chart.setOption(context[binding.arg])
      },
      unbind (el) {
        let chart = echarts.init(el)
        chart.dispose()
      }
    }
  },
  created () {
    API.map.getMapRegion({ orgCode: this.orgCode }).then(({ data: { data } }) => {
      this.statis = data
    })
    API.map.getMapGridInfo({ orgCode: this.orgCode }).then(({ data: { data } }) => {
      LOG.dir(data)
      this.ring = builder.ring(
        '人口类型',
        _.map(data.mapPeopleInfoList, ({ peopleName, peopleNum }) => ({ name: peopleName, value: peopleNum }))
      )
      this.pie = builder.pie(
        '房屋类型',
        _.map(data.mapHousesInfoList, ({ housesName, housesNum }) => ({ name: housesName, value: housesNum }))
      )
    })
  }
}
</script>
<style lang="scss" scoped>
.content-box {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .statis-box {
    min-height: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .sb-item-wrapper {
      width: 50%;
      padding: 5px;
      display: flex;
      .sb-item {
        width: 100%;
        color: #fff;
        font-size: 1.2rem;
        &:hover {
          box-shadow: 0 0 5px #fff;
        }
        display: flex;
        .icon {
          min-width: 40px;
          display: flex;
          i {
            margin: auto;
          }
        }
        .label {
          min-width: 70px;
          display: flex;
          .txt {
            margin: auto 5px;
          }
          &::after {
            content: ':';
            margin: auto 0px;
          }
        }
        .value {
          flex: 1;
          min-width: 0;
          display: flex;
          justify-content: flex-end;
          .txt {
            margin: auto 15px;
          }
        }
      }
    }
  }
  .chart-box {
    flex: 1;
    min-height: 0;
    display: flex;
    .chart-wrapper {
      flex: 1;
      min-width: 0;
      padding: 5px;
      display: flex;
      .chart {
        flex: 1;
        min-width: 0;
        height: 100%;
      }
    }
  }
}
</style>
