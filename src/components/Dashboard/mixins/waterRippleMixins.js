// 水波纹的混入
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
        color.push({ name: item.name, color: colorTheme['官方'][index].value })
      })
      this.storeOption.theme.ComponentOption.progressStyle.color = color
    },
    // 获取设置目标值
    getCfgTargetOption (val) {
      const cfgTargetOption = []
      val.forEach(item => {
        cfgTargetOption.push({ name: item.name, value: item.value, fixedVal: item.value, dynamicVal: '', type: 1, aggregation: 1 })
      })
      this.storeOption.theme.FunctionalOption.progressConfig.cfgTargetOption = cfgTargetOption
    }
  }
}
