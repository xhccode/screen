<template>
  <div class="login-box">
    <div class="img-bg">
      <img src="/static/img/loginbg.jpg" alt="" />
    </div>
    <!-- 头部 -->
    <div class="lb-head">
      <div class="flag">
        <img src="@/assets/img/common/homeLogo.png" />
      </div>
      <div class="title">
        <span class="txt">{{ appName }}</span>
      </div>
    </div>
    <!-- 底部 -->
    <div class="lb-foot">
      <!-- 日期 -->
      <div class="curr-date">
        <span class="txt bigger">{{ currTime }}</span>
        <span class="txt">{{ currDate }}</span>
      </div>
      <!-- 按钮 -->
      <transition name="fade">
        <div class="login-bar" @click="visible = true" v-show="visible === false">
          <div class="txt xs-lianyi-circle" slot="refrence">
            <i class="txt el-icon-user center-dot"></i>
          </div>
          <span class="txt">登录</span>
        </div>
      </transition>
    </div>
    <!-- 登录表单 -->
    <el-drawer title="我是标题" custom-class="login-drawer" :visible.sync="visible" direction="rtl" :modal="false" :with-header="false">
      <div class="login-wrapper">
        <el-tabs :stretch="false" v-model="active">
          <el-tab-pane name="form" label="账号登录">
            <el-form :model="user" ref="loginForm" :rules="rules">
              <el-form-item prop="loginName">
                <el-input v-model="user.loginName">
                  <i class="el-icon-user" slot="prefix"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" v-model="user.password" @keyup.native.enter.prevent.stop="login">
                  <i class="el-icon-lock" slot="prefix"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading" @click.prevent.stop="login">
                  <div class="btn-txt-wrapper">
                    <span class="txt">登</span>
                    <span class="txt">录</span>
                  </div>
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="qr" label="扫码登录">
            <div class="qr-box">
              <img src="@/assets/img/qr.png" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import API from '@/api'
