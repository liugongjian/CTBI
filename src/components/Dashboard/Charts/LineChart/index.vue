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
  name: 'LineChart',
  mixins: [lineMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'LineChart'// 图表类型 1.线图；2.面积图; 3.堆叠面积图；4.百分比堆叠图
    }
  },
  methods: {
    getOption () {
      const { ComponentOption, FunctionalOption } = this.storeOption.theme
      this.transfromData(FunctionalOption.ChartFilter.filteredSery)
      this.getSeries(ComponentOption, FunctionalOption)

      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      ComponentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      // 获取指标筛选中的图例数据
      const legendData = []
      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption.forEach(item => {
        legendData.push({ name: item.value })
      })
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)
      this.chartOption = {
        grid: this.grid,
        color: colorOption,
        // legend: ComponentOption.Legend,
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
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      this.setAxis()

      // 双Y轴设置
      this.twisYAxisConfig(ComponentOption)

      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'line',
          name: this.dataValue[0][i + 1],
          label: {
            show: ComponentOption.ChartLabel.check, // 标签显示
            position: 'top' // 标签位置
          },
          labelLayout: {
            hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          smooth: ComponentOption.LineStyle.type === 1,
          connectNulls: this.resolveNull(FunctionalOption),
          itemStyle: this.getItemStyle(ComponentOption)// 图形样式配置-颜色
        })
        if (ComponentOption.TwisYAxis.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
        }
        if (!ComponentOption.SeriesMark.check) {
          this.series[i].symbol = 'circle'
          this.series[i].hoverAnimation = false
          this.series[i].symbolSize = 1
        } else {
          this.series[i].symbol = ComponentOption.SeriesMark.markType
        }
      }
    }
  }
}
</script>

<style>
</style>
