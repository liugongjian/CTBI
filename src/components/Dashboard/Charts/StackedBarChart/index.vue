<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import barMixins from '@/components/Dashboard/mixins/barMixins'
export default {
  name: 'StackedBarChart',
  mixins: [barMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'StackedBarChart' // 图表类型 1.柱图；2.堆积柱状图；3.百分比堆积柱状图
    }
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.transfromData(this.storeOption.theme.FunctionalOption.ChartFilter.filteredSery)
      this.getStackSeries(componentOption)
      // 如果选择百分比，转为百分比堆积柱状图
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
      this.chartOption = {
        'grid': this.grid,
        'color': colorOption,
        'legend': componentOption.Legend,
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
          'xAxisIndex': [0, 1]
        },
        'series': this.series
      }
    }
  }
}
</script>

<style>
</style>
