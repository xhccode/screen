<template>
    <div class="radio-group-wrap">
        <slot></slot>
    </div>
</template>

<script>
export default {
  props: {
    value: [String, Number]
  },
  methods: {
    onChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-group-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
