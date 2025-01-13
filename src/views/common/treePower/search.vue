<template>
  <div :class="$route.meta.borderBlueColor ? ' borderBlurColor search-container' : 'search-container'">
    {{ $route.meta.borderBlueColor }}
    <div class="search-icon"><i :class="$route.meta.borderBlueColor ? 'el-icon-search fontBlurColor' : 'el-icon-search'"></i></div>
    <div class="search-input">
      <input v-model="input" :readonly="disabled" @change="onChange" type="text" placeholder="请输入姓名、岗位、手机号" />
      <i @click="clearInput" class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: ['disabled', 'onChange'],
  data () {
    return {
      input: ''
    }
  },
  methods: {
    clearInput () {
      this.input = ''
      this.onChange('')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  height: 35px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #ffffff80;
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 7px 13px 9px 13px;
  box-sizing: border-box;
  .search-icon {
    flex: 0 0 2rem;
    height: 19px;
    color: #000;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-right: 7px;
  }
  .search-input {
    flex: 1 1 100px;
    font-size: 1.3rem;
    position: relative;
    input {
      background: transparent;
      border: none;
      margin: 0;
      width: 100%;
      outline: none;
      color: #000;
      &::placeholder {
        color: #000;
      }
    }
    &:hover {
      .el-icon-close {
        display: inline-block;
      }
    }
    .el-icon-close {
      display: none;
      position: absolute;
      right: 0px;
      width: 16px;
      height: 16px;
      font-size: 1.2rem;
      border-radius: 8px;
      background-color: #e1e1e1;
      text-align: center;
      line-height: 16px;
      top: 2px;
      cursor: pointer;
    }
  }
}
.borderBlurColor {
  border-color: #0bc6de !important;
  .fontBlurColor {
    color: #0bc6de !important;
  }
}
</style>
