// 饼图的混入
import baseMixins from './baseMixins'
export default {
  mixins: [baseMixins],
  data: function () {
    return {
    }
  },
  methods: {
    // 合并数据为其他 val val为1 就是保留最大的一个数据 其他数据合并为其他
    transfromData (val) {
      // 取除维度以外的第1列为vlaue
      let data = []
      for (let i = 1; i < this.dataValue.length; i++) {
        data.push({ name: this.dataValue[i][0], value: this.dataValue[i][1] })
      }
      // 数据按数值从大到小排序
      data = data.sort((a, b) => { return b.value - a.value })
      const showCount = val // 单独显示的数据条数
      if (data.length > showCount) {
        // 数据大于9条时将前9条单独显示
        const dataTemp = data.splice(0, showCount)
        let leftSum = 0
        // 剩余数据合并
        data.forEach(d => { leftSum += d.value })
        data = dataTemp.concat({ name: '其他合计', value: leftSum })
      }
      const aTemp = []
      aTemp[0] = [].concat(this.dataValue[0][0], this.dataValue[0][1])
      //  val+2 行
      for (let i = 1; i < val + 2; i++) {
        aTemp[i] = [].concat([data[i - 1].name, data[i - 1].value])
      }
      this.dataValue = aTemp
    }
  }
}
