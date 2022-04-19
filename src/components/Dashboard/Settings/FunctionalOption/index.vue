<template>
  <div class="editor-object-container">
    显示缩略轴
    <el-radio-group v-model="option.showDataZoom">
      <el-radio label="auto">智能适配</el-radio>
      <el-radio label="show">显示</el-radio>
      <el-radio label="hide">不显示</el-radio>
    </el-radio-group>
    坐标轴维值显示
    <el-radio-group v-model="option.axisShowType">
      <el-radio label="auto">智能展示</el-radio>
      <el-radio label="sparse">强制稀疏</el-radio>
      <el-radio label="condense">最多展示</el-radio>
    </el-radio-group>
    空值处理
    <el-radio-group v-model="option.emptyResolve">
      <el-radio label="skip">直接跨过</el-radio>
      <el-radio label="zero">置为0,不断开</el-radio>
      <el-radio label="break">线条断开</el-radio>
    </el-radio-group>
    <el-checkbox
      v-model="option.showFilter"
      label="开启指标筛选展示"
    />
    <!-- TODO: 得到数据字段名 -->
    <el-select v-model="option.filteredSery" :disabled="!option.showFilter">
      <el-option label="1" value="1" />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'FunctionalOption',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      seriesOption: null
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
