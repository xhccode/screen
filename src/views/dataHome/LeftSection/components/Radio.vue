<template>
  <div class="radio-wrap" :class="$parent.value === value ? 'active' : ''" @click="onClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: { value: [String, Number] },
  methods: {
    onClick () {
      this.$parent.onChange(this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-wrap {
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  color: #ccc;
  font-size: 1.2rem;
  background-color: rgb(9, 111, 159);
  opacity: 0.5;
  flex: 1;
}
.active {
  background-color: rgb(9, 111, 159);
  opacity: 1;
  color: #fff;
}
</style>
