<template>
  <div class="face-box">
    <div class="faces">
      <div class="face" v-for="i in 88" :key="i">
        <img @click.prevent.stop="emitInsertIcon('static/icons/more/' + i + '.gif')" :src="'static/icons/more/' + i + '.gif'" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChatFaces',
  methods: {
    emitInsertIcon (url) {
      this.$emit('choosed', `<img src="${url}"/>`)
    }
  }
}
</script>
<style lang="scss" scoped>
.face-box {
  width: 333px;
  height: 150px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .faces {
    display: flex;
    flex-wrap: wrap;
    .face {
      box-sizing: border-box;
      margin: 5px;
      cursor: pointer;
      border-radius: 3px;
      border: 1px solid transparent;
      &:hover {
        border: 1px solid #484848;
      }
    }
  }
}
</style>
