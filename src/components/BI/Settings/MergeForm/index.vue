<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">合并同类单元格</el-checkbox>
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