import STATE from '@/store/States'
export default {
  name: 'Login',
  data () {
    return {
      timer: -1,
      currTime: '',
      currDate: '',
      visible: false,
      loading: false,
      active: 'form',
      user: {
        loginName:'Dwxxs003',
        password:'qw12mk'
      },
      rules: {
        loginName: { required: true, message: '请输入账号', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' }
      }
    }
  },
  computed: {
    appName () {
      return process.env.VUE_APP_NAME
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.currTime = this.$fmt(new Date(), 'HH:mm')
      this.currDate = this.$fmt(new Date(), 'YYYY/MM/DD，dddd')
    }, 1000)
  },
  methods: {
    // 登录
    login () {
      this.$refs.loginForm.validate(valid => {
        if (valid === true) {
          this.loading = true
          API.login
            .login(this.user)
            .then(({ data: { data, code, msg } }) => {
              if (code === 1) {
                API.command.login30(this.user.loginName)
                  .then(res => {
                    if (res.status == 200) {
                      const token = res.data.data.authorizationCode
                      localStorage.setItem('authPC', token)
                    }
                  })
                  .catch((err) => {
                    console.info(err)
                  })
                this.$store.commit(STATE.AUTHORIZATION_CODE, data.authorizationCode)
                localStorage.setItem('auth', data.authorizationCode)
                localStorage.setItem('loginName', this.user.loginName)
                API.login
                  .getUserInfo()
                  .then(({ data: { data, code, msg } }) => {
                    this.loading = false
                    if (code === 1) {
                      this.$store.commit(STATE.USER_INFO, data)
                      this.$router.replace({ name: 'Dashboard' })
                      API.map.getOrgRegionalBoundary({ orgCode: data.orgCode }).then(({ data: { data } }) => {
                        this.$store.commit(STATE.USER_ORG, data)
                      })
                    }
                  })
                  .catch(e => {
                    this.loading = false
                    this.$notify({
                      type: 'warning',
                      message: e.message
                    })
                  })
              } else {
                this.loading = false
                this.$notify({
                  type: 'warning',
                  message: msg
                })
              }
            })
            .catch(e => {
              this.loading = false
              this.$notify({
                type: 'warning',
                message: e.message
              })
            })
        }
      })
    }
  },
  beforeDestroy () {
    if (this.timer > -1) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style scoped lang="scss">
.login-box {
  height: 100vh;
  width: 100vw;
  position: fixed;
  .img-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .lb-head {
    margin-top: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    .flag {
      margin: auto 0;
      img {
        height: 8rem;
        object-fit: scale-down;
      }
    }
    .title {
      margin: auto 0;
      .txt {
        font-size: 6rem;
        font-weight: bolder;
        color: #fff;
        text-shadow: 0 0 1.5rem #000;
      }
    }
  }
  .lb-foot {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 250px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .curr-date {
      padding: 25px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .txt {
        font-size: 60px;
        color: #fff;
        &.bigger {
          font-size: 100px;
          font-weight: bolder;
        }
      }
    }
    .login-bar {
      cursor: pointer;
      margin: auto 0;
      height: 48px;
      width: 12rem;
      border-radius: 24px 0 0 24px;
      box-shadow: 0 0 15px #fff;
      display: flex;
      justify-content: center;
      .txt {
        margin: auto;
        color: #fff;
        font-size: 24px;
        letter-spacing: 5px;
        &.center-dot {
          color: #6cb552;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.login-drawer {
  box-shadow: none !important;
  background: transparent !important;
  overflow: visible;
  width: 400px !important;
  @media screen and (min-width: 3600px) {
    width: 500px !important;
  }
  .el-drawer__body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .login-wrapper {
      width: 100%;
      height: 430px;
      @media screen and (min-height: 1200px) {
        height: 500px;
      }
      display: flex;
      padding: 25px 35px;
      .el-tabs {
        flex: 1;
        min-width: 0;
        // background: #fff;
        background: rgba(100, 102, 107, 0.8);
        box-shadow: 0 0 15px #000;
        display: flex;
        flex-direction: column;
        .el-tabs__header {
          height: 80px;
          width: 100%;
          padding: 25px 10px 10px 10px;
          margin: 0;
          .el-tabs__nav-wrap {
            width: 100%;
            &::after {
              background-color: transparent;
            }
            .el-tabs__active-bar {
              height: 2px;
              background-color: #fff;
            }
            .el-tabs__nav-scroll {
              width: 100%;
              display: flex;
              .el-tabs__nav {
                margin: auto;
                padding-bottom: 8px;
                .el-tabs__item {
                  text-align: center;
                  font-size: 20px;
                  @media screen and (min-width: 3600px) {
                    font-size: 30px;
                  }
                  color: #fff;
                  opacity: 0.3;
                  &.is-active {
                    opacity: 1;
                    text-shadow: 0 0 5px #262e5e;
                  }
                  &:focus {
                    box-shadow: none !important;
                  }
                }
              }
            }
          }
        }
        .el-tabs__content {
          flex: 1;
          min-height: 0;
          width: 100%;
          .el-tab-pane {
            height: 100%;
            padding: 15px;
            .el-form {
              height: 100%;
              padding: 15px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              .el-form-item {
                margin-bottom: 22px;
                .el-form-item__content {
                  line-height: 40px;
                  .el-input {
                    .el-input__prefix {
                      height: 42px;
                      line-height: 42px;
                      @media screen and (min-height: 1200px) {
                        height: 60px;
                        line-height: 60px;
                      }
                      font-size: 1.4rem;
                      font-weight: bold;
                      color: #fff;
                    }
                    .el-input__inner {
                      padding-left: 40px;
                      font-size: 1rem;
                      background: transparent;
                      color: #fff;
                      height: 42px;
                      line-height: 42px;
                      @media screen and (min-height: 1200px) {
                        padding-left: 60px;
                        height: 60px;
                        line-height: 60px;
                      }
                    }
                  }
                  .el-form-item__error {
                    padding-top: 10px;
                    color: #fff;
                  }
                  .el-button {
                    width: 100%;
                    background: #262f5f;
                    display: flex;
                    justify-content: center;
                    height: 42px;
                    padding: 0 2rem;
                    @media screen and (min-height: 1200px) {
                      height: 60px;
                      line-height: 60px;
                    }
                    > i {
                      margin: auto 0;
                      color: #fff;
                      font-size: 1.4rem;
                    }
                    > span {
                      margin: auto 0;
                      width: 8rem;
                      .btn-txt-wrapper {
                        width: 100%;
                        display: flex;
                        justify-content: space-evenly;
                        .txt {
                          color: #fff;
                          font-size: 1.4rem;
                          font-weight: bold;
                        }
                      }
                    }
                  }
                }
              }
            }
            .qr-box {
              height: 100%;
              width: 100%;
              display: flex;
              img {
                margin: auto;
                width: 90%;
                height: 90%;
                object-fit: contain;
              }
            }
          }
        }
      }
    }
  }
}
</style>
