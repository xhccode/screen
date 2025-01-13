<template>
  <div class="chat-attendance">
    <div class="chat-tit">
      <div class="attend-num xs-drawer-item-head">
        <div class="title">
          <span class="txt">参会者 ({{ checkedPowers && checkedPowers.length }})</span>
        </div>
        <div class="line"></div>
        <div class="dot"></div>
      </div>
      <div @click="showPowerAndMonitorList = true" class="add-icon">
        <img src="@/assets/img/command/add-user.png" alt="" />
      </div>
      <commandAddConnect
        :addCantacts="addCantacts"
        :addMonitors="addMonitors"
        :checkedMonitors="checkedMonitors"
        :checkedPowers="checkedPowers"
        :circleOption="circleOption"
        class="addConnect"
        @closeAddConnect="showPowerAndMonitorList = false"
        v-if="showPowerAndMonitorList"
      />
    </div>
    <div class="attendance-list">
      <div v-for="(item, index) in checkedPowers" :key="index" class="attendance-item">
        <div class="pro-img">
          <img :src="item.url" />
        </div>
        <el-tooltip :content="`${item.post || item.postName || ''}(${item.account})`" class="pro-nm" effect="light">
          <div class="pn-inner">
            <span class="txt">{{ item.name }}({{ item.phone }})</span>
          </div>
        </el-tooltip>
        <div class="audio-status">
          <img class="p-speaking" :src="faMicrophone" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import faMicrophone from '@/assets/img/command/fa-microphone.png'
import commandAddConnect from './commandAddConnect.vue'
export default {
  name: 'Participants',
  props: {
    checkedPowers: undefined,
    checkedMonitors: undefined,
    addCantacts: undefined,
    addMonitors: undefined,
    circleOption: {
      longitude: undefined,
      latitude: undefined,
      scope: 1
    }
  },
  components: {
    commandAddConnect
  },
  provide () {
    return {}
  },
  data () {
    return {
      showPowerAndMonitorList: false,
      faMicrophone
    }
  },
  mounted () {},
  methods: {
    // addCantacts (powers) {
    //   if (this.powers.length + powers.length > 4) {
    //     return this.$notify({
    //       title: '提示',
    //       message: `最多只支持呼叫3个人`,
    //       type: 'warning'
    //     })
    //   }
    //   this.initPowers()
    //   powers.map((item, idx) => {
    //     if (_.indexOf(this.powers, { account: item.account || item.loginName }) < 0) {
    //       this.powers.push({
    //         proImg: item.url,
    //         proNm: (item.orgName || '锡山区') + '-' + item.realName + '-' + item.phone,
    //         account: item.loginName,
    //         orgName: item.orgName || '',
    //         name: item.realName,
    //         phone: item.phone
    //       })
    //     }
    //   })
    // },
    // addMonitors (monitor) {
    //   if (this.powers.length + powers.length > 4) {
    //     return this.$notify({
    //       title: '提示',
    //       message: `最多只支持呼叫3个人`,
    //       type: 'warning'
    //     })
    //   }
    //   this.initPowers()
    //   powers.map((item, idx) => {
    //     if (_.indexOf(this.powers, { account: item.account || item.loginName }) < 0) {
    //       this.powers.push({
    //         proImg: item.url,
    //         proNm: (item.orgName || '锡山区') + '-' + item.realName + '-' + item.phone,
    //         account: item.loginName,
    //         orgName: item.orgName || '',
    //         name: item.realName,
    //         phone: item.phone
    //       })
    //     }
    //   })
    // }
  },
  beforeDestroy () {}
}
</script>
<style lang="scss" scoped>
.chat-attendance {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .chat-tit {
    width: 100%;
    font-size: 1.4rem;
    font-weight: bold;
    color: #ffffff;
    display: flex;
    .attend-num {
      flex: 1;
      min-width: 0;
    }
    .add-icon {
      margin: auto;
      cursor: pointer;
      width: 28px;
      height: 28px;
      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
      &:hover {
        box-shadow: 0 0 5px #fff;
        border-radius: 50%;
      }
    }
  }
  .attendance-list {
    padding: 5px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .attendance-item {
      &:hover {
        box-shadow: 0 0 5px #fff;
      }
      font-size: 1.2rem;
      color: #fff;
      display: flex;
      justify-content: space-between;
      .pro-img {
        // width: 28px;
        // height: 28px;
        display: flex;
        img {
          height: 1.66rem;
          width: 1.66rem;
          margin: auto;
          object-fit: scale-down;
        }
      }
      .pro-nm {
        margin-left: 10px;
        flex: 1;
        min-width: 0;
        display: flex;
        .txt {
          margin: auto 5px;
          padding: 0 5px;
        }
      }
      .audio-status {
        display: flex;
        img {
          margin: auto;
          width: 28px;
          height: 28px;
          object-fit: scale-down;
        }
      }
    }
  }
}
</style>
