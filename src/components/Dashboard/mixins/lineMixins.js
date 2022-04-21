// 折线图的混入
import baseMixins from './baseMixins'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
      series: [],
      yAxis: {},
      tooltip: {}
    }
  },
  methods: {
    /* 获取不同图表类型的series */
    getSeries () {
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      if (this.type === 'LineChart') {
        this.series = []
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'line' })
        }
      } else if (this.type === 'AreaChart') {
        this.series = []
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'line', areaStyle: {} })
        }
      } else if (this.type === 'StackedAreaChart') {
        this.series = []
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'line', stack: 'Total', areaStyle: {} })
        }
      } else if (this.type === 'PercentStackedAreaChart') {
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
        this.series = []
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'line', stack: 'Total', areaStyle: {} })
        }
      }
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
    }
  }
}
