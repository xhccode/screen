<template>
  <div class="my-circle-power-wrap">
    <h1>{{ title }}</h1>
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    text: String
  }
}
</script>

<style lang="scss" scoped>
.my-circle-power-wrap {
  width: 193px;
  height: 193px;
  cursor: pointer;
  text-align: center;
  background-image: url('../images/circle-border.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  font-size: 1.4rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 40px;
  h1 {
    font-size: 40px;
  }
}
</style>
