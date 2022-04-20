<template>
  <div>
    显示缩略轴
    <el-radio-group v-model="option.showDataZoom">
      <el-radio label="auto">智能适配</el-radio>
      <el-radio label="show">显示</el-radio>
      <el-radio label="hide">不显示</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'DataZoom',
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
