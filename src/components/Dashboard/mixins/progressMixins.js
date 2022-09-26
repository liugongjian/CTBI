/*
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:48:45
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-26 15:25:17
 * @Description:
 */
// 仪表盘的混入
import baseMixins from './baseMixins'
export default {
  mixins: [baseMixins],
  methods: {
    // 好像没用到
    getNameList(val) {
      // 取到度量的名字数组
      const titleList = val.map((j) => {
        return j.name
      })
      // baseMixins中的方法
      this.getColor(titleList)
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
