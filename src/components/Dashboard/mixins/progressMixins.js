/*
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:48:45
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 15:05:11
 * @Description:
 */
// 仪表盘的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
export default {
  mixins: [baseMixins],
  methods: {
    // 拿到数据的系列名字 并设置颜色
    getColor (val) {
      const color = []
      const colorValue = colorTheme[this.storeOption.theme.ComponentOption.Color.theme]
      val.forEach((item, index) => {
        const idx = (index) % colorValue.length
        color.push({ name: item.name, color: colorValue[idx].value, remark: item.name })
      })

      this.storeOption.theme.ComponentOption.Color.color = color
    },
    // 获取设置目标值
    getCfgTargetOption (val) {
      const cfgTargetOption = []
      val.forEach(item => {
        cfgTargetOption.push({ name: item.name, value: Number(item.value), fixedVal: Number(item.value), dynamicVal: '', type: 1, aggregation: 1 })
      })
      this.storeOption.theme.FunctionalOption.ProgressConfig.cfgTargetOption = cfgTargetOption
    }
  }
}
