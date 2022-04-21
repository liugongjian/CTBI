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
          this.series.push({ type: 'bar', name: this.dataValue[0][i] })
        } else {
          this.series.push({ type: 'line', yAxisIndex: 1, name: this.dataValue[0][i] })
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

      if (this.storeOption.theme.ComponentOption.TwisYAxis.show) {
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
        this.yAxis[0] = {
          type: 'value',
          name: '度量',
          axisLabel: {
            formatter: '{value}'
          },
          // min: minData1,
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
          }
        }
        this.yAxis[1] = {
          type: 'value',
          name: '度量',
          axisLabel: {
            formatter: '{value}'
          },
          // min: calcData2,
          // max: maxData2,
          // interval: that.storeOption.theme.ComponentOption.TwisYAxis.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null,
          interval: intervalNum2,
          splitLine: {
            show: false
          },
          axisLine: {
            show: true
          }
        }
      }
    }
  }
}
