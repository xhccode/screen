<template>
  <div class="right-section-wrap">
    <SectionA class="right-section-item" :num="reportCenterNum"></SectionA>
    <SectionB class="right-section-item" :num="realtimeTicketNum"></SectionB>
    <SectionC class="right-section-item" :num="realtimeTicketNum"></SectionC>
  </div>
</template>

<script>
import SectionA from './SectionA'
import SectionB from './SectionB'
import SectionC from './SectionC'
import STATE from '@/store/States'

export default {
  components: {
    SectionA,
    SectionB,
    SectionC
  },
  computed: {
    reportCenterNum () {
      return this.$store.state[STATE.REPORT_CENTER]
    },
    realtimeTicketNum () {
      return this.$store.state[STATE.REALTIME_TICKET]
    }
  },
  mounted () {
    this.$store.dispatch('getEventNumData')
  }
}
</script>

<style lang="scss" scoped>
.right-section-wrap {
  width: 400px;
  position: absolute;
  z-index: 1;
  right: 10px;
  top: 50%;
  height: 80vh;
  margin-right: 10px;
  margin-top: -40vh;
  line-height: 1.6;
  .right-section-item {
    background: #1c4d5994;
    border: 1px solid #ffffff59;
  }
  & > div {
    margin-top: 10px;
  }
  & > div:nth-child(1) {
    margin-top: 0 !important;
  }
}
@media screen and (min-width: 3600px) {
  .right-section-wrap {
    width: 20vw;
    height: 86vh;
    margin-top: -43vh;
    margin: auto 0;
    line-height: 1.4;
  }
}
@media screen and (min-height: 1200px) {
  .right-section-wrap {
    height: 80vh;
    margin-top: -40vh;
  }
}
</style>
