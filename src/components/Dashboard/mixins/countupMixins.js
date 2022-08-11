/*
 * @Author: 黄璐璐
 * @Date: 2022-08-01 14:25:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-01 16:14:21
 * @Description: 翻牌器的混入
 */
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
      const obj = []
      const { data, fields } = dataValue
      if (data && data.length > 0) {
        for (const key in fields) {
          // 比较特殊 这个度量就一个
          fields[key]['fields'].forEach((field, index) => {
            const column = field.column
            obj.push({ title: field.column, value: data[index][column] })
          })
        }
      }
      return obj
    },
    // 拿到数据的系列名字 并设置颜色
    getColor (val) {
      const color = []
      val.forEach((item, index) => {
        const idx = (index) % colorTheme['官方'].length
        color.push({ name: item.title, color: colorTheme['官方'][idx].value, remark: item.title })
      })

      this.storeOption.theme.StyleConfig.IndicatorPic.Color.color = color
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
      val.forEach((item, index) => {
        svg.push({ name: item.title, svg: data[index] || 'eyes' })
      })
      this.storeOption.theme.StyleConfig.IndicatorPic.setSvg = svg
    },
    getDataSeries(val) {
      const data = []
      val.forEach(item => {
        data.push({ title: item.title, prefix: '', suffix: '' })
      })
      this.storeOption.theme.SeriesSetting.IndicatorSeries.dataSeries = data
      this.storeOption.theme.SeriesSetting.IndicatorSeries.series = data[0].title
    }

  }
}
