<template>
  <div class="status-wrap">
    <div class="box-a-wrap">
      <div class="box-a special">
        <div class="text">特急</div>
        <div class="tag" :style="`background-image:url(${red})`">{{ num.expressNum }}</div>
      </div>
      <div class="box-a urgent">
        <div class="text">紧急</div>
        <div class="tag" :style="`background-image:url(${yellow})`">
          {{ num.urgentNum }}
        </div>
      </div>
      <div class="box-a general">
        <div class="text">关注</div>
        <div class="tag" :style="`background-image:url(${blue})`">
          {{ num.normalNum }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import red from '../image/red.png'
import blue from '../image/blue.png'
import yellow from '../image/yellow.png'
import STATE from '@/store/States'
import boxBg from './status-box.png'

export default {
  data () {
    return {
      red,
      blue,
      yellow,
      boxBg
    }
  },
  computed: {
    num () {
      let events = this.$store.state[STATE.EVENTS]
      return {
        expressNum: events.ExtraUrgentList.length,
        urgentNum: events.UrgentList.length,
        normalNum: this.$store.state.UserInfo.orgCode == '320205005000' ? '3' : events.NormalList.length
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.status-wrap {
  margin-top: 12px;
  flex: 1;
  height: 100%;
  .box-a-wrap {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .special {
      background-color: rgba(175, 0, 0, 0.4);
    }
    .urgent {
      background-color: rgba(251, 255, 0, 0.4);
    }
    .general {
      background-color: rgba(14, 178, 255, 0.4);
    }
    .box-a {
      width: 30%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .text {
        position: absolute;
        top: 4px;
        left: 4px;
        color: #fff;
        font-size: 1.4rem;
      }
      .tag {
        height: 67px;
        width: 52px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        font-size: 24px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }
    }
  }
  .box-b-wrap {
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    .box-b {
      width: 125px;
      border-width: 1px;
      border-style: solid;
      box-sizing: border-box;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      color: #fff;
      .text {
        font-size: 1.3rem;
        font-weight: bold;
      }
      .number {
        font-size: 30px;
        font-weight: bold;
      }
    }
    .green {
      border-color: rgba(29, 169, 10, 1);
      background-color: rgba(29, 169, 10, 0.28);
    }
    .blue {
      border-color: rgba(38, 174, 255, 1);
      background-color: rgba(38, 174, 255, 0.28);
    }
    .gray {
      border-color: rgba(255, 255, 255, 1);
      background-color: rgba(255, 255, 255, 0.28);
    }
  }
  .box-d-wrap {
    display: flex;
    justify-content: space-between;
    .item {
      min-width: 89px;
      .box {
        background-size: 100% 100%;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        font-weight: bold;
      }
      .text {
        font-size: 1.4rem;
        color: #fff;
        padding-top: 8px;
        padding-bottom: 8px;
        text-align: center;
      }
    }
  }
}
</style>
