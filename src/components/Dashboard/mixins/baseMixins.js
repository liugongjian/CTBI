import store from '@/store'
import { getDataSetData } from '@/api/dataSet'
import { getLayoutOptionById, getDataValueById, deepClone } from '@/utils/optionUtils'
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
     * @param {Number} limit 数据限制条数
     * @param {Boolean} isReload 是否重新发送请求获取
     */
    async interReload (ids, limit, isReload) {
      if (ids && ids.indexOf(this.identify) > -1) {
        await this.getData(limit, isReload)
        this.reloadImpl()
      }
    },
    // 获取详细数据
    async getData (limit = 1000, isReload = true) {
      const storeDataValue = getDataValueById()
      if (storeDataValue && !isReload) {
        this.chartData = deepClone(storeDataValue)
        return
      }
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
        const dataSetId = option.dataSet.dataSet.id
        const res = await getDataSetData(dataSetId, body)
        res.fields = transformFields
        this.chartData = res

        const storeDataOption = store.state.app.dataOption.find(item => {
          return item.id === this.identify
        })
        // 判断是否已经存在
        const val = deepClone(this.chartData)
        if (storeDataOption) {
          storeDataOption.dataValue = val// 更新数据
        } else {
          store.state.app.dataOption.push({
            dataValue: val,
            id: this.identify
          })
        }
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
