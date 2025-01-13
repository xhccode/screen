<template>
  <div class="tree-wrap">
    <div class="tree-content">
      <div class="tit">
        <img src="@/assets/img/power/icon.png" alt="" />
        <span class="txt">治理力量</span>
      </div>
      <div class="search-block">
        <search :onChange="filterText"></search>
      </div>
      <ul class="tab-list" v-show="tabs.length" :style="$route.meta.bgColorWhite ? 'background:#fff' : ''">
        <li v-for="(item, index) in tabs" :key="index" @click="changeTab(index)" :class="{ actived: activeTabIdx == index }">
          {{ item }}
        </li>
      </ul>
      <div class="tab-pannel">
        <div class="tree-container">
          <el-tree
            v-loading="loading"
            element-loading-custom-class="xs-loading-black"
            element-loading-text="正在加载中..."
            ref="tree"
            :data="treeDataOrg"
            :props="defaultPropsOrg"
            :default-expanded-keys="['1']"
            :show-checkbox="true"
            :render-content="renderContent"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            @check-change="changeCheckNode"
            :style="$route.meta.bgColorWhite ? 'background:#fff' : ''"
          ></el-tree>
          <div class="op-box">
            <slot name="operatePublish" :powers="powers"></slot>
            <slot name="operateConnect" :powers="powers"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import search from './search'
