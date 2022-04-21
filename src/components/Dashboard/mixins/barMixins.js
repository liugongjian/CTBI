// 柱图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'

export default {
  mixins: [baseMixins],
  data () {
    return {
      xAxis: { type: 'category' },
      yAxis: {}
    }
  },
  computed: {
    checkList () {
      return this.storeOption.theme.ComponentOption.ChartLabel.checkList
    }
  },
  methods: {

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
          color.push({ name: item, color: colorTheme['defaultColor'][idx].value })
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
      val[0].forEach((item, index) => {
        if (index) {
          indicatorOptions.push({ value: item, label: item })
        }
      })

      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption = indicatorOptions
      this.storeOption.theme.FunctionalOption.ChartFilter.filteredSery = indicatorOptions[0].value
    },
    // 双y轴设置
    twisYAxisConfig (componentOption) {
      if (componentOption.TwisYAxis.show) {
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
        this.xAxis = [
          {
            type: 'category'

          },
          {
            type: 'category'
          }
        ]
      } else {
        this.yAxis = {}
        this.xAxis = { type: 'category' }
      }
    },
    // 将数据转换成百分比
    valueToPercent () {
      const sumArr = []
      for (let ii = 0; ii < this.dataValue[0].length - 1; ii++) {
        sumArr.push(0)
      }
      for (let i = 1; i < this.dataValue.length; i++) {
        for (let j = 0; j < sumArr.length; j++) {
          sumArr[j] += this.dataValue[i][j + 1]
        }
      }
      for (let i = 1; i < this.dataValue.length; i++) {
        for (let j = 0; j < sumArr.length; j++) {
          this.dataValue[i][j + 1] = (this.dataValue[i][j + 1] / sumArr[j] * 100).toFixed(2)
        }
      }
    },

    // 获取堆积柱状图
    getStackSeries (componentOption) {
      this.series = []
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      // 双Y轴设置
      this.twisYAxisConfig(componentOption)
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
        if (componentOption.TwisYAxis.show) {
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
        type: 'bar',
        label: {
          show: componentOption.ChartLabel.check && this.checkList.includes('总计'), // 标签显示
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
          hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
        },
        itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
      })
    },

    // 获取百分比堆积柱状图
    getPercentStackSeries (componentOption) {
      this.series = []
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      // 双Y轴设置
      this.twisYAxisConfig(componentOption)
      this.valueToPercent()
      const that = this
      if (!componentOption.TwisYAxis.show) {
        this.yAxis = {
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value}%'
          },
          show: true
        }
      }
      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'bar',
          name: this.dataValue[0][i + 1],
          label: {
            show: componentOption.ChartLabel.check, // 标签显示
            formatter: function (params) {
              const isPercent = that.checkList.includes('百分比') ? `${that.dataValue[params.dataIndex + 1][params.seriesIndex + 1]}%` : ''
              const isMeasure = that.checkList.includes('度量') ? `${that.storeOption.dataSource[params.dataIndex + 1][params.seriesIndex + 1]}` : ''
              return isPercent + '\n' + isMeasure
            }
          },
          stack: 'Total',
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
        if (componentOption.TwisYAxis.show) {
          const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
          this.series[i].yAxisIndex = yAxisIndex
          this.series[i].stack = yAxisIndex === 1 ? 'other' : 'Total'
        }
      }
    },

    // 系列设置
    setSeriesItem () {
      const { SeriesSelect, SeriesChartLabel } = this.storeOption.theme.SeriesSetting
      this.series = this.series.map((item) => {
        if (SeriesSelect?.selectValue === item.name) {
          item.label.show = SeriesChartLabel.check
          item.label.color = SeriesChartLabel.color
          if (this.storeOption.theme.SeriesSetting.SeriesMaximum.check) {
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
    }
  }
}
