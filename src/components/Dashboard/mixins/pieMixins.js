// 饼图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
    }
  },
  methods: {
    // 拿到数据中的系列名字
    getSeriesOptions (val) {
      const seriesOption = []
      val.forEach((item, index) => {
        if (index) {
          seriesOption.push({ value: item[0], label: item[0], remark: item[0] })
        }
      })

      this.storeOption.theme.SeriesSetting.SeriesSelect.seriesOption = seriesOption
      this.storeOption.theme.SeriesSetting.SeriesSelect.selectValue = seriesOption[0].value
      this.storeOption.theme.SeriesSetting.SeriesSelect.remark = seriesOption[0].value
    },
    // 拿到数据的系列名字 并设置颜色
    getColor (val) {
      const color = []
      val.forEach((item, index) => {
        if (index) {
          const idx = (index) % colorTheme['defaultColor'].length
          color.push({ name: item[0], color: colorTheme['defaultColor'][idx].value, remark: item[0] })
        }
      })

      this.storeOption.theme.ComponentOption.Color.color = color
    },

    // 拿到数据中的指标
    getIndicatorOptions (val) {
      const indicatorOptions = []
      val[0].forEach((item, index) => {
        if (index) {
          indicatorOptions.push({ value: item, label: item })
        }
      })

      this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption = indicatorOptions
      this.storeOption.theme.FunctionalOption.ChartFilter.filteredSery = indicatorOptions[0].value
    },
    // 合并数据为其他 val val为1 就是保留最大的一个数据 其他数据合并为其他
    transfromData (val, indicator) {
      // 取到指标的下标 如 2015年 index为1
      const indicatorIdx = this.dataValue[0].indexOf(indicator) > -1 ? this.dataValue[0].indexOf(indicator) : 1
      // 取除维度以外的第1列为vlaue
      let data = []
      for (let i = 1; i < this.dataValue.length; i++) {
        data.push({ name: this.dataValue[i][0], value: this.dataValue[i][indicatorIdx] })
      }
      // 数据按数值从大到小排序
      data = data.sort((a, b) => { return b.value - a.value })
      const showCount = val // 单独显示的数据条数
      if (data.length > showCount) {
        // 数据大于9条时将前9条单独显示
        const dataTemp = data.splice(0, showCount)
        let leftSum = 0
        // 剩余数据合并
        data.forEach(d => { leftSum += d.value })
        data = dataTemp.concat({ name: '其他合计', value: leftSum })
      }
      const aTemp = []
      aTemp[0] = [].concat(this.dataValue[0][0], this.dataValue[0][indicatorIdx])
      //  val+2 行
      for (let i = 1; i < val + 2; i++) {
        aTemp[i] = [].concat([data[i - 1].name, data[i - 1].value])
      }
      this.dataValue = aTemp
    }
  }
}
