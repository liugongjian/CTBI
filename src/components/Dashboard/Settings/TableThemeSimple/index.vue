<template>
  <div v-if="option.visible" class="editor-object-container">
    <el-checkbox v-model="option.show">自定义表格主题</el-checkbox>
    <el-radio-group v-model="option.type">
      <el-radio label="default">默认</el-radio>
      <el-radio label="simple-no-head">简版(无表头)</el-radio>
      <el-radio label="simple">简版</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'TableThemeSimple',
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
