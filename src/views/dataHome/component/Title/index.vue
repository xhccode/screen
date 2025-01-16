<template>
  <div class="title-wrap" :style="`background-image:url(${bg})`">
    <span>{{ title }}</span>
    <div class="sub-title" v-if="subTitle &&$store.state.UserInfo.orgCode!='320205005000'">
      <div v-if="!isHidden">
        <span style="font-size: 1.4rem">{{ subTitle }}</span>

        <span class="total"><countTo :startVal="totalStart" :endVal="+total" :duration="3000"></countTo></span>
      </div>

      <span class="highest" v-if="highest &&$store.state.UserInfo.orgCode!='320205005000'">
        <div
          style="
                        font-weight: 200;
                        font-size: 10px;
                        transform: scale(0.8);
                    "
        >
          历史最高
        </div>
        <div>{{ highest }}</div>
      </span>
    </div>
  </div>
</template>

<script>
import bg from './title.png'
import countTo from 'vue-count-to'

export default {
  components: { countTo },
  props: {
    title: String,
    total: Number,
    subTitle: String,
    highest: String,
    isHidden: String
  },
  data () {
    return {
      bg,
      totalStart: 0
    }
  },
  methods: {
    updateNumber: function () {
      this.totalStart++
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      this.updateNumber()
    }, 18000)
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
.title-wrap {
  width: 100%;
  color: #fff;
  font-size: 1.8rem;
  font-weight: bold;
  padding-left: 8px;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .sub-title {
    font-weight: 500;
    display: flex;
    align-items: center;
    & > * {
      margin-left: 8px;
    }
    .total {
      font-size: 24px;
      background-image: -webkit-linear-gradient(bottom, #e58750, #ffae49, #fec442);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .highest {
      text-align: right;
      font-size: 10px;
    }
  }
}
</style>
