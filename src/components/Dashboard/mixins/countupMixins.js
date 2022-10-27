/*
 * @Author: 黄璐璐
 * @Date: 2022-08-01 14:25:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-10-20 11:05:10
 * @Description: 翻牌器的混入
 */
import baseMixins from './baseMixins'
import { deepClone } from '@/utils/optionUtils'
export default {
  mixins: [baseMixins],
  watch: {
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
      this.dataValue = this.formatData(deepClone(this.chartData))
      this.getNameSvg(this.dataValue)
      this.getNameList(this.dataValue)
    },
    formatData(dataValue) {
      const obj = []
      const { data, fields } = dataValue
      if (data && data.length > 0) {
        for (const key in fields) {
          // 比较特殊 这个度量就一个
          fields[key]['fields'].forEach((field, index) => {
            const displayColumn = field.displayColumn
            obj.push({ title: field.displayColumn, value: data[index][displayColumn] })
          })
        }
      }
      return obj
    },
    // 拿到数据的系列名字 并设置颜色
    getNameList(val) {
      // 取到度量的名字数组
      const titleList = val.map((j) => {
        return j.title
      })
      // baseMixins中的方法
      this.getColor(titleList)
    },
    getNameSvg(val) {
      const svg = []
      const data = [
        'earth',
        'footprints',
        'love',
        'collection',
        'eyes'
      ]
      val.forEach((item, index) => {
        svg.push({ name: item.title, svg: data[index] || 'eyes' })
      })
      this.storeOption.theme.StyleConfig.IndicatorPic.setSvg = svg
    }

  }
}
