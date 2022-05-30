<template>
  <div
    class="editor-object-container"
  >
    <div class="editor-item-title">图表对齐方式</div>
    <div class="editor-item-container">
      <el-radio-group v-model="option.align">
        <el-radio label="left">左对齐</el-radio>
        <el-radio label="right">右对齐</el-radio>
      </el-radio-group>
    </div>
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
