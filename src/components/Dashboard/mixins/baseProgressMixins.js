// 进度条水波纹公用
import baseMixins from './baseMixins'
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import { colorTheme } from '@/constants/color.js'
export default {
  mixins: [baseMixins],
  data () {
    return {
      storeOption: {},
      chartOption: {},
      dataValue: []
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)
        }
      },
      deep: true
    },
    'storeOption.dataSource': {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          // 获取目标值
          this.getCfgTargetOption(this.dataValue)
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    // 拿到数据的系列名字 并设置颜色
    // 最多五条进度条 不考虑默认颜色是否够用
    getColor (val) {
      const color = []
      val.forEach((item, index) => {
        color.push({ name: item.name, color: colorTheme['defaultColor'][index].value })
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