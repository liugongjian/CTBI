<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">自动换行</el-checkbox>
  </div>
</template>

<script>
export default {
  name: 'NewLine',
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
