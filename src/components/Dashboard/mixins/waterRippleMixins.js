// 水波纹的混入
import baseMixins from './baseMixins'
import { colorTheme } from '@/constants/color.js'
import { formatDataValue, deepClone, getDataValueById } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  watch: {
    storeOption: {
      handler (val) {
        if (this.dataValue.length !== 0) {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
        }
      },
      deep: true
    },
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
    },
    dataOption: {
      handler(val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          // 获取目标值
          this.getCfgTargetOption(this.dataValue)
        }
      },
      deep: true
    }
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatData(formatDataValue(deepClone(this.chartData)))
      // 拿到数据的系列名字 并设置颜色
      this.getColor(this.dataValue)
      // 获取目标值
      this.getCfgTargetOption(this.dataValue)
    },
    formatData(data) {
      const array = []
      data.forEach((item, index) => {
        if (index === 0) {
          for (let i = 0; i < item.length; i++) {
            array[i] = { name: item[i], value: 0 }
          }
        } else {
          for (let i = 0; i < item.length; i++) {
            array[i].value += item[i]
          }
        }
      })
      array.forEach((item, index) => {
        if (item.name === '') {
          array.splice(index, 1)
        }
      })
      return array
    },
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
