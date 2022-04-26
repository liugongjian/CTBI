// 折线图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
export default {
  mixins: [baseMixins, YAxis],
  data: function () {
    return {
      series: [],
      yAxis: {},
      tooltip: {}
    }
  },
  methods: {
    /* 获取不同图表类型的series */
    // getSeries () {
    //   let seriesLength = 0
    //   this.dataValue.forEach(item => {
    //     seriesLength = item.length - 1
    //   })
    //   if (this.type === 'LineChart') {
    //     this.series = []
    //     for (let i = 0; i < seriesLength; i++) {
    //       this.series.push({ type: 'line' })
    //     }
    //   } else if (this.type === 'AreaChart') {
    //     this.series = []
    //     for (let i = 0; i < seriesLength; i++) {
    //       this.series.push({ type: 'line', areaStyle: {} })
    //     }
    //   } else if (this.type === 'StackedAreaChart') {
    //     this.series = []
    //     for (let i = 0; i < seriesLength; i++) {
    //       this.series.push({ type: 'line', stack: 'Total', areaStyle: {} })
    //     }
    //   } else if (this.type === 'PercentStackedAreaChart') {
    //     this.valueToPercent()
    //     this.yAxis = {
    //       axisLabel: {
    //         show: true,
    //         interval: 'auto',
    //         formatter: '{value}%'
    //       },
    //       show: true
    //     }
    //     this.tooltip = {
    //       trigger: 'axis'
    //     }
    //     this.series = []
    //     for (let i = 0; i < seriesLength; i++) {
    //       this.series.push({ type: 'line', stack: 'Total', areaStyle: {} })
    //     }
    //   }
    // },
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
    // 拿到数据的系列名字 并设置颜色
    getColor (val) {
      const color = []
      val[0].forEach((item, index) => {
        if (index) {
          const idx = (index) % colorTheme['defaultColor'].length
          color.push({ name: item.split('-')[0], color: colorTheme['defaultColor'][idx].value, remark: item[0] })
        }
      })

      this.storeOption.theme.ComponentOption.Color.color = color
    },
    // 拿到数据中的指标
    getIndicatorOptions (val) {
      const indicatorOptions = []
      const filteredSery = []
      val[0].forEach((item, index) => {
        if (index) {
          indicatorOptions.push({ value: item, label: item })
          filteredSery.push(item)
        }
      })
      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption = indicatorOptions
      this.storeOption.theme.FunctionalOption.ChartFilter.filteredSery = filteredSery
    },
    // 将数据转换成百分比
    valueToPercent () {
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
            rotate: this.storeOption.theme.FunctionalOption.LabelShowType.axisShowType === 'condense' ? 90 : 0,
            interval: this.storeOption.theme.FunctionalOption.LabelShowType.axisShowType === 'sparse' ? 3 : 'auto'
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
    // 设置图例与图表距离
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
    // 系列设置
    setSeriesItem () {
      const { SeriesSelect } = this.storeOption.theme.SeriesSetting
      const { SeriesChartLabel, SeriesMaximum } = SeriesSelect
      this.series = this.series.map((item) => {
        if (SeriesSelect?.selectValue === item.name) {
          item.label.show = SeriesChartLabel.check
          item.label.color = SeriesChartLabel.color
          if (SeriesMaximum?.check) {
            item.markPoint = {
              symbol: 'pin',
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
    // 获取图形对应的样式配置-颜色
    getItemStyle (ComponentOption) {
      // 颜色设置
      const color = ComponentOption.Color.color
      return {
        color: (data) => {
          if (color[0].name) {
            console.log(',,,,dad', data.seriesName, color)
            const colorTemp = color.find((item) => { return data.seriesName === item.name })
            return colorTemp ? colorTemp.color : 'red'
          } else {
            const index = (data.dataIndex) % color.length
            return color[index].value
          }
        }
      }
    },
    transfromData (indicator) {
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
    },
    // 获取堆积柱状图
    getStackSeries (ComponentOption) {
      this.series = []
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      this.setAxis()
      // 双Y轴设置
      this.twisYAxisConfig(ComponentOption)
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'line',
          name: this.dataValue[0][i + 1],
          label: {
            show: ComponentOption.ChartLabel.check && this.checkList.includes('度量') // 标签显示
          },
          stack: 'Total',
          labelLayout: {
            hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(ComponentOption) // 图形样式配置-颜色
        })
        if (ComponentOption.TwisYAxis.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
          this.series[i].stack = yAxisIndex === 1 ? 'other' : 'Total'
        }
      }
      // 插入一个假数据用于生成总计的label
      this.dataValue[0].push('总计')
      for (let i = 1; i < this.dataValue.length; i++) {
        this.dataValue[i] = [...this.dataValue[i], 0]
      }
      this.series.push({
        type: 'line',
        label: {
          show: ComponentOption.ChartLabel.check && this.checkList.includes('总计'), // 标签显示
          position: 'top',
          formatter: function (params) {
            let dataTotal = 0
            for (let i = 1; i < params.value.length; i++) {
              dataTotal += params.value[i]
            }
            return dataTotal
          }
        },
        stack: 'Total',
        labelLayout: {
          hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
        },
        itemStyle: this.getItemStyle(ComponentOption) // 图形样式配置-颜色
      })
    },

    // 获取百分比堆积柱状图
    getPercentStackSeries (ComponentOption) {
      this.series = []
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      this.setAxis()
      // 双Y轴设置
      this.twisYAxisConfig(ComponentOption)
      this.valueToPercent()
      const that = this
      if (!ComponentOption.TwisYAxis.check) {
        this.yAxis[0].axisLabel.formatter = '{value}%'
      }
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'line',
          name: this.dataValue[0][i + 1],
          label: {
            show: ComponentOption.ChartLabel.check, // 标签显示
            formatter: function (params) {
              const isPercent = that.checkList.includes('百分比') ? `${that.dataValue[params.dataIndex + 1][params.seriesIndex + 1]}%` : ''
              const isMeasure = that.checkList.includes('度量') ? `${that.storeOption.dataSource[params.dataIndex + 1][params.seriesIndex + 1]}` : ''
              return isPercent + '\n' + isMeasure
            }
          },
          stack: 'Total',
          labelLayout: {
            hideOverlap: ComponentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(ComponentOption) // 图形样式配置-颜色
        })
        if (ComponentOption.TwisYAxis.check) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
          this.series[i].stack = yAxisIndex === 1 ? 'other' : 'Total'
        }
      }
    },
    // 双y轴设置
    twisYAxisConfig (componentOption) {
      // 双y轴设置与坐标轴设置相关联，其中关于y轴模块暂时固定，后续需切换成坐标轴设置的值
      if (componentOption.TwisYAxis.check) {
        const formatter = this.type === 'PercentStackedBarChart' ? '{value}%' : '{value}'

        // 最大值和最小值暂时固定，后续需要修改
        const minData1 = componentOption.TwisYAxis.twisType === 'syncAll' ? minData2 : -10
        const minData2 = 0
        const maxData2 = 100
        const maxData1 = componentOption.TwisYAxis.twisType === 'syncAll' ? maxData2 : 100
        const intervalNum1 = componentOption.TwisYAxis.twisType === 'syncTicksNum' ? (maxData1 - minData1) / 5 : null
        const intervalNum2 = componentOption.TwisYAxis.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null
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