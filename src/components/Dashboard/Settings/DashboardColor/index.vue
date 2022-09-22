<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-05 16:06:54
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-15 12:26:14
 * @Description:
-->
<template>
  <div
    class="editor-object-container"
  >
    <div class="flex-align-center">
      <div class="editor-item-title">{{ option.title }}</div>
      <el-color-picker
        v-model="option.color"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardColor',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style>
</style>
