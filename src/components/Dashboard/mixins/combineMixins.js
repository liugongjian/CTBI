// 组合图的混入
import baseMixins from './baseMixins'
import { deepClone } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
      series: [],
      yAxis: [],
      grid: {}
    }
  },
  methods: {
    /* 获取不同类型的series 0代表主轴 1代表副轴*/
    getSeries () {
      let seriesLength = 0
      if (this.dataValue && this.dataValue.length > 0) {
        this.dataValue.forEach(item => {
          seriesLength = item.length - 1
        })
      } else {
        return
      }
      this.series = []
      for (let i = 1; i <= seriesLength; i++) {
        if (this.dataValue[0][i].indexOf('-1') > -1) {
          this.series.push({ type: 'line', yAxisIndex: 1, name: this.dataValue[0][i].split('-1')[0] })
        } else {
          this.series.push({ type: 'bar', name: this.dataValue[0][i] })
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

      // if (this.storeOption.theme.ComponentOption.TwisYAxis?.show) {
      // // 最大值和最小值暂时固定，后续需要修改
      //   const minData1 = this.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncAll' ? minData2 : -10
      //   const minData2 = 0
      //   const maxData2 = 100
      //   const maxData1 = this.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncAll' ? maxData2 : 100
      //   const intervalNum1 = this.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData1 - minData1) / 5 : null
      //   const intervalNum2 = this.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null

      //   // let minData1, minData2, maxData1, maxData2
      //   // const that = this
      //   // const calcData1 = function (value) {
      //   //   minData1 = Math.floor(value.min / 12) * 10
      //   //   maxData1 = Math.ceil(value.max / 9.5) * 10
      //   //   return minData1
      //   // }
      //   // const calcData2 = function (value) {
      //   //   minData2 = that.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncAll' ? minData1 : Math.floor(value.min / 12) * 10
      //   //   maxData2 = that.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncAll' ? maxData1 : Math.ceil(value.max / 9.5) * 10
      //   //   return minData2
      //   // }
      //   this.yAxis[0] = {
      //     type: 'value',
      //     name: '度量',
      //     axisLabel: {
      //       formatter: '{value}'
      //     },
      //     // min: minData1,
      //     // max: maxData1,
      //     min: minData1,
      //     max: maxData1,
      //     axisLine: {
      //       show: true
      //     },
      //     // interval: that.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData1 - minData1) / 5 : null,
      //     interval: intervalNum1,
      //     splitLine: {
      //       show: false
      //     }
      //   }
      //   this.yAxis[1] = {
      //     type: 'value',
      //     name: '度量',
      //     axisLabel: {
      //       formatter: '{value}'
      //     },
      //     // min: calcData2,
      //     // max: maxData2,
      //     // interval: that.storeOption.theme.ComponentOption.TwisYAxis?.twisType === 'syncTicksNum' ? (maxData2 - minData2) / 5 : null,
      //     interval: intervalNum2,
      //     splitLine: {
      //       show: false
      //     },
      //     axisLine: {
      //       show: true
      //     }
      //   }
      // }
    },
    // 拿到数据中的系列名字
    getSeriesOptions(val) {
      if (val && val.length > 0) {
        const seriesOption = []
        val[0].forEach((item, index) => {
          // if (index) {
          //   seriesOption.push({ value: item, label: item.split('-')[0] })
          // }
          if (index) {
            const oldItem = this.storeOption.theme.SeriesSetting.SeriesSelect.seriesOption.find(sub => {
              return sub.label === item.split('-')[0]
            })
            if (oldItem) {
              seriesOption.push(deepClone(oldItem))
            } else {
              seriesOption.push({ value: item, label: item.split('-')[0], showLabel: false, labelColor: null, showMax: false, showMark: false, lineType: 'solid' })
            }
          }
        })

        this.storeOption.theme.SeriesSetting.SeriesSelect.seriesOption = seriesOption
        this.storeOption.theme.SeriesSetting.SeriesSelect.selectValue = seriesOption[0].value
        this.storeOption.theme.SeriesSetting.SeriesSelect.remark = seriesOption[0].value
      }
    },
    getNameList(val) {
      // 取到度量的名字数组
      const titleList = val[0].slice(1).map((j) => {
        return j.split('-')[0]
      })
      // baseMixins中的方法
      this.getColor(titleList)
    },
    // 系列设置
    setSeriesItem () {
      const { SeriesSelect } = this.storeOption.theme.SeriesSetting
      this.series = this.series.map((item) => {
        const option = SeriesSelect.seriesOption.find(ele => {
          return ele.value.split('-')[0] === item.name
        })
        if (option) {
          const { labelColor, showLabel, showMax, showMark, markType, lineType } = option
          const ChartLabel = this.storeOption.theme.ComponentOption.ChartLabel
          item.label = item.label || {}
          item.label.show = item.label.show = ChartLabel.check || showLabel
          item.label.color = labelColor
          item.lineStyle = {
            type: lineType
          }
          if (showMax) {
            item.markPoint = {
              symbol: 'pin',
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
          if (showMark) {
            item.symbol = markType
            item.symbolSize = 5
          } else {
            item.symbol = 'circle'
            item.hoverAnimation = false
            item.symbolSize = 5
          }
        }
        return item
      })
    }
  }
}
