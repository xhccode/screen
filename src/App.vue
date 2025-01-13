<template>
  <div id="app">
<!--    <router-view />-->
    <HelloWorld></HelloWorld>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: 'App',
  components: {HelloWorld},
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