import DialogPowerDetail from './dialogPowerDetail'
import windowContainer from '@/components/command/windowContainer'
import axios from 'axios'
let lastNode = []
export default {
  name: 'basicTree',
  data () {
    return {
      powers: [],
      activeTabIdx: 0,
      // tabs: ['组织架构', '组织分类', '人员分类'],
      tabs: ['组织架构'],
      treeDataOrg: [],
      defaultPropsOrg: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
      },
      loading: false,
      tempData: {
        orgName: '技术部门',
        orgId: '000',
        orgVOList: [],
        userInfoVOList: [
          {
            account: '测试账户',
            deptName: '厚桥街道',
            phone: '018918587515',
            postName: '技术总监',
            profilePicture: '',
            userId: 1670,
            userName: '程军'
          },
          {
            account: '测试账户',
            deptName: '厚桥街道',
            phone: '013855142557',
            postName: '项目经理',
            profilePicture: '',
            userId: 1670,
            userName: '江航'
          },
          {
            account: '测试账户',
            deptName: '厚桥街道',
            phone: '018001817498',
            postName: '技术经理',
            profilePicture: '',
            userId: 1670,
            userName: '吴荣'
          },
          {
            account: '测试账户',
            deptName: '厚桥街道',
            phone: '018817715928',
            postName: '技术经理-数据',
            profilePicture: '',
            userId: 1670,
            userName: '高路'
          },
          {
            account: '测试账户',
            deptName: '厚桥街道',
            phone: '015638924924',
            postName: '中级前端',
            profilePicture: '',
            userId: 1670,
            userName: '王彦朋'
          },
          {
            account: '测试账户',
            deptName: '厚桥街道',
            phone: '018618264858',
            postName: '项目经理',
            profilePicture: '',
            userId: 1670,
            userName: '龚韬'
          }
        ]
      }
    }
  },
  components: { search },
  provide () {
    return {
      test () {
        console.log(1)
      }
    }
  },
  mixins: [windowContainer],
  mounted () {
    this.initTreeData()
  },
  methods: {
    changeTab (idx) {
      this.activeTabIdx = idx
    },
    changeCheckNode () {
      this.powers = this.getCheckedPeople()
    },
    initTreeData () {
      this.loading = true
      API.login.getAddressBookNew({ account: this.$store.state[STATE.USER_INFO].account }).then(res => {
        let data = {}
        data.label = res.data.data.orgName
        data.children = res.data.data.orgVOList
        data.children.push(this.tempData)
        // 递归直到orgVOlist 为空
        this.coverList(data.children)
        this.treeDataOrg = JSON.parse(JSON.stringify([data]))
        console.log(this.treeDataOrg)
        this.loading = false
      })
    },
    filterText (e) {
      let value
      if (e.target) {
        value = e.target.value
      } else {
        value = e
      }
      this.$refs.tree.filter(value)
    },
    filterNode (value, data) {
      if (!value) return true
      if (!data.label) return false
      return (data.typeName && data.typeName.indexOf(value) !== -1) || (data.phone && data.phone.indexOf(value) !== -1) || data.label.indexOf(value) !== -1
    },
    getCheckedPeople () {
      return this.$refs.tree.getCheckedNodes().filter(item => {
        return item.account
      })
    },
    // 点击某个人查看详情
    handleNodeClick (userInfo) {
      if (userInfo.account) {
        let data = { account: userInfo.account, userId: userInfo.userId }
        API.login.getUserInfoById(data).then(res => {
          this.$extendDialog(DialogPowerDetail, {}, { userInfo: res.data.data, title: '详细信息', width: '1132px', height: '334px' })
        })
      }
    },
    coverList (orgVOlist) {
      orgVOlist.forEach(item => {
        let data = {}
        if (item === null) {
          console.log('item为', item)
          return
        }
        if (item.userName) {
          item.label = item.userName + '(' + item.postName + ')'
          item.phone = item.phone
        } else {
          item.label = item.orgName
          if (item.orgId === '1') {
            // 测试信息 -- start
            if (!(item.userInfoVOList instanceof Array)) {
              item.userInfoVOList = []
            }
            // item.userInfoVOList.unshift({
            //   account: '测试账户',
            //   deptName: '厚桥街道',
            //   phone: '013961718800',
            //   postName: '政法委副书记',
            //   profilePicture: '',
            //   userId: 1670,
            //   userName: '沈锋'
            // })
            // 测试信息 -- end
          }
          if (item.userInfoVOList && item.userInfoVOList instanceof Array) {
            if (item.orgVOList === '') {
              item.orgVOList = []
            }
            item.children = item.orgVOList.concat(item.userInfoVOList)
            // console.log(item.children)
          } else {
            item.children = item.orgVOList
          }
          if (item.children instanceof Array && item.children.length > 0) {
            this.coverList(item.children)
          }
        }
      })
    },
    renderContent (h, { node, data, store }) {
      if ((data.nodeType && data.nodeType === 1) || data.userId) {
        return (
          <el-tooltip content={node.label}>
            <span class="custom-tree-node">
              {data.online ? <i class="user-icon-online"></i> : <i class="user-icon-offline"></i>}
              <span>{node.label}</span>
            </span>
          </el-tooltip>
        )
      } else {
        return (
          <el-tooltip content={node.label}>
            <span class="custom-tree-node">
              <span>{node.label}</span>
              {data.workerNum && <span class="summary">（{data.workerNum}）</span>}
            </span>
          </el-tooltip>
        )
      }
    }
  },
  watch: {
    activeTabIdx (tab) {
      this.$emit('onSetTab', tab)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-wrap {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  .tree-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .tit {
    }
    .search-block {
      margin-bottom: 16px;
      color: #606266;
      /deep/ .search-container {
        border-color: #c81d1d;
        .search-icon {
          color: #c81d1d;
          font-size: 2rem;
        }
        .search-input input {
          color: #606266;
        }
      }
    }
    .tab-list {
      position: relative;
      height: 25px;
      margin-bottom: 15px;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: linear-gradient(left, #c4c4c4, rgba(0, 0, 0, 0));
        top: 25px;
        left: 0;
      }
      li {
        width: 79px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        font-weight: bold;
        float: left;
        font-size: 1.4rem;
        color: rgba(52, 52, 52, 0.6);
        &.actived {
          background: url('~@/assets/img/power/tabBg.png') 0 0 no-repeat;
        }
      }
    }
    .tab-pannel {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .tree-container {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        .el-tree {
          margin-right: 50px;
          flex: 1;
          min-height: 0;
          overflow: hidden;
          overflow-y: auto;
          &::-webkit-scrollbar {
            display: none;
          }
          /deep/ .el-tree-node__content {
            display: flex;
            .custom-tree-node {
              flex: 1;
              min-width: 0;
              display: flex;
              justify-content: flex-start;
              > span {
                &:first-child {
                  flex: 1;
                  min-width: 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                &.summary {
                  margin: auto 0;
                }
              }
            }
          }
        }
        .op-box {
          position: absolute;
          width: 48px;
          top: 0px;
          right: 0px;
          bottom: 0;
          display: flex;
          flex-direction: column;
          img {
            width: 38px;
            height: 38px;
          }
          .operat-container {
            margin: auto;
          }
        }
      }
    }
  }
}

.blue,
.white {
  .tab-list {
    .actived {
      background: linear-gradient(180deg, rgba(102, 206, 255, 0.8) 0%, rgba(102, 206, 255, 0) 100%) !important;
    }
  }
  .tit {
    padding-left: 10px;
    background: linear-gradient(left, rgba(14, 178, 255, 1) 0%, rgba(14, 178, 255, 0) 80%);
    margin-bottom: 15px;
  }
  .tab-list {
    li {
      color: #fff;
      &.actived {
        background: url('~@/assets/img/power/tabBg.png') 0 0 no-repeat;
      }
    }
  }
  /deep/ .el-tree {
    color: #fff;
    background: transparent;
    .el-tree-node__content:hover {
      background: linear-gradient(left, rgba(102, 206, 255, 0.8) 0%, rgba(102, 206, 255, 0) 100%);
    }
    .el-tree-node__expand-icon {
      &::before {
        background: url('~@/assets/img/video/+.png') center center no-repeat;
      }
      &.is-leaf {
        &::before {
          content: '';
          width: 4px;
          height: 4px;
          background: #ababab;
        }
      }
      &.expanded {
        &::before {
          background: url('~@/assets/img/video/-.png') center center no-repeat;
        }
      }
    }
    .summary {
      color: #0eb2ff !important;
    }
  }
}
.white {
  /deep/ .el-tree {
    .summary {
      color: #ffffff !important;
    }
  }
}
.red {
  .tab-list {
    .actived {
      background: url('~@/assets/img/power/tabBg.png') 0 0 no-repeat;
    }
  }
  .tit {
    height: 32px;
    background: linear-gradient(90deg, #c81d1d, rgba(0, 0, 0, 0));
    display: flex;
    justify-content: flex-start;
    margin: 15px 0;
    padding-left: 4px;
    img {
      margin: auto 0;
      object-fit: scale-down;
    }
    .txt {
      margin: auto 0;
    }
  }
  .tab-list {
    li {
      color: rgba(52, 52, 52, 0.6);
      &.actived {
        background: url('~@/assets/img/power/tabBg.png') 0 0 no-repeat;
      }
    }
  }
  /deep/ .el-tree {
    font-size: 1.4rem;
    background: transparent;
    .el-tree-node__expand-icon {
      &::before {
        background: url('~@/assets/img/power/plus.png') center center no-repeat;
      }
      &.is-leaf {
        &::before {
          background: transparent;
        }
      }
      &.expanded {
        &::before {
          background: url('~@/assets/img/power/-.png') center center no-repeat;
        }
      }
    }
    .summary {
      color: #c81d1d;
      font-weight: bold;
    }
  }
}
</style>
