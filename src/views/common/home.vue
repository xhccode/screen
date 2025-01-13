<template>
  <div id="home">
    <div class="top-line"></div>
    <div class="home-tit">
      <img src="../../assets/img/common/homeLogo.png" alt="" @click="$router.push({ path: '/party' })" style="cursor: pointer" />
      <img src="../../assets/img/common/homeTit.png" alt="" style="height: 70px; margin-bottom: 10px" />
    </div>
    <div class="home-menu">
      <div class="menu-li" v-for="(item, index) in menuList" :key="index" :class="item.class" @click="menuPush(item.url)">
        <span class="label">{{ item.label }}</span
        ><img :src="item.icon" alt="" class="icon" />
      </div>
    </div>
    <div class="command-menu">
      <div class="command-menu-li" v-for="(item, index) in commandMenu" :key="index" :class="item.class" @click="menuPush(item.url, { tab: index })">
        <img :src="item.icon" alt="" class="icon" />
      </div>
    </div>
    <div class="txtL"></div>
    <div class="txtR"></div>
    <div class="home-gear">
      <div class="gear-li" v-for="(item, index) in gearList" :key="index" :class="item.class" @click="menuPush(item.url)">
        <div class="gear-bg"></div>
        <span class="label">{{ item.label }}<br />中心</span>
      </div>
      <div class="gear-li-without-menu" v-for="item in gearWithoutMenuList" :key="item" :class="item">
        <div class="gear-bg"></div>
      </div>
    </div>
  </div>
</template>

