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
      icon-class="chart-empty-horizontal-bar"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import horizontalBarMixins from '@/components/Dashboard/mixins/horizontalBarMixins'
export default {
  name: 'HorizontalBarChart',
  mixins: [horizontalBarMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'HorizontalBarChart'// 图表类型 1.条形图;2.堆积条形图;3.百分比堆叠条形图
    }
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.transformData(this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator)
      this.getSeries(componentOption) // 获取Series

      // 将图表转为堆积条形图
      if (componentOption.PercentStack.isStack && !componentOption.PercentStack.isPercent) {
        this.getStackSeries(componentOption)
      }
      // 将图表转为百分比堆积条形图
      if (componentOption.PercentStack.isPercent) {
        this.getPercentStackSeries(componentOption)
      }

      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
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
                Total += Number.parseFloat(data[index + 1])
              }
            })
            result += `<div style="line-height: 25px;font-weight: 700;">总计<span style="float: right;font-weight: 700;">${Total}${(YAxis.unit || '')}</span></div>`
            return result
          }
        },
        'yAxis': this.yAxis,
        'markPoint': this.markPoint,
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
    },
    getSeries (componentOption) {
      this.series = []
      let seriesLength = 0
      if (this.dataValue && this.dataValue.length > 0) {
        this.dataValue.forEach(item => {
          seriesLength = item.length - 1
        })
      } else {
        return
      }
      this.setAxis()

      // 双Y轴设置
      this.twisYAxisConfig(componentOption)

      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'bar',
          name: this.dataValue[0][i + 1],
          label: {
            show: componentOption.ChartLabel.check, // 标签显示
            position: 'right' // 标签位置
          },
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
        if (componentOption.TwisYAxis.check) {
          const xAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].xAxisIndex = xAxisIndex
        }
      }
    }
  }
}
</script>

<style>
</style>
