// 仪表盘的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
export default {
  mixins: [baseMixins],
  methods: {
    // 拿到数据的系列名字 并设置颜色
    // 最多五条进度条 不考虑默认颜色是否够用
    getColor (val) {
      const color = []
      val.forEach((item, index) => {
        color.push({ name: item.name, color: colorTheme['defaultColor'][index].value })
      })
      this.storeOption.theme.ComponentOption.progressStyle.color = color
    }
  }
}
