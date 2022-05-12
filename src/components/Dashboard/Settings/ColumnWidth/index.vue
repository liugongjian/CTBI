<template>
  <div class="editor-object-container">
    <span>列宽调整</span>
    <el-radio-group v-model="option.edition">
      <el-radio label="newEdition">按容器自适应</el-radio>
      <el-radio label="oldEdition">自定义</el-radio>
    </el-radio-group>
    <div />
  </div>
</template>

<script>
export default {
  name: 'ColumnWidth',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
