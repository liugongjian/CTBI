// 地图的混入
import baseMixins from './baseMixins'
import chinaJson from './china.json'
import { deepClone, formatDataValue } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  data () {
    return {
      dataValue: null
    }
  },
  mounted () {
    this.$echarts.registerMap('china', chinaJson)
  },
  watch: {
    storeOption: {
      handler (val) {
        this.getOption()
      },
      deep: true
    }
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = formatDataValue(deepClone(this.chartData))
      this.getOption()
    },
    getCenter(name) {
      const { features } = chinaJson
      const result = features.find(item => {
        return item.properties.name === name
      })
      if (result) {
        return result.properties.center
      }
      return []
    },
    getMin (originValue, value) {
      let temp = originValue
      if (!temp) {
        temp = value
      }
      if (Number.parseFloat(temp) > Number.parseFloat(value)) {
        temp = value
      }
      return temp
    },
    getMax (originValue, value) {
      let temp = originValue
      if (!temp) {
        temp = value
      }
      if (Number.parseFloat(temp) < Number.parseFloat(value)) {
        temp = value
      }
      return temp
    }
  }
}
