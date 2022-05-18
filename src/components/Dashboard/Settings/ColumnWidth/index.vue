<template>
  <div v-if="visible" class="editor-object-container">
    <span>列宽调整</span>
    <el-radio-group v-model="option.type">
      <el-radio label="selfadapting ">按容器自适应</el-radio>
      <el-radio label="selfdefine">自定义</el-radio>
    </el-radio-group>
    <div>
      <el-descriptions :colon="false" :column="1">
        <el-descriptions-item label="省份">
          <el-checkbox v-model="check">自动</el-checkbox>
          <el-input-number
            v-if="!check"
            v-model="num"
            controls-position="right"
            :min="25"
          />
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import Edition from '@/components/Dashboard/mixins/EditionMixins'
export default {
  name: 'ColumnWidth',
  mixins: [Edition],
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      check: true,
      num: 0
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-descriptions-item__container{
    align-items: center;
}
</style>
