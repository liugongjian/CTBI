import store from '@/store'
import { getDataSetData } from '@/api/dataSet'
import { getLayoutOptionById, getDataValueById, deepClone, getQueryParams } from '@/utils/optionUtils'
// 图表组件的公共混入
export default {
  data () {
    return {
      // Vuex中缓存的配置项
      storeOption: {},
      // 图表组件数据 - 由接口返回的数据集
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
    this.storeOption = getLayoutOptionById(this.identify)
    this.$bus.$on('interReload', this.interReload)
    console.log(this.identify)
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
        try {
          await this.getData(limit, isReload)
          this.reloadImpl()
        } catch (e) {
          // do nothing
        }
      }
    },
    // 获取详细数据
    async getData (limit = 1000, isReload = true) {
      const storeDataValue = getDataValueById(this.identify)
      if (storeDataValue && !isReload) {
        this.chartData = deepClone(storeDataValue)
        throw new Error('未获取到数据，不做图表加载')
      }

      const params = getQueryParams(limit, this.identify)
      const { dataSetId, query: { dimension, measure } } = params
      if (!dataSetId || (dimension.selections.length === 0 && measure.selections.length === 0)) {
        throw new Error('未获取到数据，不做图表加载')
      }

      try {
        this.$bus.$emit('showLoading', this.identify)
        const body = { query: params.query }
        const dataSetId = params.dataSetId
        const res = await getDataSetData(dataSetId, body)
        this.chartData = {
          fields: params.transformFields,
          data: res.result.data
        }

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
      this.$bus.$emit('closeLoading', this.identify)
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
