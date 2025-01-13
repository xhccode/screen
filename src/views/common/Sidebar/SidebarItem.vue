<template>
  <div v-if="!item.hidden && hasMenu(item)" class="menu-wrapper">
    <!-- 无下拉菜单 -->
    <el-menu-item v-if="(item.meta.rootShow || !item.children)" :key="item.path" :index="item.path" :class="{'actMark': item.meta.actMark}" @click="touchSide">
      <router-link :to="item.path" class="menu">
        <i v-if="item.meta.icon" class="iconfont menu-icon" v-html="item.meta.icon" :title="item.meta.title"></i>
        <span class="menu-text">{{item.meta.title}}</span>
      </router-link>
    </el-menu-item>
    <!-- 下拉菜单 -->
    <template v-else>
      <el-submenu v-if="hasChild(item)" :index="item.path" :key="item.path" :class="{'actMark': item.meta.actMark}">
        <!-- 下拉菜单标题 -->
        <template slot="title">
          <i v-if="item.meta.icon" class="menu-icon iconfont" v-html="item.meta.icon" :title="item.meta.title"></i>
          <span class="menu-text">{{ item.meta.title }}</span>
        </template>
        <!-- 下拉菜单项 -->
        <template v-for="child in item.children">
          <sidebar-item :item="child" :key="child.path"></sidebar-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  data () {
    return {
      actMark: true
    }
  },
  props: {
    /**
     * @author tangyuchen
     * @description 菜单项
     */
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    touchSide () {
      this.$router.options.routes.forEach(ele => {
        if (ele.meta) {
          ele.meta.actMark = false
        }
        if (ele.path === this.$props.item.path) {
          console.log(ele)
          ele.meta.actMark = true
        }
      })
    },
    /**
     * @author tangyuchen
     * @description 判断是否有此菜单权限
     */
    hasMenu (menu) {
      return true
      // if (menu.meta.prmCode === 'home') return true
      // const part = sessionStorage.getItem('part')
      // let codeList = []
      // if (part === 'FLEET') {
      //   codeList = this.$VLPrmCodeList
      // } else if (part === 'SERVICE') {
      //   codeList = this.$TKPrmCodeList
      // }
      // for (let index in codeList) {
      //   if (codeList[index] === menu.meta.prmCode) {
      //     return true
      //   }
      // }
      // return false
    },
    /**
     * @author tangyuchen
     * @description 判断是否有子菜单
     */
    hasChild (menu) {
      return true
      // if (!menu.children) return false
      // if (menu.children.length === 0) return false
      // const part = sessionStorage.getItem('part')
      // let codeList = []
      // if (part === 'FLEET') {
      //   codeList = this.$VLPrmCodeList
      // } else if (part === 'SERVICE') {
      //   codeList = this.$TKPrmCodeList
      // }
      // let hasShowItem = menu.children.some(item => {
      //   return !item.hidden && item.meta && codeList.indexOf(item.meta.prmCode) > -1
      // })
      // if (!hasShowItem) return false
      // return true
    }
  },
  created () {
  },
  beforeRouteLeave () {

  }
}
</script>

<style lang="scss">

</style>
