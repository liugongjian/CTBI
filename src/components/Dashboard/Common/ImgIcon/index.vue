<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-03 16:36:04
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-20 16:45:34
 * @Description:
-->
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
      return !(this.data.indexOf('/api') > -1 || this.data.indexOf('/ctbibackend') > -1)
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
