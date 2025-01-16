<template>
  <div class="status-wrap">
    <div class="box-b-wrap">
      <div class="box-b green">
        <div class="text">待分派</div>
        <div class="number">{{ num.toBeDispatchNum }}</div>
      </div>
      <div class="box-b blue">
        <div class="text">处置中</div>
        <div class="number">{{ num.disposalNum }}</div>
      </div>
      <div class="box-b gray">
        <div class="text">评价中</div>
        <div class="number">{{ num.evaluationNum }}</div>
      </div>
    </div>
    <div class="box-c-wrap">
      <div class="divider"></div>
      <div class="strange-box">
        <div class="container"></div>
        <div class="container"></div>
      </div>
    </div>
    <div class="box-d-wrap">
      <div class="box-b" :style="`background-image:url(${yellow})`">
        <div class="text">办理中</div>
        <div class="number">{{ num.processNum }}</div>
      </div>
      <div class="box-b" :style="`background-image:url(${orange})`">
        <div class="text">催办中</div>
        <div class="number">{{ num.urgeNum }}</div>
      </div>
      <div class="box-b" :style="`background-image:url(${red})`">
        <div class="text">督办中</div>
        <div class="number">{{ num.superviseNum }}</div>
      </div>
    </div>
    <div class="box-e-wrap">
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          52
        </div>
        <div class="text">历史最高</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          99.99%
        </div>
        <div class="text">群众满意度</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          287
        </div>
        <div class="text">微信关注</div>
      </div>
      <div class="item">
        <div class="box" :style="`background-image:url(${boxBg})`">
          70
        </div>
        <div class="text">志愿者</div>
      </div>
    </div>
  </div>
</template>

<script>
import yellow from './bg1.png'
import orange from './bg2.png'
import red from './bg3.png'

import boxBg from './status-box.png'

export default {
  props: ['num'],
  data () {
    return {
      yellow,
      orange,
      red,
      boxBg
    }
  }
}
</script>

<style lang="scss" scoped>
.status-wrap {
  margin-top: 12px;
  .box-b-wrap {
    margin-top: 16px;
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
  .box-c-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .divider {
      width: 2px;
      height: 40px;
      background-color: #ccc;
    }
    .strange-box {
      display: flex;
      justify-content: center;
      .container {
        width: 145px;
        height: 45px;
        box-sizing: border-box;
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
    }
  }
  .box-d-wrap {
    display: flex;
    justify-content: space-between;
    .box-b {
      width: 125px;
      height: 32px;
      line-height: 32px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      color: #fff;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      .text {
        font-size: 1.3rem;
        font-weight: bold;
      }
      .number {
        font-size: 30px;
        font-weight: bold;
      }
    }
  }
  .box-e-wrap {
    margin-top: 30px;
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
