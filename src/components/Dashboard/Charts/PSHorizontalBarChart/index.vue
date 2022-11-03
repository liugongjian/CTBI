<!--
 * @Author: 黄璐璐
 * @Date: 2022-09-07 12:06:00
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-08 09:19:37
 * @Description:
-->
<template>
  <div class="self-chart-content">
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
  name: 'PSHorizontalBarChart',
  mixins: [horizontalBarMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'PSHorizontalBarChart'// 图表类型 1.条形图;2.堆积条形图;3.百分比堆叠条形图
    }
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.transformData(this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator)
      this.getPercentStackSeries(componentOption)
      // 系列配置
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      this.series.forEach(item => {
        const color = componentOption.Color.color.find(c => c.name === item.name)
        if (color) {
          colorOption.push(color.color)
        }
      })

      // 设置图例与图表距离
      this.setGrid(componentOption.Legend)
      const legendLayout = this.getLegendLayout(componentOption.Legend)
      this.chartOption = {
        'grid': this.grid,
        'color': colorOption,
        'legend': legendLayout,
        'xAxis': this.xAxis,
        'tooltip': {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
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
