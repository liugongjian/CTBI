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
          if (key === 'Dimension') {
            const column = fields[key]['fields'][0].column
            obj = data.map(item => { return { name: item[column], data: [] } })
          } else if (key === 'Measure') {
            fields[key]['fields'].forEach((field, index) => {
              const column = field.column
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
    getColor (val) {
      const color = []
      val.forEach((item, index) => {
        const idx = (index) % colorTheme['官方'].length
        color.push({ name: item.name, color: colorTheme['官方'][idx].value, remark: item.name })
      })

      this.storeOption.theme.StyleConfig.IndexQuickly.color = color
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
        svg.push({ name: item.name, svg: data[index] || 'eyes' })
      })
      this.storeOption.theme.StyleConfig.IndexQuickly.setSvg = svg
    },
    getDataSeries(val) {
      const data = []
      val[0].data.forEach(item => {
        data.push({ title: item.title, prefix: '', suffix: '' })
      })
      this.storeOption.theme.SeriesSetting.kanBanSeries.dataSeries = data
    }

  }
}
