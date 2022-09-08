// 折线图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
import { getLayoutOptionById, getDataValueById, deepClone, formatDataValue } from '@/utils/optionUtils'
import store from '@/store'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
export default {
  mixins: [baseMixins, YAxis],
  data: function () {
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
  computed: {
    checkList () {
      return this.storeOption.theme.ComponentOption.ChartLabel.checkList
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.getOption()
      },
      deep: true
    },
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
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = formatDataValue(deepClone(this.chartData))
      // 拿到数据中的系列名字
      this.getSeriesOptions(this.dataValue)
      // 拿到数据的系列名字 并设置颜色
      this.getColor(this.dataValue)
      // 拿到数据中的指标
      this.getIndicatorOptions(this.dataValue)
      this.getOption()
    },
    // 拿到数据中的系列名字
    getSeriesOptions(val) {
      if (val && val.length > 0) {
        const seriesOption = []
        val[0].forEach((item, index) => {
          if (index) {
            seriesOption.push({ value: item, label: item })
          }
        })
        this.storeOption.theme.SeriesSetting.SeriesSelect.seriesOption = seriesOption
        this.storeOption.theme.SeriesSetting.SeriesSelect.selectValue = seriesOption[0].value
        this.storeOption.theme.SeriesSetting.SeriesSelect.remark = seriesOption[0].value
      }
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
    // 拿到数据中的指标
    getIndicatorOptions (val) {
      const indicatorOptions = []
      const selectedIndicator = []
      val[0].forEach((item, index) => {
        if (index) {
          indicatorOptions.push({ value: item, label: item })
          selectedIndicator.push(item)
        }
      })
      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption = indicatorOptions
      this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator = selectedIndicator
    },
    // 将数据转换成百分比
    valueToPercent () {
      if (this.dataValue && this.dataValue.length > 0) {
        const sumArr = []
        for (let ii = 0; ii < this.dataValue.length - 1; ii++) {
          sumArr.push(0)
        }
        for (let i = 1; i < this.dataValue[0].length; i++) {
          for (let j = 0; j < sumArr.length; j++) {
            sumArr[j] += Number(this.dataValue[j + 1][i])
          }
        }
        for (let i = 1; i < this.dataValue[0].length; i++) {
          for (let j = 0; j < sumArr.length; j++) {
            this.dataValue[j + 1][i] = (Number(this.dataValue[j + 1][i]) / sumArr[j] * 100).toFixed(2)
          }
        }
      }
    },
    // 坐标轴配置
    setAxis () {
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      this.xAxis = [
        {
          type: 'category',
          // 轴线显示与样式
          axisLine: {
            show: XAxis.show,
            lineStyle: {
              type: XAxis.lineType,
              width: XAxis.lineWidth,
              color: XAxis.lineColor
            }
          },
          // 轴标签
          axisLabel: {
            show: XAxis.showAxisLabel,
            // auto 智能显示 sparse 强制稀疏 condense 最多展示
            rotate: this.storeOption.theme.FunctionalOption.LabelShowType.axisShowType === 'condense' ? -90 : 0,
            // interval: this.storeOption.theme.FunctionalOption.LabelShowType.axisShowType === 'sparse' ? 3 : 0,
            interval: 'auto',
            'width': 100,
            'height': 100,
            overflow: 'truncate'
          },
          // 轴刻度线
          axisTick: {
            show: XAxis.showTicks
          },
          // 网格线
          splitLine: {
            show: XAxis.showSplit,
            lineStyle: {
              type: XAxis.splitType,
              color: XAxis.splitColor,
              width: XAxis.splitWidth
            }
          },
          // 轴标题和单位
          name: XAxis.showTitle ? (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title) : ''
        }
      ]
      this.yAxis = [
        {
          axisLine: {
            show: YAxis.show,
            lineStyle: {
              type: YAxis.lineType,
              width: YAxis.lineWidth,
              color: YAxis.lineColor
            }
          },
          min: YAxis.autoMin ? null : YAxis.min,
          max: YAxis.autoMax ? null : YAxis.max,
          axisLabel: {
            show: YAxis.showAxisLabel,
            formatter: (value, index) => {
              return this.formatYLabel(value, YAxis)
            }
          },
          splitLine: {
            show: YAxis.showSplit,
            lineStyle: {
              type: YAxis.splitType,
              color: YAxis.splitColor,
              width: YAxis.splitWidth
            }
          },
          axisTick: {
            show: YAxis.showTicks
          },
          // 轴标题和单位
          name: YAxis.showTitle ? (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title) : ''
        }
      ]
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
            item.symbolSize = 5
          }
        }
        return item
      })
    },
    // 获取图形对应的样式配置-颜色
    getItemStyle (ComponentOption) {
      // 颜色设置
      const color = ComponentOption.Color.color
      return {
        color: (data) => {
          if (color[0].name) {
            const colorTemp = color.find((item) => { return data.seriesName === item.name })
            return colorTemp ? colorTemp.color : 'red'
          } else {
            const index = (data.dataIndex) % color.length
            return color[index].value
          }
        }
      }
    },
    // 空值处理
    resolveNull (FunctionalOption) {
      const ast = FunctionalOption.NullProcess.emptyResolve
      let connectNulls = false
      if (ast === 'skip') {
        connectNulls = true
      } else if (ast === 'zero') {
        this.dataValue = this.dataValue.map(datas => {
          return datas.map((data, index) => {
            connectNulls = false
            if ([null, undefined, NaN, '-'].includes(data)) {
              return typeof data === 'number' ? 0 : '0'
            }
            return data
          })
        })
      }
      return connectNulls
    },
    transformData (indicator) {
      if (this.dataValue && this.dataValue.length > 0) {
        const data = []
        for (let i = 1; i < this.dataValue.length; i++) {
          data.push([this.dataValue[i][0]])
        }
        indicator.forEach(item => {
        // 取到指标的下标 如 2015年 index为1
          const indicatorIdx = this.dataValue[0].indexOf(item) > -1 ? this.dataValue[0].indexOf(item) : 1
          // 取除维度以外的第1列为vlaue
          for (let i = 1; i < this.dataValue.length; i++) {
            data[i - 1].push(this.dataValue[i][indicatorIdx])
          }
        })
        data.unshift([this.dataValue[0][0], ...indicator])
        this.dataValue = data
      }
    },
    // 获取堆积图
    getStackSeries (ComponentOption, FunctionalOption) {
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
      // this.twisYAxisConfig(ComponentOption)
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'line',
          name: this.dataValue[0][i + 1],
          label: {
            show: ComponentOption.ChartLabel.check && this.checkList.includes('度量') // 标签显示
          },
          stack: 'Total',
          areaStyle: {},
          labelLayout: {
            hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          connectNulls: this.resolveNull(FunctionalOption),
          itemStyle: this.getItemStyle(ComponentOption)// 图形样式配置-颜色
        })
        if (ComponentOption.TwisYAxis?.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
          this.series[i].stack = yAxisIndex === 1 ? 'other' : 'Total'
        }
      }
    },

    // 获取百分比堆积柱状图
    getPercentStackSeries (ComponentOption, FunctionalOption) {
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
      // this.twisYAxisConfig(ComponentOption)
      this.valueToPercent()
      const that = this
      if (!ComponentOption.TwisYAxis?.check) {
        this.yAxis[0].axisLabel.formatter = '{value}%'
      }
      this.dataValue = formatDataValue(deepClone(getDataValueById(this.identify)))
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'line',
          name: this.dataValue[0][i + 1],
          label: {
            show: ComponentOption.ChartLabel.check, // 标签显示
            formatter: function (params) {
              const isPercent = that.checkList.includes('百分比') ? `${that.dataValue[params.dataIndex + 1][params.seriesIndex + 1]}%` : ''
              const isMeasure = that.checkList.includes('度量') ? `${that.dataValue[params.dataIndex + 1][params.seriesIndex + 1]}` : ''
              return isPercent + '\n' + isMeasure
            }
          },
          stack: 'Total',
          areaStyle: {},
          labelLayout: {
            hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          connectNulls: this.resolveNull(FunctionalOption),
          itemStyle: this.getItemStyle(ComponentOption)// 图形样式配置-颜色
        })
        if (ComponentOption.TwisYAxis?.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
          this.series[i].stack = yAxisIndex === 1 ? 'other' : 'Total'
        }
      }
    },
    // 双y轴设置
    twisYAxisConfig (componentOption) {
      // 双y轴设置与坐标轴设置相关联，其中关于y轴模块暂时固定，后续需切换成坐标轴设置的值
      if (componentOption.TwisYAxis?.check) {
        const formatter = this.type === 'PercentStackedBarChart' ? '{value}%' : '{value}'

        // 最大值和最小值暂时固定，后续需要修改 TODO
        const minData1 = componentOption.TwisYAxis?.twisType === 'syncAll' ? minData2 : -10
        const minData2 = 0
        const maxData2 = 100
        const maxData1 = componentOption.TwisYAxis?.twisType === 'syncAll' ? maxData2 : 100
        const intervalNum1 = componentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData1 - minData1) / 5 : null
        const intervalNum2 = componentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null
        this.yAxis = [
          {
            type: 'value',
            min: minData1,
            max: maxData1,
            axisLine: {
              show: true
            },
            interval: intervalNum1,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: formatter
            }
          },
          {
            type: 'value',
            interval: intervalNum2,
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            },
            axisLabel: {
              formatter: formatter
            }
          }
        ]
        this.xAxis.unshift({ type: 'category' })
      } else {
        this.setAxis()
      }
    }
  }
}
