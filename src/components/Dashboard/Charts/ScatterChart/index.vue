<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'

export default {
  name: 'ScatterChart',
  mixins: [YAxis],
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
      dataValue: [
        [10.0, 800004],
        [8.07, 600],
        [13.0, 738],
        [9.05, 881],
        [11.0, 833],
        [14.0, 766],
        [13.4, 681],
        [10.0, 633],
        [14.0, 896],
        [12.5, 682],
        [9.15, 720],
        [11.5, 720],
        [3.03, 423],
        [12.2, 733],
        [2.02, 447],
        [1.05, 333],
        [4.05, 496],
        [6.03, 724],
        [12.0, 626],
        [12.0, 884],
        [7.08, 582],
        [5.02, 568]
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
        }
        this.getOption()
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      const { Legend, Slider } = this.storeOption.theme.ComponentOption
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      this.chartOption = {
        tooltip: {
          show: true,
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            show: true
          },
          formatter: '{b}<br />{a}: {c}'
        },
        'legend': Legend,
        xAxis: [
          {
            // 轴线显示与样式
            'axisLine': {
              'show': XAxis.show,
              'lineStyle': {
                'type': XAxis.lineType,
                'width': XAxis.lineWidth,
                'color': XAxis.lineColor
              }
            },
            // 轴标签
            'axisLabel': {
              'show': XAxis.showAxisLabel
            },
            // 轴刻度线
            'axisTick': {
              'show': XAxis.showTicks
            },
            // 网格线
            'splitLine': {
              show: XAxis.showSplit,
              lineStyle: {
                type: XAxis.splitType,
                color: XAxis.splitColor,
                width: XAxis.splitWidth
              }
            },
            // 轴标题和单位
            name: XAxis.showTitle && (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title)
          }
        ],
        yAxis: [
          {
            'axisLine': {
              'show': YAxis.show,
              'lineStyle': {
                'type': YAxis.lineType,
                'width': YAxis.lineWidth,
                'color': YAxis.lineColor
              }
            },
            'axisLabel': {
              'show': YAxis.showAxisLabel,
              formatter: (value, index) => {
                return this.formatYLabel(value, YAxis)
              }
            },
            'splitLine': {
              show: YAxis.showSplit,
              lineStyle: {
                type: YAxis.splitType,
                color: YAxis.splitColor,
                width: YAxis.splitWidth
              }
            },
            'axisTick': {
              'show': YAxis.showTicks
            },
            min: YAxis.autoMin ? 0 : YAxis.min,
            max: function (value) {
              if (!YAxis.autoMax) {
                return YAxis.max < value.max ? null : YAxis.max
              }
            },
            // 轴标题和单位
            name: YAxis.showTitle && (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title)
          }
        ],
        dataset: {
          source: this.dataValue
        },
        'series': [
          {
            'symbolSize': Slider.symbolSize,
            'type': 'scatter'
            // 'data': this.dataValue,
            // 'name': '图例'
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
