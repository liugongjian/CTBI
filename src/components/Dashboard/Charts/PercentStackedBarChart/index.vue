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
      icon-class="chart-empty-percent-stacked-bar"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import barMixins from '@/components/Dashboard/mixins/barMixins'
export default {
  name: 'PercentStackedBarChart',
  mixins: [barMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'PercentStackedBarChart' // 图表类型 1.柱图；2.堆积柱状图；3.百分比堆积柱状图
    }
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.transformData(this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator)
      this.getPercentStackSeries(componentOption)
      // 系列配置
      this.setSeriesItem()
      // 获取颜色设置
      const colorOption = []
      componentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
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
          'formatter': (params) => {
            let result = ''
            params.forEach((item, index) => {
              const { data, seriesName, marker, color, name } = item
              if (index === 0) {
                result += `<div>${name}</div>`
                result += '<div>总计：100%</div>'
              }

              result += `<div style="line-height: 25px;">${marker}</span>
                  <span style="color: ${color};">${seriesName}</span>
                  <span style="float: right;margin-left: 20px;">${data[index + 1]}%</span>
                </div>`
            })
            return result
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
