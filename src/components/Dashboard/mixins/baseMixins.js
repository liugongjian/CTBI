import { getDataSetData } from '@/api/dataSet'
// 图表组件的公共混入
export default {
  data () {
    return {}
  },
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.$bus.$on('interReload', this.interReload)
  },
  beforeDestroy () {
  },
  methods: {
    /**
     * 组件重新加载数据事件，需要 组件内加载事件reloadImpl 支持
     * @param {Array} ids 组件id
     */
    interReload (ids) {
      if (ids && ids.indexOf(this.identify) > -1) {
        this.reloadImpl()
      }
    },
    // 获取详细数据
    async getData (selectFields, dataSetID) {
      try {
        const body = {
          limit: this.limit,
          selectFields
        }
        const dataSetId = dataSetID || selectFields[0].dataSetID
        const res = await getDataSetData(dataSetId, body)
        return res
      } catch (error) {
        console.log(error)
      }
      return null
    },
    // 设置图例与图表距离
    setGrid (legend) {
      if (legend.top === 'auto' && legend.left === 'center') { // 图例在上
        this.grid = {
          top: 50
        }
      } else if (legend.top === 'bottom' && legend.left === 'center') { // 图例在下
        this.grid = {
          bottom: 50
        }
      } else if (legend.top === 'center' && legend.left === 'auto') { // 图例在左
        this.grid = {
          left: 120
        }
      } else if (legend.top === 'center' && legend.left === 'right') { // 图例在右
        this.grid = {
          right: 120
        }
      }
    }
  }
}
