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
import barMixins from '@/components/Dashboard/mixins/barMixins'
import { deepClone } from '@/utils/optionUtils'
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
      storeOption: {},
      chartOption: {},
      type: 'StackedBarChart', // 图表类型 1.柱图；2.堆积柱状图；3.百分比堆积柱状图
      dataValue: null,
      series: []
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.type = val.theme.Basic.ChartType.type
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
          // 拿到数据中的指标
          this.getIndicatorOptions(this.dataValue)
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
      componentOption.ChartLabel.type = 'StackedBarChart'
      this.getStackSeries(componentOption)
      if (componentOption.PercentStack.isPercent) {
        this.getPercentStackSeries(componentOption)
      }
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
    }
  }
}
</script>

<style>
</style>
