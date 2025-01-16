<template>
  <div class="economic-wrap">
    <div class="grid header">
      <div class="empty"></div>
      <div>总量</div>
      <div>同比（%）</div>
      <div>区排名</div>
    </div>
    <div class="grid content" v-for="(item, idx) in list" :key="idx">
      <div style="text-align: left">{{ item.name }}</div>
      <div>
        <span class="bold-word">{{ item.unit.indexOf('亿') >= 0 ? item.count / 100000000 : item.count / 10000 }}</span>
        <span>{{ item.unit }}</span>
      </div>
      <div class="flex-box">
        <span>{{ Math.abs(item.contrast) }}</span>
        <img v-if="item.contrast >= 0" :src="Up" style="width: 12px" />
        <img v-else :src="Down" style="width: 12px" />
      </div>
      <div>{{ item.rank }}</div>
    </div>
  </div>
</template>

<script>
import Up from '../image/arrow_up.png'
import Down from '../image/arrow_down.png'
export default {
  props: { data: undefined },
  data () {
    return {
      Up,
      Down,
      list: [
        { name: 'GDP', unit: '亿元', count: this.data.ceconomicGdp, contrast: this.data.ceconomicGdpComp, rank: this.data.cEconomicGdpRank },
        { name: '规模以上工业产值', unit: '亿元', count: this.data.ceconomicOutput, contrast: this.data.ceconomicOutputComp, rank: this.data.ceconomicOutputRank },
        { name: '规模以上工业增加值', unit: '亿元', count: this.data.ceconomicAdd, contrast: this.data.ceconomicAddComp, rank: this.data.ceconomicAddRank },
        { name: '工业申报销售', unit: '亿元', count: this.data.ceconomicSale, contrast: this.data.ceconomicSaleComp, rank: this.data.ceconomicSaleRank },
        { name: '规模以上工业出口交货值', unit: '亿元', count: this.data.ceconomicExit, contrast: this.data.ceconomicComp, rank: this.data.ceconomicRank },
        { name: '工业用电量', unit: '万度', count: this.data.ceconomicElectricity, contrast: this.data.ceconomicElectricityComp, rank: this.data.ceconomicElectricityRank },
        { name: '工业用气', unit: '万方', count: this.data.ceconomicGas, contrast: this.data.ceconomicGasComp, rank: this.data.ceconomicGasRank }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.economic-wrap {
  .grid {
    display: grid;
    grid-template-columns: 2.5fr 1.5fr 1fr 1fr;
    grid-row: 1;
    & > div {
      text-align: center;
    }
  }
  .header {
    color: #5cc7f9;
    font-size: 10px;
  }
  .content {
    color: #fff;
    font-size: 1.2rem;
    box-sizing: border-box;
    padding: 0 10px;
    background-color: rgba(14, 178, 255, 0.2);
    border-bottom: 1px solid #0eb2ff;
  }
  .bold-word {
    font-size: 1.4rem;
    font-weight: bold;
    margin-right: 4px;
  }
  .flex-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
