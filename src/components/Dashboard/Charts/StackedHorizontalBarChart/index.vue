<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-percent-stacked-horizontal-bar"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import horizontalBarMixins from '@/components/Dashboard/mixins/horizontalBarMixins'
export default {
  name: 'StackedHorizontalBarChart',
  mixins: [horizontalBarMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'StackedHorizontalBarChart'// 图表类型 1.条形图;2.堆积条形图;3.百分比堆叠条形图
    }
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.transformData(this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator)
      this.getStackSeries(componentOption)
      // 如果选择百分比，转为百分比堆积条形图
      if (componentOption.PercentStack.isPercent) {
        this.getPercentStackSeries(componentOption)
      }

      // 系列配置
      this.setSeriesItem()
      // 获取颜色设置
      const colorOption = []
      componentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      // 设置图例与图表距离
      this.setGrid(componentOption.Legend)

      // 获取指标筛选中的图例数据
      const legendData = []
      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption.forEach(item => {
        legendData.push({ name: item.value })
      })
      this.chartOption = {
        'grid': this.grid,
        'color': colorOption,
        'legend': {
          ...componentOption.Legend,
          data: legendData
        },
        'xAxis': this.xAxis,
        'tooltip': this.tooltip,
        'yAxis': this.yAxis,
        'dataset': {
          'source': this.dataValue
        },
        'dataZoom': {
          'type': 'slider',
          'show': this.storeOption.theme.FunctionalOption.DataZoom.showDataZoom !== 'hide',
          'realtime': true,
          'start': 0,
          'end': 100,
          'yAxisIndex': [0, 1]
        },
        'series': this.series
      }
    }
  }
}
</script>

<style>
</style>
