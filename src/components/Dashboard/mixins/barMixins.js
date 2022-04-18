// 柱图的混入
import baseMixins from './baseMixins'
import { deepClone } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  data () {
    return {
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
        }
      } else if (this.type === 'StackedBarChart') { // 为堆积柱状图时
        this.mixinItem()
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', stack: 'Total', label: this.label, labelLayout: this.labelLayout })
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
        this.yAxis = {
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value}%'
          },
          show: true
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
        }
      }
    },

    // 公共部分
    mixinItem () {
      // 重置数据
      this.series = []
      this.tooltip = {}
      this.yAxis = {}
      this.dataValue = deepClone(this.storeOption.dataSource)

      // 图表标签
      this.label.show = this.storeOption.theme.ComponentOption.ChartLabel.check && this.checkList.includes('度量')
      this.label.formatter = null
      this.labelLayout.hideOverlap = this.storeOption.theme.ComponentOption.ChartLabel.labelShow === 1
      this.label.position = ''
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
