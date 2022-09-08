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
    console.log('地图混入加载')
    this.$echarts.registerMap('china', chinaJson)
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = formatDataValue(deepClone(this.chartData))
      this.getOption()
    }
  }
}
