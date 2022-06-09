<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">显示分页</el-checkbox>
    <div class="pag-select editor-item-container">
      <el-select v-model.number="option.pageSize" :disabled="!option.show">
        <el-option value="10" label="10" />
        <el-option value="20" label="20" />
        <el-option value="30" label="30" />
        <el-option value="50" label="50" />
        <el-option value="80" label="80" />
        <el-option value="100" label="100" />
      </el-select>
      <span>条/页</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationSettor',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
.pag-select{
  display: inline-flex;
  align-items: center;
  .el-select{
      width: 75%;
      margin-right: 8px;
  }
}
</style>
