<template>
  <div>
    <div class="editor-object-container">
      <el-checkbox
        v-model="option.show"
        label="显示图表标签"
      />
      <div class="editor-item-container">
        <el-checkbox-group
          v-show="option.showLabelValues"
          v-model="option.labelValues"
          :disabled="!option.show"
        >
          <el-checkbox label="度量" />
          <el-checkbox
            v-show="!option.isPercent"
            label="总计"
          />
          <el-checkbox
            v-show="option.isPercent"
            label="百分比"
          />
        </el-checkbox-group>
      </div>
    </div>
    <div class="editor-object-container">
      <div>数据标签展示方式</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.dataLabelShow">
          <el-radio label="auto">智能显示</el-radio>
          <el-radio label="all">全量显示</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'BarLabel',
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