<script>
import menuIcon1 from '../../assets/img/home/menuIcon1.png'
import menuIcon2 from '../../assets/img/home/menuIcon2.png'
import menuIcon3 from '../../assets/img/home/menuIcon3.png'
import menuIcon4 from '../../assets/img/home/menuIcon4.png'
import menuIcon5 from '../../assets/img/home/menuIcon5.png'
import commandMenuIcon1 from '../../assets/img/home/xclx.png'
import commandMenuIcon2 from '../../assets/img/home/zxdd.png'
import commandMenuIcon3 from '../../assets/img/home/ychs.png'
export default {
  data () {
    return {
      menuList: [
        {
          label: '指令',
          icon: menuIcon1,
          url: '/instruction',
          class: 'zhil'
        },
        {
          label: '研判',
          icon: menuIcon2,
          url: '/judge',
          class: 'yanp'
        },
        {
          label: '指挥',
          icon: '',
          url: '/command',
          class: 'zhih'
        },
        {
          label: '调度',
          icon: menuIcon3,
          url: '/dispatch',
          class: 'diaod'
        },
        {
          label: '监督',
          icon: menuIcon4,
          url: '/control',
          class: 'jiand'
        },
        {
          label: '服务',
          icon: menuIcon5,
          url: '/service',
          class: 'fuw'
        }
      ],
      gearList: [
        {
          label: '力量管理',
          icon: menuIcon1,
          url: '/power',
          class: 'lil'
        },
        {
          label: '视频能力',
          icon: menuIcon1,
          url: '/video',
          class: 'ship'
        },
        {
          label: '数据汇聚',
          icon: menuIcon1,
          url: '/data',
          class: 'shuj'
        }
      ],
      gearWithoutMenuList: ['gear1', 'gear2', 'gear3', 'gear4', 'gear5'],
      commandMenu: [
        {
          icon: commandMenuIcon1,
          url: '/command',
          class: 'xclx'
        },
        {
          icon: commandMenuIcon2,
          url: '/command',
          class: 'zxdd'
        },
        {
          icon: commandMenuIcon3,
          url: '/command',
          class: 'ychs'
        }
      ]
    }
  },
  created () {
    // API.login.getUserInfo().then((res) => {
    //   if (res.data.code === 1) {
    //     sessionStorage.setItem('userName', res.data.data.realName)
    //     sessionStorage.setItem('account', res.data.data.account)
    //     localStorage.setItem('orgCode', res.data.data.orgCode)
    //   }
    // })
    this.$store.dispatch('updateUserInfo')
  },
  methods: {
    menuPush (url, params) {
      // console.log(params)
      console.log(url)
      if (url === '/command') {
        this.$router.push({ name: 'command', params })
      } else {
        this.$router.push({ path: url })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 100%;
  background: url(../../assets/img/common/homeBg.png) no-repeat center;
  background-size: 100% 100%;
  position: relative;
  .top-line {
    border-top: 1px solid #aeaeae;
    width: 100%;
    position: absolute;
    top: 50px;
  }
  .home-tit {
    position: absolute;
    top: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: auto;
    img {
      height: auto;
    }
  }
  .command-menu {
    position: absolute;
    top: 270px;
    left: 50%;
    .command-menu-li {
      position: absolute;
      cursor: pointer;
      &::after {
        content: '';
        display: block;
        background-image: url(../../assets/img/home/shortLine.png);
        width: 9px;
        height: 53px;
        margin: 12px 0 0 43%;
      }
      &.xclx {
        left: -170px;
        top: 70px;
      }
      &.zxdd {
        left: -45px;
      }
      &.ychs {
        left: 65px;
        top: 45px;
      }
    }
  }
  .txtL {
    position: absolute;
    bottom: 50%;
    left: 250px;
    width: 260px;
    height: 47px;
    background: url(../../assets/img/home/txtL.png) no-repeat center;
    animation-name: txtL;
    animation-duration: 25s;
  }
  @keyframes txtL {
    from {
      left: 0px;
    }
    to {
      left: 250px;
      transition: all 25s;
    }
  }
  .txtR {
    position: absolute;
    bottom: 50%;
    right: 250px;
    width: 260px;
    height: 47px;
    background: url(../../assets/img/home/txtR.png) no-repeat center;
    animation-name: txtR;
    animation-duration: 25s;
  }
  @keyframes txtR {
    from {
      right: 0px;
    }
    to {
      right: 250px;
      transition: all 25s;
    }
  }
  .home-menu {
    position: absolute;
    top: 400px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    .menu-li {
      width: 244px;
      height: 215px;
      background: url(../../assets/img/home/homeMenuBg.png) no-repeat center;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .label {
        font-size: 36px;
        color: #e33531;
        font-family: Microsoft YaHei;
        font-weight: bold;
        /*text-shadow: 0px 7px 0px rgba(83, 83, 83, 0.45);*/
      }
      .icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .menu-li:hover {
      transform: scale(1.05);
      transition: all 1s;
      background: url(../../assets/img/home/homeMenuBgH.png) no-repeat center;
      /*box-shadow: 10px 50px 50px #ddd;*/
    }
    .zhih {
      position: absolute;
      background: url(../../assets/img/home/zhihBg.png) no-repeat center;
      bottom: 50px;
      .label {
        font-size: 48px;
        color: #fff;
      }
    }
    .diaod {
      position: absolute;
      top: 170px;
    }
    .yanp {
      position: absolute;
      right: 435px;
      top: 55px;
    }
    .jiand {
      position: relative;
      left: 191px;
      top: 60px;
    }
    .zhil {
      position: relative;
      right: 140px;
      top: 163px;
    }
    .fuw {
      position: relative;
      left: 140px;
      top: 168px;
    }
  }
  .home-gear {
    position: absolute;
    bottom: 0;
    .gear-li {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .label {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
      }
    }
    .gear-li:hover {
      transform: scale(1.05);
      transition: all 1s;
    }
    .gear-bg {
      -webkit-animation: spin 235s linear infinite;
    }
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
        transition: all 235s;
      }
    }
    .lil {
      position: absolute;
      bottom: 180px;
      left: -18px;
      width: 270px;
      height: 277px;
      font-size: 28px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #da1826;
      .gear-bg {
        width: 270px;
        height: 277px;
        background: url(../../assets/img/home/gear1.png) no-repeat center;
      }
    }
    .ship {
      position: absolute;
      bottom: 207px;
      left: 250px;
      width: 162px;
      height: 162px;
      font-size: 23px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      .gear-bg {
        width: 162px;
        height: 162px;
        background: url(../../assets/img/home/gear2.png) no-repeat center;
      }
    }
    .shuj {
      position: absolute;
      bottom: 0px;
      left: 143px;
      width: 215px;
      height: 215px;
      .gear-bg {
        width: 215px;
        height: 215px;
        background: url(../../assets/img/home/gear3.png) no-repeat center;
      }
      .label {
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 900;
        color: #d91420;
        line-height: 31px;
        // -webkit-text-stroke: 1px #ffffff;
        // text-stroke: 1px #ffffff;
      }
    }
    .gear1 {
      position: absolute;
      bottom: 480px;
      left: -29px;
      width: 65px;
      height: 65px;
      .gear-bg {
        width: 65px;
        height: 65px;
        background: url(../../assets/img/home/gear6.png) no-repeat center;
      }
    }
    .gear2 {
      position: absolute;
      bottom: -187px;
      left: -240px;
      width: 401px;
      height: 402px;
      .gear-bg {
        width: 401px;
        height: 402px;
        background: url(../../assets/img/home/gear4.png) no-repeat center;
      }
    }
    .gear3 {
      position: absolute;
      bottom: 110px;
      left: 352px;
      width: 119px;
      height: 12rem;
      .gear-bg {
        width: 119px;
        height: 12rem;
        background: url(../../assets/img/home/gear8.png) no-repeat center;
      }
    }
    .gear4 {
      position: absolute;
      bottom: -21px;
      left: 335px;
      width: 113px;
      height: 113px;
      .gear-bg {
        width: 113px;
        height: 113px;
        background: url(../../assets/img/home/gear5.png) no-repeat center;
      }
    }
    .gear5 {
      position: absolute;
      bottom: 54px;
      left: 426px;
      width: 74px;
      height: 74px;
      .gear-bg {
        width: 74px;
        height: 74px;
        background: url(../../assets/img/home/gear7.png) no-repeat center;
      }
    }
  }
}
</style>
