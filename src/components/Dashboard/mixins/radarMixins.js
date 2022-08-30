/*
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 16:32:36
 * @Description:
 */
// 雷达图的混入
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
      this.dataValue = deepClone(this.chartData)
      // 拿到数据的系列名字 并设置颜色
      this.getColor(this.dataValue)
      this.getOption()
    },
    getColor (val) {
      const data = val.fields.Measure.fields
      const colorValue = colorTheme[this.storeOption.theme.ComponentOption.Color.theme]
      const color = []
      data.forEach((item, index) => {
        const idx = (index) % colorValue.length
        color.push({ name: item.column, color: colorValue[idx].value, remark: item.column })
      })
      this.storeOption.theme.ComponentOption.Color.color = color
    }
  }
}
