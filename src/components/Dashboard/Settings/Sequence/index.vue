<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-03 16:36:09
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-13 14:07:22
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">显示序号</el-checkbox>
    <el-input v-if="option.show" v-model="option.name" class="m-t-12" placeholder="序号" />
  </div>
</template>

<script>
export default {
  name: 'Sequence',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>

</style>
