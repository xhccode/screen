<template>
  <el-menu
    :default-active="defaultActive"
    class="sidebar-menu"
    :unique-opened="true"
    menu-trigger="click"
    @open="handleOpenMenu"
    :close="handleCloseMenu"
    :collapse="isCollapse"
    mode="vertical">
    <sidebar-item v-for="route in menuItem" :key="route.path" :item="route"/>
  </el-menu>
</template>

<script>
import SidebarItem from './SidebarItem'

export default {
  name: 'Sidebar',
  data () {
    return {
      /**
       * @author tangyuchen
       * @description 侧边栏菜单项
       */
      menuItem: [],
      /**
       * @author tangyuchen
       * @description 当前所在端
       */
      currentPart: ''
    }
  },
  computed: {
    /**
     * @author tangyuchen
     * @description 激活菜单项
     */
    defaultActive () {
      let filterMatched = this.$route.matched.filter(item => item.meta && item.meta.title)
      if (!filterMatched.length) return ''
      return filterMatched[filterMatched.length - 1].path
    },
    /**
     * @author tangyuchen
     * @description 是否收缩侧边栏(true:收缩, false:展开)
     */
    isCollapse () {
      return this.$store.getters.sidebarCollapse
    }
  },
  methods: {
    /**
     * @author tangyuchen
     * @description 打开菜单触发函数
     */
    handleOpenMenu () {},
    /**
     * @author tangyuchen
     * @description 关闭菜单触发函数
     */
    handleCloseMenu () {},
    /**
     * @author tangyuchen
     * @description 获取菜单项
     */
    getMenus () {
      this.currentPart = sessionStorage.getItem('part')
      this.menuItem = []
      for (var i in this.$router.options.routes) {
        if (this.$router.options.routes[i].KEY === sessionStorage.getItem('part')) {
          this.menuItem.push(this.$router.options.routes[i])
        }
      }
    }
  },
  components: { SidebarItem },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (this.currentPart === sessionStorage.getItem('part')) return
        this.getMenus()
      },
      deep: true
    }
  },
  created () {
    // 获取菜单项
    this.getMenus()
  }
}
</script>

<style lang="scss">
@import "~@/styles/sidebar.scss";
</style>
