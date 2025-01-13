<template>
    <div class="my-power-button-wrap">
        <slot></slot>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.my-power-button-wrap {
    width: 84px;
    height: 84px;
    cursor: pointer;
    text-align: center;
    background-image: url("../images/power-button.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    font-size: 15px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: #000;
}
</style>
