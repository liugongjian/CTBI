<template>
  <div class="img-box">
    <svg-icon v-if="isUrl" :icon-class="data" />
    <img v-else class="img" :src="data">
  </div>
</template>

<script>
export default {
  name: 'ImgIcon',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  computed: {
    isUrl() {
      return this.data.search('blob:http:') === -1
    }
  }
}
</script>

<style scoped>
.img-box {
  display: inline-block;
}
.img {
    width: 16px;
  }
</style>
