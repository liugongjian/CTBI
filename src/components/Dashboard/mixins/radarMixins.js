// 雷达图的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
export default {
  mixins: [baseMixins],
  methods: {
    getColor (val) {
      const color = []
      val.forEach((item, index) => {
        const idx = (index) % colorTheme['defaultColor'].length
        color.push({ name: item[0], color: colorTheme['defaultColor'][idx].value, remark: item[0] })
      })
      this.storeOption.theme.ComponentOption.RadarColor.color = color
    }
  }
}
