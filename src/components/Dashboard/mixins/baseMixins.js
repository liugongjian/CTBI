
import { getDataSetData } from '@/api/dataSet'
import { getLayoutOptionById } from '@/utils/optionUtils'
// 图表组件的公共混入
export default {
  data () {
    return {
      // 图表组件数据
      chartData: {}
    }
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
    this.$bus.$off('interReload', this.interReload)
  },
  methods: {
    /**
     * 组件重新加载数据事件，需要 组件内加载事件reloadImpl 支持
     * @param {Array} ids 组件id
     */
    async interReload (ids, limit) {
      if (ids && ids.indexOf(this.identify) > -1) {
        await this.getData(limit)
        this.reloadImpl()
      }
    },
    // 获取详细数据
    async getData (limit = 1000) {
      const option = getLayoutOptionById()
      const { dataSource } = option
      let selectFields = []
      const transformFields = {}
      for (const key in dataSource) {
        const source = dataSource[key]
        selectFields = selectFields.concat(source.value)
        transformFields[key] = {
          'name': source.name,
          'fields': source.value
        }
      }

      try {
        const body = { limit, selectFields }
        const dataSetId = selectFields[0].dataSetID
        const res = await getDataSetData(dataSetId, body)
        res.fields = transformFields
        this.chartData = res
      } catch (error) {
        console.log(error)
      }
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
