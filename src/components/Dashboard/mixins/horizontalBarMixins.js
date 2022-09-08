// 条形图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
import { getLayoutOptionById, getDataValueById } from '@/utils/optionUtils'
import { deepClone, formatDataValue } from '@/utils/optionUtils'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import store from '@/store'
export default {
  mixins: [baseMixins, YAxis],
  data () {
    return {
      storeOption: {},
      chartOption: {},
      dataValue: null,
      series: [],
      dataOption: [],
      xAxis: {},
      yAxis: { type: 'category' },
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
    },
    'storeOption.theme.ComponentOption.PercentStack': {
      handler (val) {
        this.storeOption.theme.ComponentOption.ChartLabel.type = this.type
        if (val.isStack && !val.isPercent) {
          this.storeOption.theme.ComponentOption.ChartLabel.type = 'StackedHorizontalBarChart'
        }
        if (val.isPercent) {
          this.storeOption.theme.ComponentOption.ChartLabel.type = 'PSHorizontalBarChart'
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
    getSeriesOptions (val) {
      // 为空时，进行初始化
      if (val && val.length > 0) {
        const seriesOption = []
        val[0].forEach((item, index) => {
          if (index) {
            seriesOption.push({ value: item, label: item, showLabel: false, labelColor: null, showMax: false })
          }
        })
        this.storeOption.theme.SeriesSetting.SeriesSelect.seriesOption = seriesOption
        this.storeOption.theme.SeriesSetting.SeriesSelect.selectValue = seriesOption[0].value
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
    // 获取图形对应的样式配置-颜色
    getItemStyle (componentOption) {
      // 颜色设置
      const color = componentOption.Color.color
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
    // 双y轴设置
    twisYAxisConfig (componentOption) {
      // 双y轴设置与坐标轴设置相关联，其中关于y轴模块暂时固定，后续需切换成坐标轴设置的值
      if (componentOption.TwisYAxis?.check) {
        const formatter = this.type === 'PSHorizontalBarChart' ? '{value}%' : '{value}'

        // 最大值和最小值暂时固定，后续需要修改
        const minData1 = componentOption.TwisYAxis?.twisType === 'syncAll' ? minData2 : -10
        const minData2 = 0
        const maxData2 = 100
        const maxData1 = componentOption.TwisYAxis?.twisType === 'syncAll' ? maxData2 : 100
        const intervalNum1 = componentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData1 - minData1) / 5 : null
        const intervalNum2 = componentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null
        this.xAxis = [
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
        this.yAxis.unshift({ type: 'category' })
      } else {
        this.setAxis()
      }
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
            sumArr[j] += this.dataValue[j + 1][i]
          }
        }
        for (let i = 1; i < this.dataValue[0].length; i++) {
          for (let j = 0; j < sumArr.length; j++) {
            this.dataValue[j + 1][i] = (this.dataValue[j + 1][i] / sumArr[j] * 100).toFixed(2)
          }
        }
      }
    },

    // 根据筛选的指标获取对应数据
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

    // 获取堆积条形图
    getStackSeries(componentOption) {
      this.dataValue = formatDataValue(deepClone(getDataValueById(this.identify)))
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
      // this.twisYAxisConfig(componentOption)
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'bar',
          name: this.dataValue[0][i + 1],
          label: {
            show: componentOption.ChartLabel.check && this.checkList.includes('度量') // 标签显示
          },
          stack: 'Total',
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
        if (componentOption.TwisYAxis?.check) {
          const xAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].xAxisIndex = xAxisIndex
          this.series[i].stack = xAxisIndex === 1 ? 'other' : 'Total'
        }
      }
      // 插入一个假数据用于生成总计的label
      this.dataValue[0].push('总计')
      for (let i = 1; i < this.dataValue.length; i++) {
        this.dataValue[i] = [...this.dataValue[i], 0]
      }
      this.series.push({
        type: 'bar',
        label: {
          show: componentOption.ChartLabel.check && this.checkList.includes('总计'), // 标签显示
          position: 'right',
          formatter: function (params) {
            let dataTotal = 0
            for (let i = 1; i < params.value.length; i++) {
              dataTotal += Number.parseFloat(params.value[i])
            }
            return dataTotal
          }
        },
        stack: 'Total',
        labelLayout: {
          hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
        },
        itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
      })
    },

    // 获取百分比堆积条形图
    getPercentStackSeries(componentOption) {
      this.dataValue = formatDataValue(deepClone(getDataValueById(this.identify)))
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
      // this.twisYAxisConfig(componentOption)
      this.valueToPercent()
      const that = this
      if (!componentOption.TwisYAxis?.check) {
        this.xAxis[0].axisLabel.formatter = '{value}%'
      }
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'bar',
          name: this.dataValue[0][i + 1],
          label: {
            show: componentOption.ChartLabel.check, // 标签显示
            formatter: function (params) {
              const isPercent = that.checkList.includes('百分比') ? `${that.dataValue[params.dataIndex + 1][params.seriesIndex + 1]}%` : ''
              const isMeasure = that.checkList.includes('度量') ? `${that.dataValue[params.dataIndex + 1][params.seriesIndex + 1]}` : ''
              return isPercent + '\n' + isMeasure
            }
          },
          stack: 'Total',
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
        if (componentOption.TwisYAxis?.check) {
          const xAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].xAxisIndex = xAxisIndex
          this.series[i].stack = xAxisIndex === 1 ? 'other' : 'Total'
        }
      }
    },

    // 系列设置
    setSeriesItem () {
      const { SeriesSelect } = this.storeOption.theme.SeriesSetting
      this.series = this.series.map((item) => {
        const option = SeriesSelect.seriesOption.find(ele => {
          return ele.value === item.name
        })
        if (option) {
          const { labelColor, showLabel, showMax } = option
          const ChartLabel = this.storeOption.theme.ComponentOption.ChartLabel
          item.label.show = ChartLabel.type === 'StackedHorizontalBarChart' ? (this.checkList.includes('度量') && ChartLabel.check) || showLabel : ChartLabel.check || showLabel
          item.label.color = labelColor
          if (showMax) {
            item.markPoint = {
              symbol: 'pin',
              symbolRotate: -90,
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        }
        return item
      })
    },

    // 坐标轴配置
    setAxis () {
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      this.yAxis = [
        {
          type: 'category',
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
            'show': XAxis.showAxisLabel,
            'rotate': this.storeOption.theme.FunctionalOption.LabelShowType.axisShowType === 'condense' ? -90 : 0,
            'interval': 'auto',
            'width': 100,
            'height': 100,
            'overflow': 'truncate'
          },
          'position': this.storeOption.theme.ComponentOption.ChartAlign.align === 'left' ? 'left' : 'right',
          // 轴刻度线
          'axisTick': {
            'show': XAxis.showTicks
          },
          // 网格线
          'splitLine': {
            'show': XAxis.showSplit,
            'lineStyle': {
              'type': XAxis.splitType,
              'color': XAxis.splitColor,
              'width': XAxis.splitWidth
            }
          },
          // 轴标题和单位
          name: XAxis.showTitle ? (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title) : ''
        }
      ]
      this.xAxis = [
        {
          'inverse': this.storeOption.theme.ComponentOption.ChartAlign.align === 'right',
          'axisLine': {
            'show': YAxis.show,
            'lineStyle': {
              'type': YAxis.lineType,
              'width': YAxis.lineWidth,
              'color': YAxis.lineColor
            }
          },
          'min': YAxis.autoMin ? null : YAxis.min,
          'max': YAxis.autoMax ? null : YAxis.max,
          'axisLabel': {
            'show': YAxis.showAxisLabel,
            'width': 100,
            'height': 100,
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
          name: YAxis.showTitle ? (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title) : ''
        }
      ]
    }
  }
}
