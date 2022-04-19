<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.head">不显示列表头</el-checkbox>
  </div>
</template>

<script>
export default {
  name: 'ListHeader',
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
