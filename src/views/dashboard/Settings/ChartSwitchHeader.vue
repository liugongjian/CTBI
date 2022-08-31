<template>
  <div class="header">
    <span class="chart-type">
      <svg-icon :icon-class="iconName" />
      {{ chartName }}
      <i v-if="!showChartTypes" class="el-icon-arrow-down el-icon--right" />
      <i v-else class="el-icon-arrow-up el-icon--right" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'ChartSwitchHeader',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => { }
    },
    chartName: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: ''
    },
    showChartTypes: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: contents;
}
</style>
