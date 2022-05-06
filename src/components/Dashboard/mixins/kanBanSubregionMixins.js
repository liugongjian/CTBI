// 饼图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
export default {
  mixins: [baseMixins],
  methods: {
    // 拿到数据的系列名字 并设置颜色
    getColor (val) {
      const color = []
      val.forEach((item, index) => {
        const idx = (index) % colorTheme['defaultColor'].length
        color.push({ name: item.name, color: colorTheme['defaultColor'][idx].value, remark: item.name })
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
