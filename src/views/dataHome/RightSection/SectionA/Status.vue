<template>
  <div class="status-wrap">
    <div class="box-a-wrap">
      <div class="box-a urgent">
        <div class="text">紧急</div>
        <div class="tag" :style="`background-image:url(${red})`">3</div>
      </div>
      <div class="box-a general">
        <div class="text">一般</div>
        <div class="tag" :style="`background-image:url(${blue})`">
          9
        </div>
      </div>
      <div class="box-a basic">
        <div class="text">普通</div>
        <div class="tag" :style="`background-image:url(${green})`">
          99
        </div>
      </div>
    </div>
    <div class="box-b-wrap">
      <div class="box-b green">
        <div class="text">待分派</div>
        <div class="number">34</div>
      </div>
      <div class="box-b blue">
        <div class="text">处置中</div>
        <div class="number">25</div>
      </div>
      <div class="box-b gray">
        <div class="text">评价中</div>
        <div class="number">25</div>
      </div>
    </div>
    <div class="box-d-wrap">
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          15812
        </div>
        <div class="text">历史最高</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          91.8%
        </div>
        <div class="text">群众满意度</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          176080
        </div>
        <div class="text">微信关注</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          2270
        </div>
        <div class="text">志愿者</div>
      </div>
    </div>
  </div>
</template>

<script>
import red from '../image/red.png'
import blue from '../image/blue.png'
import green from '../image/green.png'

import boxBg from './status-box.png'

export default {
  data () {
    return {
      red,
      blue,
      green,
      boxBg
    }
  }
}
</script>

<style lang="scss" scoped>
.status-wrap {
  margin-top: 12px;
  .box-a-wrap {
    display: flex;
    justify-content: space-between;
    .urgent {
      background-color: rgba(175, 0, 0, 0.4);
    }
    .general {
      background-color: rgba(14, 178, 255, 0.4);
    }
    .basic {
      background-color: rgba(68, 178, 54, 0.4);
    }
    .box-a {
      width: 125px;
      height: 80px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .text {
        position: absolute;
        top: 2px;
        left: 2px;
        color: #fff;
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
