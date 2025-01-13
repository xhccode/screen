<template>
  <div class="login-big-box">
    <login-content/>
  </div>
</template>

<script>
import loginContent from '@/components/login/login'
export default {
  name: 'login',
  components: { loginContent }
}
</script>

<style lang="scss">
.login-big-box {
  width: 100%;
  height: 100%;
}
</style>
