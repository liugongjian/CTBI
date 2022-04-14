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
export default {
  name: 'ScatterChart',
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
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
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
      const { XAxis } = this.storeOption.theme.Axis
      this.chartOption = {
        // 'tooltip': option.Tooltip,
        'legend': Legend,
        xAxis: [
          {
            'show': XAxis.show,
            'axisLine': {
              'lineStyle': {
                'type': XAxis.lineType,
                'width': XAxis.lineWidth,
                'color': XAxis.lineColor
              }
            },
            'axisLabel': {
              'show': XAxis.showAxisLabel
            },
            'axisTick': {
              'show': XAxis.showTicks
            },
            name: XAxis.showTitle && (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title)
          }
        ],
        yAxis: {},
        'series': [
          {
            'symbolSize': Slider.symbolSize,
            'type': 'scatter',
            'data': this.dataValue
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
