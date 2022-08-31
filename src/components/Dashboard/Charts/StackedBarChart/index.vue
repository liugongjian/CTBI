<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <svg-icon v-else icon-class="chart-empty-stacked-bar" style="width:100%;height:100%;" />
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
      this.transformData(this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator)
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

      // 获取指标筛选中的图例数据
      const legendData = []
      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption.forEach(item => {
        legendData.push({ name: item.value })
      })

      // 获取y轴配置信息，用于提取单位信息
      const { Axis: { YAxis } } = this.storeOption.theme

      this.chartOption = {
        'grid': this.grid,
        'color': colorOption,
        'legend': {
          ...componentOption.Legend,
          data: legendData
        },
        'xAxis': this.xAxis,
        'tooltip': {
          'show': true,
          'trigger': 'axis',
          'formatter': (params) => {
            let result = ''
            let Total = 0
            params.forEach((item, index) => {
              const { data, seriesName, marker, color } = item
              if (seriesName !== '总计') {
                if (index === 0) {
                  result += '<div>' + data[0] + '</div>'
                }

                result += `<div style="line-height: 25px;">${marker}</span>
                  <span style="color: ${color};">${seriesName}</span>
                  <span style="float: right;margin-left: 20px;">${data[index + 1]}${(YAxis.unit || '')}</span>
                </div>`
                Total += Number.parseInt(data[index + 1])
              }
            })
            result += `<div style="line-height: 25px;font-weight: 700;">总计<span style="float: right;font-weight: 700;">${Total}${(YAxis.unit || '')}</span></div>`
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
