import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
import store from '@/store'
import { getLayoutOptionById, deepClone, formatDataValue } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  data() {
    return {
      series: []
    }
  },
  watch: {
    // 图表类型切换
    'storeOption.is': {
      handler (val) {
        const isData = this.dataOption.findIndex(item => {
          return item.id === this.identify
        })
        if (isData !== -1) {
          this.$bus.$emit('interReload', [this.identify], 100, false)
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
    reloadImpl() {
      this.dataValue = this.formatData(deepClone(this.chartData))
      const data = formatDataValue(deepClone(this.chartData))
      // 拿到数据中的系列名字
      this.getSeriesOptions(data)
      // 拿到数据的系列名字 并设置颜色
      this.getColor(data)
      // 拿到数据中的指标
      // this.getIndicatorOptions(data)
      this.getOption()
    },
    // 拿到数据的系列名字 并设置颜色
    getColor (val) {
      const color = []
      const colorValue = colorTheme[this.storeOption.theme.ComponentOption.Color.theme]
      val[0].forEach((item, index) => {
        if (index) {
          const idx = (index - 1) % colorValue.length
          color.push({ name: item, color: colorValue[idx].value, remark: item })
        }
      })
      this.storeOption.theme.ComponentOption.Color.color = color
    },
    // 拿到数据中的系列名字
    getSeriesOptions (val) {
      const seriesOption = []
      val[0].forEach((item, index) => {
        if (index) {
          seriesOption.push({ value: item, label: item })
        }
      })
      this.storeOption.theme.SeriesSetting.SeriesSelect.seriesOption = seriesOption
      this.storeOption.theme.SeriesSetting.SeriesSelect.selectValue = seriesOption[0].value
      this.storeOption.theme.SeriesSetting.SeriesSelect.remark = seriesOption[0].value
    },
    // 系列设置
    setSeriesItem () {
      const { SeriesSelect } = this.storeOption.theme.SeriesSetting

      this.series = this.series.map((item) => {
        const option = SeriesSelect.seriesOption.find(ele => {
          return ele.value === item.name
        })
        if (option) {
          const { labelColor, showLabel, showMax, showMark, markType, lineType } = option
          const ChartLabel = this.storeOption.theme.ComponentOption.ChartLabel
          item.label.show = item.label.show = ChartLabel.type === 'StackedBarChart' ? (this.checkList.includes('度量') && ChartLabel.check) || showLabel : ChartLabel.check || showLabel
          item.label.color = labelColor
          item.lineStyle = {
            type: lineType
          }
          if (showMax) {
            item.markPoint = {
              symbol: 'pin',
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
          if (showMark) {
            item.symbol = markType
          } else {
            item.symbol = 'circle'
            item.hoverAnimation = false
            item.symbolSize = 1
          }
        }
        return item
      })
    }
  }
}
