<template>
  <!-- 转向特定的组件, 可拓展组件类型 -->
  <component
    :is="`${option.ComponentOption.ChartType}ChartType`"
    :option="option"
  />
</template>

<script>
import pieChartType from '@/components/BI/Settings/ChartType/PieChartType'
export default {
  name: 'ChartType',
  components: { pieChartType },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  }
}
</script>
