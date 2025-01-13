<template>
  <div class="addconnect">
    <div class="addConnect-content">
      <img class="close" src="@/assets/img/command/close.png" @click="close" alt="" />
      <div class="search">
        <el-dropdown @command="handleFilter">
          <el-button
            style="
              border: none !important;
              background: rgba(255, 255, 255, 0.3);
              color: #fff !important;
              opacity: 0.9;
            "
          >
            {{ filterKey.nm }}<i class="el-icon-caret-bottom"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in filterList" :key="index" :command="item">{{ item.nm }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="serarch-ipt">
          <i class="search-icon" @click="handleSearch"></i>
          <input class="ipt" v-model="searchKey" placeholder="请输入关键字搜索" />
        </div>
      </div>
      <div class="data-wrap data-collect">
        <div class="data-tabs">
          <div class="tab-item">
            <el-button @click="handleSwitchTab(1)" :class="[{ 'tab-btn-active': curTab === 1 }, 'tab-btn']" style="color: #fff !important; border: none !important">治理力量</el-button>
            <el-button @click="handleSwitchTab(2)" :class="[{ 'tab-btn-active': curTab === 2 }, 'tab-btn']" style="color: #fff !important; border: none !important">监控点位</el-button>
          </div>
          <div class="list" v-bar v-show="curTab === 1">
            <ul class="tab-pannel">
              <li class="contact-item" v-for="(item, index) in powerList" :key="item.id" :data-index="index" @click="handleSelect(index)">
                <div class="contact-name">
                  {{ item.name || item.realName }}
                </div>
                <img class="contact-select-st" src="@/assets/img/command/white-select-icon.png" />
                <img v-show="item.check" class="contact-select-st contact-icon-select" src="@/assets/img/command/select.png" />
              </li>
            </ul>
          </div>
          <div class="list" v-bar v-show="curTab === 2">
            <ul class="tab-pannel">
              <li class="contact-item" v-for="(item, index) in monitorList" :key="item.autoId" :data-index="index" @click="handleSelectMonitor(index)">
                <div class="monitor-name">
                  {{ item.address || item.monitorAddressName }}
                </div>
                <img class="contact-select-st" src="@/assets/img/command/white-select-icon.png" />
                <img v-show="item.check" class="contact-select-st contact-icon-select" src="@/assets/img/command/select.png" />
              </li>
            </ul>
          </div>

          <div class="operation">
            <el-button
              class="operation-btn"
              style="
                background-color: #178ace !important;
                color: #fff !important;
              "
              @click="handleCantact"
            >
              <span class="btn"> 加入会议 </span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkedPowers: {
      type: Array,
      default: []
    },
    checkedMonitors: {
      type: Array,
      default: []
    },
    addCantacts: undefined,
    addMonitors: undefined,
    circleOption: {
      longitude: undefined,
      latitude: undefined,
      scope: 1
    }
  },
  data () {
    return {
      filterList: [
        {
          nm: '雪亮工程',
          type: 1
        },
        {
          nm: '重点地标',
          type: 2
        },
        {
          nm: '网格中心',
          type: 3
        },
        {
          nm: '锡山视频云',
          type: 5
        }
      ],
      curTab: 1,
      filterKey: {
        nm: '筛选',
        type: 0
      },
      searchKey: '',
      input: '',
      monitorList: [], // 监控点位的列表
      monitorCheckList: [], // 监控点位选中的列表
      powerList: [], // 要展示的列表
      powerCheckList: [] // 治理力量选中的列表
    }
  },
  mounted () {
    this.getPowersData()
  },
  methods: {
    // 点击搜索按钮进行搜索
    handleSearch () {
      // 筛选下拉框 默认没有选择（展示治理力量和事件）
      //  this.handleSwitchTab(this.filterKey.type)
      if (this.curTab == 1) {
        this.getPowersData()
      } else {
        this.getMonitorData()
      }
    },
    getPowersData () {
      if (this.circleOption && this.circleOption.longitude) {
        let data = {
          queryType: 1,
          monitorSource: '5',
          address: this.searchKey,
          orgCode: 320205
        }
        data.longitude = this.circleOption.longitude
        data.latitude = this.circleOption.latitude
        data.scope = this.circleOption.scope
        API.command.getGeospatialData(data).then(res => {
          let { data, code } = res.data
          data.forEach(item => {
            item.check = false
            item.autoId = item.primaryKey
          })
          this.powerList = this.handleDuplicateHostor(data, this.checkedPowers)
          this.initChecked(this.powerList, this.checkedPowers)
        })
      } else {
        let data = {
          pageSize: 999,
          currPage: 1,
          monitorSource: 5,
          keyword: this.searchKey,
          type: '1'
        }
        API.command.getPowerTabsData(data).then(res => {
          if (res.data.code === 1) {
            res.data.data.list.forEach(item => {
              item.check = false
            })
            this.powerList = this.handleDuplicateHostor(res.data.data.list, this.checkedPowers)
            this.initChecked(this.powerList, this.checkedPowers)
          }
        })
      }
    },
    getMonitorData () {
      if (this.circleOption && this.circleOption.longitude) {
        let data = {
          queryType: 2,
          monitorSource: '5',
          keyword: this.searchKey,
          type: '2'
        }
        data.longitude = this.circleOption.longitude
        data.latitude = this.circleOption.latitude
        data.scope = this.circleOption.scope
        API.command.getGeospatialData(data).then(res => {
          let { data, code } = res.data
          data.forEach(item => {
            item.check = false
            item.autoId = item.primaryKey
          })
          this.monitorList = data
          this.initChecked(this.monitorList, this.checkedMonitors)
        })
      } else {
        let data = {
          pageSize: 500,
          currPage: 1,
          keyword: this.searchKey,
          type: '2'
        }
        API.command.getPowerTabsData(data).then(res => {
          if (res.data.code === 1) {
            res.data.data.list.forEach(item => {
              item.check = false
            })
            this.monitorList = res.data.data.list
            this.initChecked(this.monitorList, this.checkedMonitors)
          }
        })
      }
    },
    handleDuplicateHostor (originArr) {
      let _this = this
      return originArr.filter((item, idx) => {
        return item.account != _this.$store.state.UserInfo.account
      })
    },
    initChecked (originArr, checkedArr) {
      return originArr.map((item, idx) => {
        if (_.indexOf(checkedArr, { account: item.account }) >= 0) {
          item.check = true
        }
      })
    },
    handleFilter (command) {
      this.filterKey = Object.assign({}, command)
      this.getPowerTabsData(2, command.type) // 监控点位下拉框
    },
    // 切换tab
    handleSwitchTab (val) {
      this.filterKey = {
        nm: '筛选',
        type: 0
      }
      this.curTab = val
      if (val == 1) {
        this.getPowersData()
      } else {
        this.getMonitorData()
      }
    },
    handleSelect (idx) {
      this.powerList[idx].check = !this.powerList[idx].check
      // var check = this[type][idx].check
      // this[type][idx].check = !check1
      this.powerCheckList = this.powerList.filter(item => item.check)
      // this.videoDataCheck = this.powerCheckList.concat(this.monitorCheckList)
      // console.log(this.videoDataCheck)
    },
    handleSelectMonitor (idx) {
      this.monitorList[idx].check = !this.monitorList[idx].check
      this.monitorCheckList = this.monitorList.filter(item => item.check)
      this.videoDataCheck = this.powerCheckList.concat(this.monitorCheckList)
    },
    handleCantact () {
      console.log(this.videoDataCheck)
      this.addCantacts(this.powerCheckList)
      this.addMonitors(this.monitorCheckList)
    },
    close () {
      this.$emit('closeAddConnect', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.addconnect {
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  width: 380px;
  height: 368px;
  padding: 32px 2rem 18px 2rem;
  box-sizing: border-box;
  background: rgba(81, 81, 81, 0.9);
  .list {
    height: 170px;
    margin-bottom: 25px;
    .tab-pannel {
      width: 100%;
      color: #fff;
      box-sizing: border-box;
      padding-right: 15px;
      // width: calc(100% + 34px) !important;
      .contact-item {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        background: url('../../../assets/img/command/map-circle-nm.png') no-repeat;
        margin-bottom: 5px;
        position: relative;
      }
      .contact-name {
        display: inline-block;
        // width: 50px;
        text-align: justify;
        letter-spacing: 0;
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .monitor-name {
        display: inline-block;
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 10px;
      }
      .contact-select-st {
        position: absolute;
        width: 13px;
        right: 10px;
        top: 8.5px;
      }
      // .contact-icon-select {
      //   position: absolute;
      //   width: 2rem;
      //   right: 5px;
      // }
    }
  }
  .addConnect-content {
    position: relative;
    .close {
      position: absolute;
      top: -2rem;
      right: -8px;
      width: 14px;
    }
    .search {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      .el-dropdown {
        height: 35px;
        // width: 80px;
        margin-right: 2px;
        .el-button--default {
          height: 35px;
          // width: 80px;
        }
      }
      .serarch-ipt {
        flex: 1;
        position: relative;
        .search-icon {
          display: inline-block;
          height: 35px;
          width: 35px;
          background: url('../../../assets/img/command/search-icon.png') 10px center no-repeat;
          position: absolute;
        }
      }
      .ipt {
        outline: none;
        border: none;
        max-width: 297px;
        height: 35px;
        width: 85%;
        background-color: rgba(255, 255, 255, 0.3) !important;
        padding-left: 40px;
        font-size: 1.3rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;

        &::-webkit-input-placeholder {
          /* WebKit, Blink, Edge */
          font-size: 1.3rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
        }
      }
      // .ipt {
      //   outline: none;
      //   border: none;
      //   max-width: 297px;
      //   height: 35px;
      //   flex: 1;
      //   background: url("../../assets/img/command/search-icon.png") 10px center
      //     no-repeat;

      //   background-color: rgba(255, 255, 255, 0.3) !important;
      //   padding-left: 40px;
      //   font-size: 1.3rem;
      //   font-family: Microsoft YaHei;
      //   font-weight: 400;
      //   color: #ffffff;

      //   &::-webkit-input-placeholder {
      //     /* WebKit, Blink, Edge */
      //     font-size: 1.3rem;
      //     font-family: Microsoft YaHei;
      //     font-weight: 400;
      //     color: #ffffff;
      //   }
      // }
      /deep/ .el-button--default {
        height: 35px;
      }
    }
    .data-wrap {
    }
    .data-collect {
      .tab-item {
        display: flex;
        justify-content: space-around;
        margin-bottom: 5px;
        .tab-btn {
          display: inline-block;
          height: 40px;
          width: 185px;
          border: none;
          background: rgba(80, 191, 255, 0.4);
          // opacity: 0.4;
          color: #fff;
          font-size: 1.3rem;
        }
        .tab-btn-active {
          background: #50bfff;
        }
      }

      // .tab-pannel {
      //   padding-left: 2rem;
      //   color: #007fc4;

      //   margin-bottom: 2rem;

      //   .contact-item {
      //     display: flex;
      //     align-items: center;
      //     height: 40px;
      //   }
      //   .contact-name {
      //     color: #007fc4;
      //     margin: 0 25px;
      //     width: 50px;
      //     letter-spacing: 0;
      //     flex: 1;
      //     flex-shrink: 0;
      //     span {
      //       display: inline-block;
      //       width: 50px;
      //       text-align: justify;
      //       text-align-last: justify;
      //     }
      //   }
      //   .checked-box {
      //     width: 16px;
      //     height: 16px;
      //     position: relative;
      //     .contact-icon-select {
      //       position: absolute;
      //       top: -2px;
      //     }
      //   }
      // }
      .operation {
        text-align: center;
        .operation-btn {
          display: inline-block;
          height: 40px;
          width: 150px;
          border: none;
          background: #178ace;
          color: #fff;
          font-size: 1.3rem;
          background-color: #007fc4;
          .btn {
            padding-left: 30px;
            background: url('../../../assets/img/command/connect-user-plus.png') left center no-repeat;
          }
        }
      }
      .vb {
        /deep/.vb-dragger > .vb-dragger-styler {
          background-color: rgba(48, 121, 244, 0.6) !important;
          min-height: 6px;
        }
      }
    }
  }
}
</style>
