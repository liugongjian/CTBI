import store from '@/store'
import { getDataSetData } from '@/api/dataSet'
import { getLayoutOptionById, getDataValueById, deepClone } from '@/utils/optionUtils'
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
        await this.getData(limit, isReload)
        this.reloadImpl()
      }
    },
    // 获取详细数据
    async getData (limit = 1000, isReload = true) {
      const storeDataValue = getDataValueById(this.identify)
      if (storeDataValue && !isReload) {
        this.chartData = deepClone(storeDataValue)
        return
      }
      const option = getLayoutOptionById(this.identify)
      const { dataSource } = option
      // 维表字段
      const dimension = { selections: [] }
      // 度量字段字段
      const measure = { selections: [] }
      // 字段统计，用于做回显
      const transformFields = {}
      for (const key in dataSource) {
        const source = dataSource[key]
        // TODO：需要定义组件配置type类型来替换用名称做判断
        if (key.toLocaleLowerCase().indexOf('dimension') > -1) {
          dimension.selections = dimension.selections.concat(source.value.map(so => { return { ...so, fieldId: so._id, attributeId: so.attributes[0]._id } }))
        }
        if (key.toLocaleLowerCase().indexOf('measure') > -1) {
          measure.selections = measure.selections.concat(source.value.map(so => { return { ...so, fieldId: so._id, attributeId: so.attributes[0]._id } }))
        }
        transformFields[key] = {
          'name': source.name,
          'fields': source.value
        }
      }
      // 过滤
      const filter = { selections: [] }
      // 排序
      const order = []
      // 查询数据的偏移量默认0
      const offset = 0
      // sql-参数配置中的
      const placeholder = { configs: [] }
      // sql-参数配置中的
      const param = { configs: [] }

      try {
        const body = { query: { limit, dimension, measure, filter, order, offset, placeholder, param } }
        const dataSetId = option.dataSet.id
        const res = await getDataSetData(dataSetId, body)
        this.chartData = {
          fields: transformFields,
          // data: res.result.data
          data: res.data
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
