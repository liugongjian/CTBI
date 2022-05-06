<template>
  <div
    class="editor-object-container flex-align-center"
  >
    <span>图表对齐方式</span>
    <el-radio
      v-model="option.align"
      label="left"
    >左对齐</el-radio>
    <el-radio
      v-model="option.align"
      label="right"
    >右对齐</el-radio>
  </div>
</template>

<script>
export default {
  name: 'ChartAlign',
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
