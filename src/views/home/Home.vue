<template>
  <div class="home">
    <svg-icon
      class="svg"
      icon-class="home-background"
    />
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
.home {
  width: calc(100% - 200px);
  height: calc(100% - 53px);
  position: absolute;
  background-color: #fff;
  top: 50px;
  left: 200px;

  .svg {
    width: 100%;
    height: 100%;
  }
}
</style>
