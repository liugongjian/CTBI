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
  name: 'CircularBar',
  mixins: [barMixins],
  data () {
    return {
      type: 'CircularBar' // 图表类型 环形柱状图
      // option: {
      //   title: [
      //     {
      //       text: 'Tangential Polar Bar Label Position (middle)'
      //     }
      //   ],
      //   polar: {
      //     radius: [30, '80%']
      //   },
      //   angleAxis: {
      //     max: function(v) {
      //       return 1.25 * v.max
      //     },
      //     axisLine: {
      //       show: false // 外圆线隐藏
      //     },
      //     axisLabel: {
      //       show: false // 外围刻度隐藏
      //     },
      //     axisTick: {
      //       show: false // 刻度单位隐藏
      //     },
      //     splitLine: {
      //       show: false // 刻度线隐藏
      //     }
      //     // startAngle: 90
      //   },
      //   radiusAxis: {
      //     type: 'category',
      //     axisLine: {
      //       show: false
      //     },
      //     axisTick: {
      //       show: false // 刻度单位隐藏
      //     },
      //     data: ['a', 'b', 'c', 'd']// 从类别轴、维度中的数据提取出每个数值的name
      //   },
      //   tooltip: {
      //     formatter: '{b}换行  值轴/度量： {c}'
      //   },
      //   series: {
      //     type: 'bar',
      //     data: [2, 1.2, 2.4, 3.6],
      //     coordinateSystem: 'polar',
      //     label: {
      //       show: false
      //     }
      //   }
      // }
    }
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.transformData(this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator)
      this.getSeries(componentOption) // 获取Series

      // 将图表转为堆积柱状图
      if (componentOption.PercentStack.isStack && !componentOption.PercentStack.isPercent) {
        this.getStackSeries(componentOption)
      }
      // 将图表转为百分比堆积柱状图
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
      this.chartOption = {
        'grid': this.grid,
        'color': colorOption,
        'legend': {
          ...componentOption.Legend,
          data: legendData
        },
        'xAxis': this.xAxis,
        'tooltip': {
          trigger: 'axis'
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
          'xAxisIndex': [0, 1]
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
            position: 'top' // 标签位置
          },
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
        if (componentOption.TwisYAxis.check) {
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
