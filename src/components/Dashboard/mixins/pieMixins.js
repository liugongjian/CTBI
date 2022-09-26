// 饼图的混入
import baseMixins from './baseMixins'
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import store from '@/store'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
      grid: {},
      dataOption: []
    }
  },
  watch: {
    storeOption: {
      handler(val) {
        this.getOption()
      },
      deep: true
    },
    // 图表类型切换
    'storeOption.is': {
      handler (val) {
        const isData = this.dataOption.findIndex(item => {
          return item.id === this.identify
        })
        if (isData !== -1) {
          this.$bus.$emit('interReload', [this.identify], 100, false)
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatDataValue(deepClone(this.chartData))
      // 拿到数据中的系列名字
      this.getSeriesOptions(this.dataValue)
      // 拿到数据的系列名字 并设置颜色
      this.getNameList(this.dataValue)
      // 拿到数据中的指标
      this.getIndicatorOptions(this.dataValue)
      this.getOption()
    },
    formatDataValue (chartData) {
      const dataValue = []
      const DimensionKey = []
      const MeasureKey = []
      const { data, fields } = chartData
      if (data && data.length > 0) {
        for (const key in fields) {
          if (Object.hasOwnProperty.call(fields, key)) {
            const element = fields[key]
            if (key === 'Dimension') {
              element.fields.forEach(field => {
                DimensionKey.push(field.displayColumn)
              })
            } else if (key === 'Measure') {
              element.fields.forEach(field => {
                MeasureKey.push(field.displayColumn)
              })
            }
          }
        }
        dataValue.push([DimensionKey.join('-'), ...MeasureKey])
        data.forEach(item => {
          const dimensionData = []
          const measureData = []

          MeasureKey.forEach(mea => {
            if (Number(item[mea]) < 0) {
              measureData.push(0)
            } else {
              measureData.push(item[mea])
              // measureData.push(item[mea].match(/\d+(?:\.\d+)?/g, ''))
            }
          })
          DimensionKey.forEach(dim => {
            dimensionData.push(item[dim])
          })
          dataValue.push([dimensionData.join('-'), ...measureData])
        })
      }
      return dataValue
    },
    // 拿到数据中的系列名字
    getSeriesOptions(val) {
      if (val && val.length > 0) {
        const seriesOption = []
        val.forEach((item, index) => {
          if (index) {
            seriesOption.push({ value: item[0], label: item[0], remark: item[0] })
          }
        })

        this.storeOption.theme.SeriesSetting.SeriesSelect.seriesOption = seriesOption
        this.storeOption.theme.SeriesSetting.SeriesSelect.selectValue = seriesOption[0].value
        this.storeOption.theme.SeriesSetting.SeriesSelect.remark = seriesOption[0].value
      }
    },
    // 拿到数据的系列名字 并设置颜色
    getNameList(val) {
      const titleList = []
      val.forEach((j, index) => {
        if (index > 0) {
          titleList.push(j[0])
        }
      })
      // baseMixins中的方法
      this.getColor(titleList)
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
      this.storeOption.theme.FunctionalOption.ChartFilter.selectedIndicator = indicatorOptions[0].value
    },
    // 合并数据为其他 val val为1 就是保留最大的一个数据 其他数据合并为其他
    transformData (val, indicator) {
      if (this.dataValue && this.dataValue.length > 0) {
        // 取到指标的下标 如 2015年 index为1
        const indicatorIdx = this.dataValue[0].indexOf(indicator) > -1 ? this.dataValue[0].indexOf(indicator) : 1
        // 取除维度以外的第1列为vlaue
        let data = []
        for (let i = 1; i < this.dataValue.length; i++) {
          data.push({ name: this.dataValue[i][0], value: Number(this.dataValue[i][indicatorIdx]) })
        }
        // 数据按数值从大到小排序
        data = data.sort((a, b) => { return Number(b.value) - Number(a.value) })
        const showCount = val // 单独显示的数据条数
        if (data.length > showCount) {
        // 数据大于9条时将前9条单独显示
          const dataTemp = data.splice(0, showCount)
          let leftSum = 0
          // 剩余数据合并
          data.forEach(d => { leftSum += Number(d.value) })
          data = dataTemp.concat({ name: '其他合计', value: leftSum })
        }
        const aTemp = []
        aTemp[0] = [].concat(this.dataValue[0][0], this.dataValue[0][indicatorIdx])
        //  val+2 行
        for (let i = 1; i < val + 2; i++) {
          aTemp[i] = [].concat([data[i - 1].name, data[i - 1].value])
        }
        return aTemp
      }
    }

  }
}
