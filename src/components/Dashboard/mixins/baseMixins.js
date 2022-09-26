import store from '@/store'
import { colorTheme } from '@/constants/color.js'
import { getDataSetData, getDataSetShareData } from '@/api/dataSet'
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
      default: store.state.app.currentLayoutId
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
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
        try {
          await this.getData(isReload)
          this.reloadImpl()
        } catch (e) {
          // do nothing
          console.error(e)
        }
      }
    },
    // 获取详细数据
    async getData(isReload = true) {
      const storeDataValue = getDataValueById(this.identify)
      if (storeDataValue && !isReload) {
        this.chartData = deepClone(storeDataValue)
        return
      }

      const params = getQueryParams(this.identify)
      const { dataSetId, query: { dimension, measure } } = params
      // 纬度度量一个格子 拆分维度度量两个list去传参
      const DselectionsTemp = params.query.dimension.selections.filter((item) =>
        item.type === 'Dimension')
      params.query.dimension.selections = DselectionsTemp
      const MselectionsTemp = params.query.measure.selections.filter((item) =>
        item.type === 'Measure'
      )
      params.query.measure.selections = MselectionsTemp
      if (!dataSetId || (dimension.selections.length === 0 && measure.selections.length === 0)) {
        throw new Error('未获取到数据，不做图表加载')
      }

      try {
        this.$bus.$emit('showLoading', this.identify)
        const shareParams = store.state.app.shareDashboardInfo
        const isShareHref = location.pathname.includes('/dashboard/publish/')
        const isInSharePage = isShareHref && shareParams.url // 检测是否来自分享页面
        const body = isInSharePage ? { query: params.query, ...shareParams } : { query: params.query }
        const dataSetId = params.dataSetId
        // 来自分享仪表板页面的数据请求走不同的接口
        const executeMethod = isInSharePage ? getDataSetShareData : getDataSetData
        const res = await executeMethod(dataSetId, body)
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

      // 缩略轴
      const sdz = this.storeOption.theme.FunctionalOption?.DataZoom?.showDataZoom
      // 是否最多展示
      if (this.storeOption.theme.FunctionalOption?.LabelShowType?.axisShowType === 'condense') {
        if (sdz !== 'hide' && legend.top === 'bottom') {
          this.grid.bottom = 200
        } else {
          this.grid.bottom = 150
        }
      } else {
        if (sdz !== 'hide' && legend.top === 'bottom') {
          this.grid.bottom = 100
        }
      }
    },
    // 图例定位
    getLegendLayout(legend) {
      const temp = Object.assign({}, legend)
      // 缩略轴
      const sdz = this.storeOption.theme.FunctionalOption?.DataZoom?.showDataZoom
      if (temp.top === 'bottom' && temp.left === 'center' && sdz !== 'hide') {
        return Object.assign({}, temp, {
          top: 'auto',
          bottom: 50
        })
      }
      return temp
    },
    // 设置颜色
    getColor(titleList) {
      const colorValue = colorTheme[this.storeOption.theme.ComponentOption.Color.theme]
      const oldColorList = deepClone(this.storeOption.theme.ComponentOption.Color.color)
      var newColorList = []
      // 新旧对比控制显示隐藏 isShow false指的是一开始添加了字段 后来被删除
      for (const item of oldColorList) {
        item.isShow = false
      }
      for (var tn of titleList) {
        for (var titem of oldColorList) {
          if (titem.name === tn) {
            titem.isShow = true
          }
        }
      }
      var length = 0
      if (oldColorList.length >= titleList.length) {
        length = oldColorList.length
      } else {
        length = titleList.length
      }
      for (var idx = 0; idx < length; idx++) {
        const name = titleList[idx]
        // 先从旧的数据中寻找
        const oldItem = oldColorList.find(oitem => {
          if (oitem.name === name && oitem.isShow && oitem.isCustom) {
            return oitem
          }
          return undefined
        })
        if (oldItem) {
          newColorList.push(oldItem)
        } else {
          const num = (idx) % colorValue.length
          const newColorItem = { name: name, color: colorValue[num].value, remark: name, isShow: true, isCustom: false }
          newColorList.push(newColorItem)
        }
      }
      this.storeOption.theme.ComponentOption.Color.color = newColorList
    }
  }
}
