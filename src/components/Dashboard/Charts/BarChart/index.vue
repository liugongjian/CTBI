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
import { getLayoutOptionById } from '@/utils/optionUtils'
import { deepClone } from '@/utils/optionUtils'
import barMixins from '@/components/Dashboard/mixins/barMixins'
export default {
  name: 'BarChart',
  mixins: [barMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      storeOption: {},
      chartOption: {},
      type: 'BarChart', // 图表类型 1.柱图；2.堆积柱状图；3.百分比堆积柱状图
      dataValue: null,
      series: []
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)// 深拷贝，避免修改数据
          this.getOption()
        }
      },
      deep: true
    },
    'storeOption.dataSource': {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          // 拿到数据中的系列名字
          this.getSeriesOptions(this.dataValue)
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          this.getOption()
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      componentOption.ChartLabel.type = 'BarChart'
      this.getSeries(componentOption) // 获取Series
      if (componentOption.PercentStack.isStack) {
        this.getStackSeries(componentOption)
      }
      if (componentOption.PercentStack.isPercent) {
        this.getPercentStackSeries(componentOption)
      }
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      componentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      this.chartOption = {
        'color': colorOption,
        'legend': componentOption.Legend,
        'xAxis': this.xAxis,
        'tooltip': this.tooltip,
        'yAxis': this.yAxis,
        'dataset': {
          'source': this.dataValue
        },
        'series': this.series
      }
    },
    getSeries (componentOption) {
      this.series = []
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      // 双Y轴设置
      this.twisYAxisConfig(componentOption)

      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'bar',
          label: {
            show: componentOption.ChartLabel.check, // 标签显示
            position: 'top' // 标签位置
          },
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
        if (componentOption.TwisYAxis.show) {
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
