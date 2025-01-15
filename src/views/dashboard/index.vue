<!--
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-14 23:52:54
 * @FilePath: /visualization/src/Dashboard/index.vue
-->
<template>
  <div class="dashboard-wrap">
    <div class="video">
      <video style="width: 100%; height: 100%; object-fit: cover" :src="video" autoplay loop muted />
    </div>
    <div ref="container" class="bo"></div>
    <div class="ability">
      <Button active class="item-left" @click.native="$router.push('/datahome')">
        善治
      </Button>
      <Button class="item-right">
        优政
      </Button>
      <Button class="item-left">
        便民
      </Button>
      <Button class="item-right">兴业 </Button>
      <Button class="item-left">
        强基
      </Button>
      <Button class="item-right">
        利社
      </Button>
    </div>
    <div class="power">
      <div class="power-item">
        <Power title="跨越" text="指挥架构五跨越" @mouseenter.native="power1 = true" @mouseleave.native="power1 = false" />
        <transition name="fade">
          <power-button v-if="power1" style="position: absolute; left: -100px; top: 60px">跨部门</power-button>
        </transition>
        <transition name="fade">
          <power-button v-if="power1" style="position: absolute; left: -50px; top: -40px">跨层级</power-button>
        </transition>
        <transition name="fade">
          <power-button v-if="power1" style="position: absolute; left: 50px; top: -100px">跨地域</power-button>
        </transition>
        <transition name="fade">
          <power-button v-if="power1" style="position: absolute; left: 160px; top: -40px">跨业务</power-button>
        </transition>
        <transition name="fade">
          <power-button v-if="power1" style="position: absolute; left: 210px; top: 60px">跨系统</power-button>
        </transition>
      </div>
      <div class="power-item" style="align-self: flex-end">
        <Power title="统一" text="治理体系四统一" @mouseenter.native="power2 = true" @mouseleave.native="power2 = false" />
        <transition name="fade">
          <power-button v-if="power2" style="position: absolute; left: -100px; top: 12rem"
            ><div>统一</div>
            指挥调度</power-button
          >
        </transition>
        <transition name="fade">
          <power-button v-if="power2" style="position: absolute; left: -100px; top: 0px"
            ><div>统一</div>
            力量管理</power-button
          >
        </transition>
        <transition name="fade">
          <power-button v-if="power2" style="position: absolute; left: 12rem; top: 210px"
            ><div>统一</div>
            数据维护</power-button
          >
        </transition>
        <transition name="fade">
          <power-button v-if="power2" style="position: absolute; left: 140px; top: -60px"
            ><div>统一</div>
            事件处理</power-button
          >
        </transition>
      </div>
      <div class="power-item">
        <Power title="融合" text="数字底座三融合" @mouseenter.native="power3 = true" @mouseleave.native="power3 = false" />
        <transition name="fade">
          <power-button v-if="power3" style="position: absolute; left: -100px; top: 12rem"> 技术融合</power-button>
        </transition>
        <transition name="fade">
          <power-button v-if="power3" style="position: absolute; left: 60px; top: 210px">
            数据融合
          </power-button>
        </transition>
        <transition name="fade">
          <power-button v-if="power3" style="position: absolute; left: 200px; top: 140px">
            业务融合
          </power-button>
        </transition>
      </div>
    </div>
    <div style="position: absolute; bottom: 0; width: 100%; z-index: 20">
      <div
        style="
                    margin: auto;
                    width: 1000px;
                    display: flex;
                    justify-content: space-between;
                "
      >
        <BottomButtom text="数字经济" />
        <BottomButtom highLight text="数字政府" style="margin-top: -40px" />
        <BottomButtom text="数字生活" />
      </div>
    </div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import STATE from '@/store/States'
import Button from './components/Button'
import Power from './components/Power'
import PowerButton from './components/PowerButton'
import BottomButtom from './components/BottomButton'
import API from '@/api'

import { renderALayer } from './ARing'
import { renderBLayer } from './BRing'
import { renderCLayer } from './CRing'
import { renderDLayer } from './DRing'

import video from './video.mp4'
const scaleY = Math.tan((15 * Math.PI) / 180)
const app = new PIXI.Application({
  antialias: true,//default: false 反锯齿
  backgroundAlpha: 0,//设置背景颜色透明度   0是透明
})
export default {
  components: { Button, Power, BottomButtom, PowerButton },
  data () {
    return {
      power1: false,
      power2: false,
      power3: false,
      video
    }
  },
  mounted () {
    app.renderer.view.style.position = 'absolute'
    app.renderer.view.style.display = 'block'
    app.renderer.autoResize = true
    app.renderer.resize(window.innerWidth, window.innerHeight)

    this.$refs.container.appendChild(app.view)
    // // 网格员信息
    // renderDLayer(app, scaleY, false)
    // // 社区信息
    // renderCLayer(app, scaleY, false)
    // // 街道信息
    // setTimeout(() => {
    //   renderBLayer(app, scaleY, false, router, this.$store.state[STATE.USER_ORG].orgCode)
    // }, 200)
    // // 顶部
    // renderALayer(app, scaleY)
    setTimeout(() => {
      this.initRender()
    }, 200)
  },
  methods: {
    initRender () {
      // 街道信息
      let router = this.$router
      let orgCode = this.$store.state[STATE.USER_ORG].orgCode
      orgCode = orgCode == '320205' ? '320205005000' : orgCode // 锡山区默认厚桥街道
      Promise.all([
        API.dashboard.getGeneralPortalInfo({
          orgCode: orgCode
        }),
        API.command.getPowerTabsData({
          currPage: 1,
          pageSize: 80,
          type: 1,
          orgCode: orgCode
        })
      ]).then(res => {
        if (res[0].data.code === 1) {
          // 社区信息
          renderCLayer(
            app,
            scaleY,
            false,
            res[0].data.data.map(item => {
              return item.areaName
            })
          )
        }
        if (res[1].data.code === 1) {
          // 网格员信息
          renderDLayer(
            app,
            scaleY,
            false,
            res[1].data.data.list.map(item => {
              return item.name
            })
          )
        }
        renderBLayer(app, scaleY, false, router, orgCode)
        // 顶部
        renderALayer(app, scaleY)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-wrap {
  color: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  .video {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
    background-color: #00a6f3;
  }
  .ability {
    position: absolute;
    height: 100vh;
    width: 280px;
    left: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 40px;
    z-index: 99;
    .item-left {
      margin-bottom: 40px;
    }
    .item-right {
      margin-left: 12rem;
      margin-bottom: 40px;
    }
  }
  .bo {
    position: absolute;
    z-index: 10;
  }
  .power {
    height: 100vh;
    width: 350px;
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 40px;
    z-index: 99;
    .move-to-left {
      margin-left: -260px;
    }
    .power-item {
      position: relative;
      margin-bottom: 2rem;
    }
    .enter {
      animation: enter linear 0.5s;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
