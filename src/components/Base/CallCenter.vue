<template>
  <xs-dialog :visible="visible" :fullscreen="fullscreen" :title="title" :minimize="minimize" :maximize="maximize" :width="width" height="60vh" :close="close">
    <div class="center-dialog-body">
      <div class="dialog-top">
        <div class="top-left">
          <el-image v-if="imgList.workSceneImage" lazy :src="imgList.workSceneImage" fit="fill" />
        </div>
        <div class="top-center">
          <el-image v-if="imgList.gatehouseImage" lazy :src="imgList.gatehouseImage" fit="fill" />
          <el-image v-if="imgList.listedImage" lazy :src="imgList.listedImage" fit="fill" />
        </div>
        <div class="top-right">
          <div class="info-item">
            <div class="title">
              <span class="txt">中心地址</span>
            </div>
            <div class="content">
              <span class="txt">{{ this.regionalData.orgName }}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="title">
              <span class="txt">值班人员列表</span>
            </div>
            <div class="info-item-content">
              <div class="user" v-for="(item, index) in listPeople" :key="index">
                <div class="img-box">
                  <i class="iconfont icon-zhanghao" :class="[item.$timOnline ? 'online' : 'offline']"></i>
                </div>
                <div class="name">
                  <span class="txt">{{ item.name }}</span>
                </div>
                <div class="phone">
                  <span class="txt">{{ item.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-bottom">
        <div class="bi-wrapper" v-for="(item, index) in listPeople" :key="index">
          <div class="bottom-item">
            <div class="img-info">
              <el-image class="avtar" :src="item.url" fit="fill" />
              <!-- 如果是党员，则显示党旗 -->
              <div class="ib-inner" v-if="item.dangyuan">
                <i class="iconfont icon-dangjian"></i>
              </div>
            </div>
            <div class="item-info">
              <div class="ii">
                <span class="label name">姓名</span>
                <span class="value">{{ item.name }}</span>
              </div>
              <div class="ii">
                <span class="label name">职位</span>
                <span class="value">{{ item.post }}</span>
              </div>
              <div class="ii">
                <span class="label name">电话</span>
                <span class="value">{{ item.phone }}</span>
              </div>
              <div class="ii">
                <span class="label name">状态</span>
                <span class="value">{{ item.onDuty }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </xs-dialog>
</template>

<script>
import windowOp from '@/components/command/windowOp.js'
import XsDialog from '@/components/Base/XsDialog.vue'
import API from '@/api'
import LOG from '@/utils/logger'

export default {
  name: 'CallCenter',
  components: { XsDialog },
  props: {
    regionalData: Object
  },
  mixins: [windowOp],
  mounted () {},
  data () {
    return {
      listPeople: [],
      imgList: {}
    }
  },
  created () {
    let data = { pageSize: 500, currPage: 1, orgCode: this.regionalData.orgCode, queryType: 3 }
    // let data = { pageSize: 500, currPage: 1, orgCode: '320205' }
    API.command.queryPageForCenterUser(data).then(res => {
      let powers = res.data.data
      if (powers && powers.length) {
        // API.login.batchQueryUserstate(powers).then(powers => {
          this.listPeople = powers
        // })
      }
    })
    this.getCenterBackground(this.regionalData.orgCode)
  },
  methods: {
    getCenterBackground (orgCode) {
      API.command.getCenterBackground({ orgCode }).then(
        ({
          data: {
            data: { wangge }
          }
        }) => {
          LOG.dir(wangge)
          this.imgList = wangge
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.center-dialog-body {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .dialog-top {
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    padding: 5px;
    .top-left {
      flex: 1;
      min-width: 0;
      padding: 5px 0 0 5px;
      .el-image {
        width: 100%;
        height: 100%;
        padding: 5px 0;
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }
    .top-center {
      flex: 0.6;
      min-width: 0;
      display: flex;
      flex-direction: column;
      padding: 5px;
      .el-image {
        flex: 1;
        min-height: 0;
        display: flex;
        padding: 5px;
        &:last-child {
          padding-bottom: 0;
        }
        img {
          margin: auto;
          height: 100%;
          width: 100%;
          object-fit: scale-down;
        }
      }
    }
    .top-right {
      flex: 0.6;
      min-width: 0;
      height: 100%;
      padding: 5px;
      display: flex;
      flex-direction: column;
      .info-item {
        &:first-child {
          width: 100%;
          display: flex;
          color: #fff;
          font-size: 1.4rem;
          font-weight: bold;
          .title {
            display: flex;
            .txt {
              margin: auto 5px;
            }
          }
          .content {
            flex: 1;
            min-width: 0;
            height: 40px;
            display: flex;
            .txt {
              margin: auto 5px;
            }
          }
        }
        &:last-child {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          .title {
            height: 40px;
            width: 100%;
            display: flex;
            .txt {
              color: #fff;
              font-size: 1.4rem;
              font-weight: bolder;
              margin: auto 5px;
            }
          }
          .info-item-content {
            flex: 1;
            min-height: 0;
            width: 100%;
            overflow: hidden;
            overflow-y: auto;
            padding: 5px;
            &::-webkit-scrollbar {
              display: none;
            }
            .user {
              min-height: 24px;
              width: 100%;
              &:hover {
                box-shadow: 0 0 5px #fff;
              }
              display: flex;
              .img-box {
                display: flex;
                .iconfont {
                  margin: auto;
                  &.online {
                    color: #19dcbc;
                  }
                  &.offline {
                    color: #737373;
                  }
                }
              }
              .name {
                flex: 1;
                min-width: 0;
                display: flex;
                .txt {
                  color: #fff;
                  font-size: 1.08rem;
                  margin: auto 5px;
                }
              }
              .phone {
                display: flex;
                .txt {
                  margin: auto 5px;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
  .dialog-bottom {
    height: 150px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    overflow-x: auto;
    &::-webkit-scrollbar {
      height: 0.6rem;
      border-radius: 0.3rem;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      display: block;
      margin: 0 auto;
      border-radius: 0.3rem;
      background: rgb(44, 68, 105);
    }
    padding: 0 5px 5px 5px;
    .bi-wrapper {
      display: inline-block;
      height: 100%;
      padding: 5px;
      .bottom-item {
        min-width: 25rem;
        background: #f5f7fa;
        height: 100%;
        display: flex;
        .img-info {
          height: 100%;
          .el-image {
            width: 10rem;
            height: 100%;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          position: relative;
          .ib-inner {
            position: absolute;
            top: 5px;
            left: 5px;
            .iconfont {
              color: #ff0000;
            }
          }
        }
        .item-info {
          flex: 1;
          min-width: 0;
          height: 100%;
          color: #000;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          .ii {
            min-height: 24px;
            line-height: 1.6;
            width: 100%;
            display: flex;
            .label {
              margin: auto 5px;
              &::after {
                content: ':';
              }
            }
            .value {
              flex: 1;
              min-width: 0;
              margin: auto 5px;
              display: flex;
              .txt {
                margin: auto 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
          position: relative;
          .op-box {
            position: absolute;
            bottom: 0.5rem;
            right: 1rem;
            width: 4rem;
            display: flex;
            .btn {
              height: 3.2rem;
              line-height: 3.2rem;
              border-radius: 1.6rem;
              margin: auto;
              padding: 0px 10px;
              cursor: pointer;
              &.online {
                &:hover {
                  box-shadow: 0 0 5px #000;
                }
                i {
                  color: yellowgreen;
                  cursor: pointer;
                }
              }
              i {
                color: #eee;
                cursor: not-allowed;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and(min-width: 3600px) {
  .center-dialog-body {
    .dialog-bottom {
      height: 12rem;
    }
  }
}
</style>
