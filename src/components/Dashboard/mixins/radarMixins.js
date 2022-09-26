/*
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-26 21:18:25
 * @Description:
 */
// 雷达图的混入
import baseMixins from './baseMixins'
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
      this.getNameList(this.dataValue)
      this.getOption()
    },
    // 拿到数据的系列名字 并设置颜色
    getNameList(val) {
      const data = val.fields.Measure.fields
      const titleList = data.map((j) => {
        return j.displayColumn
      })
      // baseMixins中的方法
      this.getColor(titleList)
    }
  }
}
