// 饼图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
import { deepClone } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  watch: {
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
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatData(deepClone(this.chartData))
      this.getNameSvg(this.dataValue)
      this.getColor(this.dataValue)
      this.getDataSeries(this.dataValue)
    },
    formatData(dataValue) {
      let obj = []
      const { data, fields } = dataValue
      if (data && data.length > 0) {
        for (const key in fields) {
          // 这个地方是不是写的有问题? 要是没有维度呢 维度并不是必填的
          if (key === 'Dimension') {
            if (fields[key]['fields'].length > 0) {
              const column = fields[key]['fields'][0].displayColumn
              obj = data.map(item => { return { name: item[column], data: [] } })
            } else {
              obj = data.map(item => { return { name: '', data: [] } })
            }
          } else if (key === 'Measure') {
            fields[key]['fields'].forEach((field, index) => {
              const column = field.displayColumn
              obj.forEach((item, i) => {
                item.data.push({ title: column, value: data[i][column] })
              })
            })
          }
        }
      }
      return obj
    },
    // 拿到数据的系列名字 并设置颜色
    getColor(val) {
      let dataTemp = []
      if (this.storeOption.dataSource.Dimension.value.length > 0) {
        // 有维度的话
        dataTemp = val
      } else {
        dataTemp = val[0].data
      }
      if (dataTemp.length !== this.storeOption.theme.StyleConfig.IndicatorPic.Color.color.length) {
        const color = []
        const colorValue = colorTheme[this.storeOption.theme.StyleConfig.IndicatorPic.Color.theme]
        if (this.storeOption.dataSource.Dimension.value.length > 0) {
          dataTemp.forEach((item, index) => {
            const idx = (index) % colorValue.length
            color.push({ name: item.name, color: colorValue[idx].value, remark: item.name })
          })
        } else {
          dataTemp.forEach((item, index) => {
            const idx = (index) % colorValue.length
            color.push({ name: item.title, color: colorValue[idx].value, remark: item.title })
          })
        }
        this.storeOption.theme.StyleConfig.IndicatorPic.Color.color = color
      }
    },
    getNameSvg(val) {
      const svg = []
      const data = [
        'earth',
        'footprints',
        'love',
        'collection',
        'eyes'
      ]
      // 有维度的话
      if (this.storeOption.dataSource.Dimension.value.length > 0) {
        val.forEach((item, index) => {
          svg.push({ name: item.name, svg: data[index] || 'eyes' })
        })
      } else {
        val[0].data.forEach((item, index) => {
          svg.push({ name: item.title, svg: data[index] || 'eyes' })
        })
      }
      this.storeOption.theme.StyleConfig.IndicatorPic.setSvg = svg
    },
    getDataSeries(val) {
      const data = []
      val[0].data.forEach(item => {
        data.push({ title: item.title, prefix: '', suffix: '' })
      })
      this.storeOption.theme.SeriesSetting.IndicatorSeries.dataSeries = data
      this.storeOption.theme.SeriesSetting.IndicatorSeries.series = data[0].title
    }

  }
}
