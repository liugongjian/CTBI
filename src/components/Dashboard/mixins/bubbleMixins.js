// import { colorTheme } from '@/constants/color.js'
import { deepClone, formatDataValue, getDataValueById, getLayoutOptionById } from '@/utils/optionUtils'
// import { deepClone, formatDataValue } from '@/utils/optionUtils'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import store from '@/store'

export default {
  mixins: [YAxis],
  data () {
    return {
      storeOption: {},
      chartOption: {},
      dataValue: null,
      dataOption: [],
      series: [],
      xAxis: { type: 'category' },
      yAxis: {},
      grid: {}
    }
  },
  watch: {
    storeOption: {
      handler () {
        if (this.dataValue) {
          this.dataValue = formatDataValue(deepClone(getDataValueById(this.identify)))
        }
        this.setAxis()
        this.setSeries()
        this.getOption()
      },
      deep: true
    },
    dataOption: {
      handler (val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = formatDataValue(deepClone(getDataValueById(this.identify)))
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    setAxis () {
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      this.xAxis = [{
        type: 'category',
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
      }]
      this.YAxis = [{
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
        // 轴标题和单位
        name: YAxis.showTitle && (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title)
      }]
    },
    setGrid (legend) {
      if (legend.top === 'auto' && legend.left === 'center') { // 图例在上
        this.grid = {
          top: 50
        }
      } else if (legend.top === 'bottom' && legend.left === 'center') { // 图例在下
        this.grid = {
          bottom: 50
        }
      } else if (legend.top === 'center' && legend.left === 'auto') { // 图例在左
        this.grid = {
          left: 120
        }
      } else if (legend.top === 'center' && legend.left === 'right') { // 图例在右
        this.grid = {
          right: 120
        }
      }
    },
    setSeries () {
      const { symbolSize } = this.storeOption.theme.ComponentOption.Slider
      this.series = [
        {
          type: 'scatter',
          symbolSize: function (data) {
            return Math.sqrt(data[1]) * 0.1 * symbolSize
          }
        }
      ]
    }
  }
}
