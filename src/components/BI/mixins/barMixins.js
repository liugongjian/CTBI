// 柱图的混入
import baseMixins from './baseMixins'
import { deepClone } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  data () {
    return {
      xAxis: { type: 'category' },
      yAxis: {},
      tooltip: {},
      label: {},
      labelLayout: {}
    }
  },
  computed: {
    checkList () {
      return this.storeOption.theme.ComponentOption.ChartLabel.checkList
    }
  },
  methods: {
    /* 获取不同图表类型的series */
    getSeries () {
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      if (this.type === 'BarChart') { // 为柱图时
        this.mixinItem()
        this.label.show = this.storeOption.theme.ComponentOption.ChartLabel.check
        this.label.position = 'top'
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', label: this.label, labelLayout: this.labelLayout })
          if (this.storeOption.theme.ComponentOption.TwisYAxis.show) {
            const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
            this.series[i].yAxisIndex = yAxisIndex
          }
        }
      } else if (this.type === 'StackedBarChart') { // 为堆积柱状图时
        this.mixinItem()
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', stack: 'Total', label: this.label, labelLayout: this.labelLayout })
          if (this.storeOption.theme.ComponentOption.TwisYAxis.show) {
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
        this.series.push({ type: 'bar', stack: 'Total', label: this.label, labelLayout: this.labelLayout })
        this.series[seriesLength]['label'] = {
          show: this.storeOption.theme.ComponentOption.ChartLabel.check && this.checkList.includes('总计'),
          position: 'top',
          formatter: function (params) {
            let dataTotal = 0
            for (let i = 1; i < params.value.length; i++) {
              dataTotal += params.value[i]
            }
            return dataTotal
          }
        }
      } else if (this.type === 'PercentStackedBarChart') { // 为百分比堆积柱状图时
        this.mixinItem()
        this.valueToPercent()
        if (!this.storeOption.theme.ComponentOption.TwisYAxis.show) {
          this.yAxis = {
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value}%'
            },
            show: true
          }
        }

        this.tooltip = {
          trigger: 'axis'
        }
        const that = this
        this.label.formatter = function (params) {
          const isPercent = that.checkList.includes('百分比') ? `${that.dataValue[params.dataIndex + 1][params.seriesIndex + 1]}%` : ''
          const isMeasure = that.checkList.includes('度量') ? `${that.storeOption.dataSource[params.dataIndex + 1][params.seriesIndex + 1]}` : ''
          return isPercent + '\n' + isMeasure
        }
        this.label.show = this.storeOption.theme.ComponentOption.ChartLabel.check
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', stack: 'Total', label: this.label, labelLayout: this.labelLayout })
          if (this.storeOption.theme.ComponentOption.TwisYAxis.show) {
            const yAxisIndex = i + 1 > Math.round(seriesLength / 2) ? 1 : 0
            this.series[i].yAxisIndex = yAxisIndex
            this.series[i].stack = yAxisIndex === 1 ? 'other' : 'Total'
          }
        }
      }
    },

    // 公共部分
    mixinItem () {
      // 重置数据
      this.series = []
      this.tooltip = {}
      this.dataValue = deepClone(this.storeOption.dataSource)

      // 图表标签
      this.label.show = this.storeOption.theme.ComponentOption.ChartLabel.check && this.checkList.includes('度量')
      this.label.formatter = null
      this.labelLayout.hideOverlap = this.storeOption.theme.ComponentOption.ChartLabel.labelShow === 1
      this.label.position = ''

      // 双Y轴设置
      if (this.storeOption.theme.ComponentOption.TwisYAxis.show) {
        const formatter = this.type === 'PercentStackedBarChart' ? '{value}%' : '{value}'

        // 最大值和最小值暂时固定，后续需要修改
        const minData1 = this.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncAll' ? minData2 : -10
        const minData2 = 0
        const maxData2 = 100
        const maxData1 = this.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncAll' ? maxData2 : 100
        const intervalNum1 = this.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncTicksNum' ? (maxData1 - minData1) / 5 : null
        const intervalNum2 = this.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null

        // let minData1, minData2, maxData1, maxData2
        // const that = this
        // const calcData1 = function (value) {
        //   minData1 = Math.floor(value.min / 12) * 10
        //   maxData1 = Math.ceil(value.max / 9.5) * 10
        //   return minData1
        // }
        // const calcData2 = function (value) {
        //   minData2 = that.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncAll' ? minData1 : Math.floor(value.min / 12) * 10
        //   maxData2 = that.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncAll' ? maxData1 : Math.ceil(value.max / 9.5) * 10
        //   return minData2
        // }
        this.yAxis = [
          {
            type: 'value',
            // min: calcData1,
            // max: maxData1,
            min: minData1,
            max: maxData1,
            axisLine: {
              show: true
            },
            // interval: that.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncTicksNum' ? (maxData1 - minData1) / 5 : null,
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
            // min: calcData2,
            // max: maxData2,
            min: minData2,
            max: maxData2,
            // interval: that.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null,
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
        console.log(this.yAxis)
        this.xAxis = [
          {
            type: 'category'

          },
          {
            type: 'category',
            position: 'bottom'
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
    }
  }
}
