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
import { getLayoutOptionById } from '@/utils/optionUtils'
import lineMixins from '@/components/BI/mixins/lineMixins'
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
      storeOption: {},
      chartOption: {},
      // dataValue: null,
      type: 'LineChart', // 线图 面积图 堆积面积图 百分比堆叠面积图
      dataValue: [
        ['date', '价格', '数量'],
        ['Mon', 820, 410],
        ['Tue', 932, 320],
        ['Wed', 901, 300],
        ['Thu', 934, 380],
        ['Fri', 1290, 430],
        ['Sat', 1330, 480],
        ['Sun', 1320, 460]
      ],
      series: [],
      textMap: {
        'LineChart': '线图',
        'AreaChart': '面积图',
        'StackedAreaChart': '堆叠面积图',
        'PercentStackedAreaChart': '百分比堆叠面积图'
      }
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.type = val.theme.Basic.ChartType.type
        val.theme.Basic.Title.text = this.textMap[this.type]
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          this.getOption()
        }
      },
      deep: true
    },
    type: {
      handler (val) {
        this.getOption()
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      const axis = this.storeOption.theme.Axis
      this.getSeries()
      this.chartOption = {
        legend: componentOption.Legend,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'category',
          show: axis.XAxis.show,
          name: axis.XAxis.showTitle ? axis.XAxis.title : '',
          axisTick: {
            show: axis.XAxis.showTicks
          },
          axisLabel: {
            show: axis.XAxis.showAxisLabel
          },
          axisLine: {
            lineStyle: {
              color: axis.XAxis.lineColor,
              width: axis.XAxis.lineWidth
            }
          },
          splitLine: {
            show: axis.XAxis.showSplit,
            lineStyle: {
              width: axis.XAxis.splitWidth,
              color: axis.XAxis.splitColor
            }
          }
        },
        yAxis: {},
        dataset: {
          source: this.dataValue
        },
        series: this.series
      }
    }
  }
}
</script>

<style>
</style>
