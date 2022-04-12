// 折线图的混入
import baseMixins from './baseMixins'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
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
      }
    }
  }
}
