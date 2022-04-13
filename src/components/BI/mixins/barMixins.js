// 柱图的混入
import baseMixins from './baseMixins'
export default {
  mixins: [baseMixins],
  data () {
    return {
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
      if (this.type === 'BarChart') { // 为柱图时
        this.series = []
        this.tooltip = {}
        this.yAxis = {}
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar' })
        }
      } else if (this.type === 'StackedBarChart') { // 为堆积柱状图时
        this.series = []
        this.tooltip = {}
        this.yAxis = {}
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', stack: 'Ad' })
        }
      } else if (this.type === 'PercentStackedBarChart') { // 为百分比堆积柱状图时
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
          this.series.push({ type: 'bar', stack: 'Total' })
        }
      }
    }
  }
}
