// 百分比堆叠面积图的混入
import baseMixins from './baseMixins'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
      series: [],
      yAxis: {},
      tooltip: {}

    //   tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //       type: 'cross',
    //       label: {
    //         backgroundColor: '#6a7985'
    //       }
    //     }
    //   },
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
        this.yAxis = {
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value}%'
          },
          show: true
        }
        this.tooltip = {
          trigger: 'axis',
          formatter: '{b0}<br/>{a0}: {c0}%<br/>{a1}: {c1}%'
        }
        this.series = []
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'line', stack: 'Total', areaStyle: {} })
        }
      }
    }
  }
}
