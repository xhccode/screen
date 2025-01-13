<template>
  <div class="mapBox">
    <base-map />
  </div>
</template>

<script>
  import BaseMap from "@/components/BaseMap";

  export default {
    name: "Map",
    components: {
      BaseMap,
    },
  };
</script>

<style>
.mapBox{
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
