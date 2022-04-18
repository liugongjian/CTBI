// 组合图的混入
import baseMixins from './baseMixins'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
      series: [],
      yAxis: []
    }
  },
  methods: {
    /* 获取不同类型的series 0代表主轴 1代表副轴*/
    getSeries () {
      let seriesLength = 0
      this.dataValue.forEach(item => {
        seriesLength = item.length - 1
      })
      this.series = []
      for (let i = 1; i <= seriesLength; i++) {
        if (this.dataValue[0][i].indexOf('-0') > -1) {
          this.dataValue[0][i] = this.dataValue[0][i].split('-0')[0]
          this.series.push({ type: 'bar' })
        } else {
          this.dataValue[0][i] = this.dataValue[0][i].split('-1')[0]
          this.series.push({ type: 'line', yAxisIndex: 1 })
        }
      }
      for (let i = 0; i < 2; i++) {
        this.yAxis.push({
          type: 'value',
          name: '度量',
          axisLabel: {
            formatter: '{value}'
          }
        })
      }
    }
  }
}
