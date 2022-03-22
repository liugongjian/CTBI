<template>
  <div>
    可视化样式
    <el-radio-group v-model="option.ComponentOption.ChartRadius[0]">
      <el-radio label="0%">饼图</el-radio>
      <el-radio :label="rangLabel">环形图</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    rangLabel () {
      // 去除百分号，将饼图直径转成数字 直径最小35%
      const maxLabel = this.option.ComponentOption.ChartRadius[1]
      const maxNumber = Number.parseInt(maxLabel.replace('%'))
      return (maxNumber - 20) + '%'
    }
  }
}
</script>
