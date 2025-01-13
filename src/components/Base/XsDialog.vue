<template>
  <div class="xs-dialog">
    <transition name="fade">
      <el-dialog :visible="visible" ref="dialog__wrapper" :fullscreen="fullscreen" :class="['command-dialog', customerClass]" :width="computedWidth" :show-close="false">
        <!-- 右上角 -->
        <div class="win-head" slot="title">
          <div class="win-title">
            <span class="txt">{{ title }}</span>
          </div>
          <div class="win-ops">
            <div class="op-btn" v-if="minimize" @click="minimize">
              <img class="min-img" src="@/assets/img/command/min.png" />
            </div>
            <div class="op-btn" v-if="maximize" @click="maximize">
              <img class="max-img" src="@/assets/img/command/max.png" />
            </div>
            <div class="op-btn" v-if="close" @click="close">
              <img class="close-img" src="@/assets/img/command/close.png" />
            </div>
          </div>
        </div>
        <!-- 业务逻辑组件 -->
        <div class="dialog-inner" :style="{ height: computedHeight }">
          <slot></slot>
        </div>
      </el-dialog>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'XsDialog',
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: () => false
    },
    minimize: {
      type: Function,
      required: false
    },
    maximize: {
      type: Function,
      required: false
    },
    close: {
      type: Function,
      required: false
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    customerClass: {
      type: String
    }
  },
  data () {
    return {
      window: window
    }
  },
  computed: {
    computedWidth () {
      if (this.width) {
        if (this.width.indexOf('px') > -1) {
          return `${parseInt(this.width) / 10}rem`
        } else {
          return this.width
        }
      }
    },
    computedHeight () {
      if (this.height) {
        if (this.height.indexOf('px') > -1) {
          return `${parseInt(this.height) / 10}rem`
        } else {
          return this.height
        }
      }
    }
  }
}
</script>

<style lang="scss">
@mixin box-sizing {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.xs-dialog {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .command-dialog {
    height: 100vh;
    width: 100vw;
    display: flex;
    .el-dialog {
      margin: auto !important;
      background-color: #284b706e;
      box-shadow: 0 0 15px #fff;
      max-width: 3000px;
      &.is-fullscreen {
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw;
        display: flex;
        flex-direction: column;
        .el-dialog__header {
        }
        .el-dialog__body {
          flex: 1;
          min-height: 0;
          .dialog-inner {
            height: 100% !important;
          }
        }
      }
      .el-dialog__header {
        position: relative;
        @include box-sizing();
        background: url(~@/assets/img/dialog-head-bg.jpg) no-repeat;
        background-size: 100% 100%;
        display: flex;
        padding: 0px;
        .win-head {
          padding: 5px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          .win-title {
            display: flex;
            .txt {
              margin: auto 5px;
              color: #fff;
              font-size: 1.4rem;
            }
          }
          // 左上操作按钮
          .win-ops {
            margin: auto 0 auto auto;
            display: flex;
            justify-content: space-around;
            .op-btn {
              margin: 0.5rem;
              padding: 0.5rem;
              display: flex;
              cursor: pointer;
              &:hover {
                box-shadow: 0px 0px 0.5rem #18daba;
              }
              > img {
                margin: auto;
                cursor: pointer;
                height: 1.2rem;
                width: 1.2rem;
                object-fit: scale-down;
              }
            }
          }
        }
      }
      .el-dialog__body {
        padding: 0;
        box-sizing: border-box;
        .dialog-inner {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
