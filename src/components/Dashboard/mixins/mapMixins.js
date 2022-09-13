// 地图的混入
import baseMixins from './baseMixins'
import chinaJson from './china.json'
import { deepClone, formatDataValue, getParameter } from '@/utils/optionUtils'
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
    },
    setTotal() {
      const totalShow = getParameter(this.storeOption, 'theme.ComponentOption.TotalShow.show')
      // 获取数据
      let sum = 0
      if (totalShow && this.dataValue) {
        for (let i = 1; i < this.dataValue.length; i++) {
          sum += Number(this.dataValue[i][1])
        }
      }
      this.storeOption.theme.ComponentOption.TotalShow.value = sum
    },
    getItemStyle() {
      const itemStyle = {
        areaColor: '#EBEDF0',
        borderColor: '#fff'
      }
      const { show, areaColor, borderColor } = getParameter(this.storeOption, 'theme.ComponentOption.MapItemStyle')
      if (show) {
        itemStyle.areaColor = areaColor
        itemStyle.borderColor = borderColor
      }
      return itemStyle
    }

  }
}
