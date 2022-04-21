<template>
  <div>
    坐标轴维值显示
    <el-radio-group v-model="option.axisShowType">
      <el-radio label="auto">智能展示</el-radio>
      <el-radio label="sparse">强制稀疏</el-radio>
      <el-radio label="condense">最多展示</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'LabelShowType',
  components: { },
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
