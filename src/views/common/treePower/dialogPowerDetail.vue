<template>
  <xs-dialog :title="title" :visible="visible" :fullscreen="fullscreen" :width="width" :height="height" :close="close" :customerClass="'power-detail-dialog'">
    <div class="user-detail">
      <div class="user-avatar">
        <img :src="userInfo.profilePicture ? (userInfo.profilePicture.indexOf('null') >= 0 ? defaultAvatar : userInfo.profilePicture) : defaultAvatar" />
      </div>
      <div class="base-info">
        <span class="title">个人信息</span>
        <div class="base-info-detail">
          <div>
            <p><label>姓名：</label> {{ userInfo.userName }}</p>
            <p>
              <label>性别：</label>
            </p>
            <p><label>政治面貌：</label> {{ userInfo.politicsStatus }}</p>
            <p><label>办公电话：</label>{{ userInfo.telephone }}</p>
            <p><label>手机号：</label> {{ userInfo.phone }}</p>
            <p><label>直属单位：</label> {{ userInfo.userPositionVOS[0].type == 0 ? userInfo.userPositionVOS[0].orgName : '' }}</p>
          </div>
          <div>
            <p><label>指导单位：</label>{{ userInfo.userPositionVOS[0].type == 1 ? userInfo.userPositionVOS[0].orgName : '' }}</p>
            <p><label>工作专班：</label>{{ userInfo.userPositionVOS[0].type == 2 ? userInfo.userPositionVOS[0].orgName : '' }}</p>
            <p><label>所属网格：</label>{{ userInfo.userPositionVOS[0].type == 4 ? userInfo.userPositionVOS[0].orgName : '' }}</p>
            <p>
              <label>所属管理单元：{{ userInfo.userPositionVOS[0].type == 3 ? userInfo.userPositionVOS[0].orgName : '' }}</label>
            </p>
            <!-- <p><label>个人二维码：</label><img class="qrCode" :src="userInfo.qrCode" /></p> -->
            <p><label>备注：</label> {{ userInfo.remark }}</p>
          </div>
        </div>
      </div>
      <div class="work-info">
        <span class="title">工作信息</span>
        <div>
          <p><label>工作地址：</label> {{ userInfo.address }}</p>
          <p><label>联系电话：</label> {{ userInfo.telephone }}</p>
          <p><label>传真号码：</label> {{ userInfo.faxNumber }}</p>
          <p><label>单位联系人：</label> {{ userInfo.contactPerson }}</p>
        </div>
      </div>
    </div>
  </xs-dialog>
</template>

<script>
import XsDialog from '@/components/Base/XsDialog.vue'
import { formattime } from '@/utils/common.js'
import windowOp from '@/components/command/windowOp.js'
import defaultAvatar from '@/assets/img/common/defaultAvatar.png'
export default {
  name: 'DialogPowerDetail',
  props: ['userInfo'],
  components: { XsDialog },
  mixins: [windowOp],
  data () {
    return {
      defaultAvatar
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
/deep/ .power-detail-dialog {
  /deep/ .el-dialog {
    background-color: #202e38;
  }
  .dialog-inner {
    background-color: #202e38;
  }
}
.user-detail {
  display: flex;
  padding: 30px;
  width: 100%;
  line-height: 30px;
  img {
    width: 135px;
    height: 186px;
  }
  .qrCode {
    vertical-align: bottom;
    width: 30px;
    height: 30px;
  }
  .title {
    display: inline-block;
    width: 100px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    background: rgba(80, 191, 255, 0.4);
    border: 1px solid #50bfff;
    color: #ffffff;
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  .base-info {
    flex: 1;
    margin-left: 27px;
    font-size: 1.3rem;
    label {
      display: inline-block;
      text-align: right;
    }
    .base-info-detail {
      display: flex;
      color: #ffffff;
      & > div {
        &:nth-child(1) {
          width: 40%;
          label {
            width: 80px;
          }
        }
        &:nth-child(2) {
          width: 60%;
          label {
            width: 116px;
          }
        }
      }
    }
  }
  .work-info {
    width: 376px;
    padding-left: 30px;
    border-left: 1px solid #d0d0d0;
    color: #ffffff;
    font-size: 1.3rem;
  }
}
</style>
