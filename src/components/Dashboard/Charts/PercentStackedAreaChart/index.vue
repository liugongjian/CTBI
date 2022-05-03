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
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import lineMixins from '@/components/Dashboard/mixins/lineMixins'
export default {
  name: 'PercentStackedAreaChart',
  mixins: [lineMixins],
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
      dataValue: null,
      series: [],
      type: 'PercentStackedAreaChart'// 图表类型 1.线图；2.面积图; 3.堆叠面积图；4.百分比堆叠图
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)
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
    },
    'storeOption.theme.ComponentOption.PercentStack': {
      handler(val) {
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
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      const { ComponentOption, FunctionalOption } = this.storeOption.theme
      this.transfromData(FunctionalOption.ChartFilter.filteredSery)
      this.getPercentStackSeries(ComponentOption, FunctionalOption)

      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      ComponentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)

      this.chartOption = {
        grid: this.grid,
        color: colorOption,
        legend: ComponentOption.Legend,
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
    }
  }
}
</script>

<style>
</style>
