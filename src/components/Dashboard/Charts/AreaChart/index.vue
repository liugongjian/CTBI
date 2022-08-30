<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
      :update-options="{notMerge:true}"
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import lineMixins from '@/components/Dashboard/mixins/lineMixins'
export default {
  name: 'AreaChart',
  mixins: [lineMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'AreaChart'// 图表类型 1.线图；2.面积图; 3.堆叠面积图；4.百分比堆叠图
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
      this.getSeries(ComponentOption, FunctionalOption)

      // 将图表转为堆积柱状图
      if (ComponentOption.PercentStack.isStack && !ComponentOption.PercentStack.isPercent) {
        this.getStackSeries(ComponentOption, FunctionalOption)
      }
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
          ...ComponentOption.Legend,
          data: legendData
        },
        xAxis: this.xAxis,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params) => {
            let result = ''
            params.forEach((item, index) => {
              const { data, seriesName, marker, color, name } = item
              result += `<div>${name}</div><div style="line-height: 25px;">${marker}</span>
                  <span style="color: ${color};">${seriesName}</span>
                  <span style="float: right;margin-left: 20px;">${data[index + 1]}${(YAxis.unit || '')}</span>
                </div>`
            })
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
    },
    getSeries (ComponentOption, FunctionalOption) {
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
      this.twisYAxisConfig(ComponentOption)
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'line',
          areaStyle: {},
          name: this.dataValue[0][i + 1],
          label: {
            show: ComponentOption.ChartLabel.check, // 标签显示
            position: 'top' // 标签位置
          },
          labelLayout: {
            hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          connectNulls: this.resolveNull(FunctionalOption),
          itemStyle: this.getItemStyle(ComponentOption)// 图形样式配置-颜色
        })
        if (ComponentOption.TwisYAxis.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
        }
      }
    }
  }
}
</script>

<style>
</style>
