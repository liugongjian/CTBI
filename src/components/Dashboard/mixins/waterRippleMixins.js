/*
 * @Author: 黄璐璐
 * @Date: 2022-08-19 11:32:45
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-26 14:56:31
 * @Description:
 */
// 进度条水波纹的混入
import baseMixins from './baseMixins'
import { formatDataValue, deepClone, getDataValueById } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  watch: {
    storeOption: {
      handler (val) {
        if (this.dataValue.length !== 0) {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
        }
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
    },
    dataOption: {
      handler(val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
          // 拿到数据的系列名字 并设置颜色
          this.getNameList(this.dataValue)
          // 获取目标值
          this.getCfgTargetOption(this.dataValue)
        }
      },
      deep: true
    }
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatData(formatDataValue(deepClone(this.chartData)))
      // 拿到数据的系列名字 并设置颜色
      this.getNameList(this.dataValue)
      // 获取目标值
      this.getCfgTargetOption(this.dataValue)
    },
    formatData(data) {
      const array = []
      data.forEach((item, index) => {
        if (index === 0) {
          for (let i = 0; i < item.length; i++) {
            array[i] = { name: item[i], value: 0 }
          }
        } else {
          for (let i = 0; i < item.length; i++) {
            array[i].value += Number(item[i])
          }
        }
      })
      array.forEach((item, index) => {
        if (item.name === '') {
          array.splice(index, 1)
        }
      })
      return array
    },
    getNameList(val) {
      // 取到度量的名字数组
      const titleList = val.map((j) => {
        return j.name
      })
      // baseMixins中的方法
      this.getColor(titleList)
    },
    // 获取设置目标值
    getCfgTargetOption (val) {
      const cfgTargetOption = []
      const reCfg = deepClone(this.storeOption.theme.FunctionalOption.ProgressConfig.cfgTargetOption)
      val.forEach(item => {
        const temp = reCfg.find(cfg => { return cfg.name === item.name })
        if (!temp) {
          cfgTargetOption.push({ name: item.name, value: Number(item.value), fixedVal: Number(item.value), dynamicVal: '', type: 1, aggregation: 1 })
        } else {
          cfgTargetOption.push(temp)
        }
      })
      this.storeOption.theme.FunctionalOption.ProgressConfig.cfgTargetOption = cfgTargetOption
    }
  }
}
