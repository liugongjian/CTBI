<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.Basic.TestTitle.testShow"
      label="改变Title组件的多选框"
    />
  </div>
</template>

<script>

export default {
  name: 'TestTitle',
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
