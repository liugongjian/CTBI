// 地图的混入
import baseMixins from './baseMixins'
import chinaJson from './china.json'
export default {
  mixins: [baseMixins],
  data () {
    return {
    }
  },
  mounted () {
    this.$echarts.registerMap('china', chinaJson)
    this.getOption()
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.getOption()
    }
  }
}
