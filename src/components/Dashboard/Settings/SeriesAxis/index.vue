<template>
  <div>
    坐标轴
    <el-radio-group v-model="option.type">
      <el-radio label="auto">默认</el-radio>
      <el-radio label="main">主轴</el-radio>
      <el-radio label="sub">从轴</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'SeriesAxis',
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
