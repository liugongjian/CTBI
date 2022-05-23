<template>
  <div class="header">
    <span class="chart-type">
      <svg-icon :icon-class="iconName" />
      {{ chartName }}
      <i class="el-icon-arrow-down el-icon--right" />
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
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: contents;
}
</style>
