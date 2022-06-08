// 仪表盘的混入
import baseMixins from './baseMixins'
import { getDataValueById, formatDataValue, deepClone } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  watch: {
    storeOption: {
      handler (val) {
        if (JSON.stringify(this.dataValue) !== '{}') {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
        }
        this.getOption()
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
          this.getOption()
        }
      },
      deep: true
    }
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatData(formatDataValue(deepClone(this.chartData)))
      this.getOption()
    },
    formatData(data) {
      // 仪表盘 只有一个度量限制
      const obj = { value: 0 }
      for (let index = 0; index < data.length; index++) {
        if (index === 0) {
          obj.name = data[index][1]
        } else {
          obj.value += data[index][1]
        }
      }
      return obj
    }
  }
}
