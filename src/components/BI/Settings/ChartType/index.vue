<template>
  <div class="editor-object-container">
    <div>
      图表类型
    </div>
    <div
      class="editor-item-container"
    >
      <el-button
        type="text"
        @click="changeHandler('1')"
      >线图</el-button>
      <el-button
        type="text"
        @click="changeHandler('2')"
      >面积图</el-button>
      <el-button
        type="text"
        @click="changeHandler('3')"
      >堆积面积图</el-button>
      <el-button
        type="text"
        @click="changeHandler('4')"
      >百分比堆叠面积图</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartType',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
    }
  },
  watch: {},
  created () { },
  mounted () {
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (type) {
      this.option.type = type
    }
  }

}
</script>

<style>
</style>
