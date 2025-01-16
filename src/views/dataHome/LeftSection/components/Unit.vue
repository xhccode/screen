<template>
  <div class="geography-wrap">
    <overview-title :icon="Icon" title="企业情况" :value="data.centerpriseAll.toString()" unit="个"></overview-title>
    <div class="content">
      <div class="item">
        <pie
          :options="{
            grid: {
              left: 10
            },
            color: ['#1EC4FF'],
            title: {
              text: '规上企业',
              bottom: -6,
              left: '16%',
              itemGap: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            legend: {
              symbol: 'circle',
              left: '60%',
              top: 'middle',
              orient: 'vertical',
              itemWidth: 6,
              itemHeight: 6,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },

            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: '#1fd6fe',
                label: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    color: '#fff',
                    fontWeight: 500
                  },
                  formatter: function() {
                    return data.centerpriseScale
                  }
                },
                labelLine: { show: false },
                data: [{ value: data.centerpriseScale, name: '规上企业' }]
              }
            ]
          }"
        />
      </div>
      <div class="item">
        <pie
          :options="{
            color: ['#1EC4FF', '#3cf3b7', '#F99C0F', '#ff7c5a'],
            title: {
              text: '重点企业',
              bottom: -6,
              left: '16%',
              itemGap: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            legend: {
              symbol: 'circle',
              left: '70%',
              top: 'middle',
              orient: 'vertical',
              itemWidth: 6,
              itemHeight: 6,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                name: '重点企业',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                label: {
                  show: true,
                  position: 'center',
                  formatter: function() {
                    return data.centerpriseEmpEmergency + data.centerpriseEmpEnvir
                  },
                  textStyle: {
                    color: '#fff',
                    fontWeight: 500
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: data.centerpriseEmpEmergency, name: '应急' },
                  { value: data.centerpriseEmpEnvir, name: '环保' }
                ]
              }
            ]
          }"
        />
      </div>
      <div class="item">
        <pie
          :options="{
            color: ['#3df2ae'],
            title: {
              text: '个体工商户',
              bottom: -6,
              left: '15%',
              itemGap: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            legend: {
              symbol: 'circle',
              left: '60%',
              top: 'middle',
              orient: 'vertical',
              itemWidth: 6,
              itemHeight: 6,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },

            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: '#3df2ae',
                label: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    color: '#fff',
                    fontWeight: 500
                  },
                  formatter: function() {
                    return data.centerpriseIndividual
                  }
                },
                labelLine: { show: false },
                data: [
                  {
                    value: data.centerpriseIndividual,
                    name: '个体工商户'
                  }
                ]
              }
            ]
          }"
        />
      </div>
      <div class="item">
        <pie
          :options="{
            color: ['#ff7c5a', '#b16acb', '#1EC4FF', '#3cf3b7', '#F99C0F'],
            title: {
              text: '学校',
              left: '20%',
              bottom: -6,
              itemGap: 0,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            legend: {
              symbol: 'circle',
              left: '70%',
              top: 'middle',
              orient: 'vertical',
              itemWidth: 6,
              itemHeight: 6,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                name: '学校',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                label: {
                  show: true,
                  position: 'center',
                  formatter: function() {
                    return data.centerpriseSchoolSenior + data.centerpriseSchoolJunior + data.centerpriseSchoolPrimary + data.centerpriseSchoolNursery
                  },
                  textStyle: {
                    color: '#fff',
                    fontWeight: 500
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: data.centerpriseSchoolSenior, name: '高中' },
                  { value: data.centerpriseSchoolJunior, name: '初中' },
                  { value: data.centerpriseSchoolPrimary, name: '小学' },
                  { value: data.centerpriseSchoolNursery, name: '幼儿园' }
                ]
              }
            ]
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OverviewTitle from './OverviewTitle'
import Pie from './Pie'
import Icon from '../image/unit.png'

export default {
  props: { data: {} },
  components: { OverviewTitle, Pie },
  data () {
    return {
      Icon
    }
  }
}
</script>

<style lang="scss" scoped>
.geography-wrap {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: calc(100% - 3rem);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    .item {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
