<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">冻结</el-checkbox>
    <div :class="{'box-disabled':!option.show}">
      <el-radio-group v-model="option.freezeChoose">
        <div>
          <el-radio label="head" @change="isshow = true">智能(表头)</el-radio>
          <el-radio label="arrange">列</el-radio>
        </div>
      </el-radio-group>
    </div>
    <div class="arrange" :class="{'box-disabled': isshow}">
      <div class="arrange-type">
        <div>第一列到</div>
        <el-input-number v-model="option.positive" controls-position="right" />
      </div>
      <div class="arrange-type">
        <div>和从后往前到</div>
        <el-input-number v-model="option.reverse" controls-position="right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Freeze',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return { isshow: false }
  }
}
</script>

<style lang="scss" scoped>
.arrange {
  display: flex;
}
.arrange-type {
  flex: 1
}
::v-deep .el-input-number {
  width:120px
}
</style>
