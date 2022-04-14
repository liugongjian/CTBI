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
        // 重置数据
        this.series = []
        this.tooltip = {}
        this.yAxis = {}
        this.dataValue = this.storeOption.dataSource

        const label = {}
        label.show = this.storeOption.theme.ComponentOption.BarLabel.show
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', label })
        }
      } else if (this.type === 'StackedBarChart') { // 为堆积柱状图时
        // 重置数据
        this.series = []
        this.tooltip = {}
        this.yAxis = {}
        this.dataValue = this.storeOption.dataSource

        const label = {}
        label.show = this.storeOption.theme.ComponentOption.BarLabel.show // 控制标签显示
        // const isTotal = this.storeOption.theme.ComponentOption.BarLabel.labelValues.includes('总计')
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', stack: 'Total', label })
        }
      } else if (this.type === 'PercentStackedBarChart') { // 为百分比堆积柱状图时
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
          trigger: 'axis',
          formatter: '{b0}<br/>{a0}: {c0}%<br/>{a1}: {c1}%'
        }
        this.series = []
        const label = {}
        label.show = this.storeOption.theme.ComponentOption.BarLabel.show
        for (let i = 0; i < seriesLength; i++) {
          this.series.push({ type: 'bar', stack: 'Total', label })
        }
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
