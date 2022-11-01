/*
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-07 14:17:14
 * @Description:
 */
// 仪表盘的混入
import _ from 'lodash'
import baseMixins from './baseMixins'
import store from '@/store'
import { getDataSetData, getDataSetShareData } from '@/api/dataSet'
import { formatDataValue, getDataValueById, deepClone, getQueryParams, specialMeasures } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  watch: {
    storeOption: {
      handler (val) {
        // this.getOption()
        this.handleOptionChange()
      },
      deep: true
    },
    // 图表类型切换
    'storeOption.is': {
      handler (val) {
        const isData = this.dataOption.findIndex(item => {
          return item.id === this.identify
        })
        if (isData !== -1) {
          this.$bus.$emit('interReload', [this.identify], 100, false)
        }
      },
      deep: true
    }
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatData(formatDataValue(deepClone(this.chartData)))
      this.getOption()
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
        const measures = specialMeasures(this.identify)
        const allParams = [body]
        measures.forEach(item => {
          const newBody = _.cloneDeep(body)
          newBody.query.measure.selections = [item.data]
          allParams.push(newBody)
        })
        const results = await Promise.all(allParams.map(item => executeMethod(dataSetId, item)))
        // const res = await executeMethod(dataSetId, body)
        this.setConfigValue(measures, results)
        const res = results[0]
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
    setConfigValue(measures, results) {
      this.configSizeValue = {}
      measures.forEach((item, index) => {
        const data = results[index + 1].result.data[0]
        if (data) {
          this.configSizeValue[item.type] = Object.entries(data)[0][1]
        }
      })
    },
    formatData(data) {
      // 仪表盘 只有一个度量限制
      const obj = { value: 0 }
      for (let index = 0; index < data.length; index++) {
        if (index === 0) {
          obj.name = data[index][1]
        } else {
          obj.value += Number(data[index][1])
        }
      }
      return obj
    }
  }
}
