<!--
 * @Author: 黄璐璐
 * @Date: 2022-05-06 22:42:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-15 17:45:48
 * @Description:
-->
<template>
  <div v-if="option.show" class="editor-object-container">
    <el-checkbox v-model="option.check">合并同类单元格</el-checkbox>
  </div>
</template>

<script>
export default {
  name: 'MergeForm',
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
