<template>
  <div class="editor-object-container">
    <div class="editor-item-title">
      显示缩略轴
    </div>
    <div class="editor-item-container">
      <el-radio-group v-model="option.showDataZoom">
        <el-radio label="auto">智能适配</el-radio>
        <el-radio label="show">显示</el-radio>
        <el-radio label="hide">不显示</el-radio>
      </el-radio-group>
    </div>
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
