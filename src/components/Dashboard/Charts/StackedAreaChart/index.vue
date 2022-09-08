<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
      :update-options="{notMerge:true}"
    />
    <svg-icon
      v-else
      icon-class="chart-empty-stacked-area"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import lineMixins from '@/components/Dashboard/mixins/lineMixins'
export default {
  name: 'StackedAreaChart',
  mixins: [lineMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'StackedAreaChart'
    }
  },
  watch: {
    'storeOption.theme.ComponentOption.PercentStack': {
      handler (val) {
        this.storeOption.theme.ComponentOption.ChartLabel.type = this.type
        if (val.isStack && !val.isPercent) {
          this.storeOption.theme.ComponentOption.ChartLabel.type = 'StackedAreaChart'
        }
        if (val.isPercent) {
          this.storeOption.theme.ComponentOption.ChartLabel.type = 'PercentStackedAreaChart'
        }
      },
      deep: true
    }
  },
  methods: {
    getOption () {
      const { ComponentOption, FunctionalOption } = this.storeOption.theme
      this.transformData(FunctionalOption.ChartFilter.selectedIndicator)
      this.getStackSeries(ComponentOption, FunctionalOption)

      // 将图表转为百分比堆积柱状图
      if (ComponentOption.PercentStack.isPercent) {
        this.getPercentStackSeries(ComponentOption, FunctionalOption)
      }
      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      ComponentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)
      const legendLayout = this.getLegendLayout(ComponentOption.Legend)

      // 获取指标筛选中的图例数据
      const legendData = []
      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption.forEach(item => {
        legendData.push({ name: item.value })
      })

      // 获取y轴配置信息，用于提取单位信息
      const { Axis: { YAxis } } = this.storeOption.theme

      this.chartOption = {
        grid: this.grid,
        color: colorOption,
        legend: {
          ...legendLayout,
          data: legendData
        },
        xAxis: this.xAxis,
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: (params) => {
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
        yAxis: this.yAxis,
        markPoint: this.markPoint,
        dataset: {
          source: this.dataValue
        },
        dataZoom: {
          type: 'slider',
          show: FunctionalOption.DataZoom.showDataZoom !== 'hide',
          realtime: true,
          start: 0,
          end: 100,
          xAxisIndex: [0, 1]
        },
        series: this.series
      }
    }
  }
}
</script>

<style>
</style>
