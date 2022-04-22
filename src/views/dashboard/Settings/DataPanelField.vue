<template>
  <div class="tab-pane-content">
    <el-input
      v-model="val"
      type="textarea"
      autosize
      placeholder="请输入内容"
    />
    <el-button
      type="primary"
      @click="reflashStore"
    >更新</el-button>
  </div>
</template>

<script>
import { getLayoutById } from '@/utils/optionUtils'
// import store from '@/store'
import { colorTheme } from '@/constants/color.js'
export default {
  name: 'DataPanelField',
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      val: '',
      typeOption: ['BarChart', 'StackedBarChart', 'PercentStackedBarChart']
    }
  },
  mounted () {
    // const dataValue = [
    //   ['product', '2015', '2016', '2017'],
    //   ['Matcha Latte', 43.3, 85.8, 93.7],
    //   ['Matcha Latte11', 13.3, 85.8, 93.7],
    //   ['Milk Tea1', 13.1, 73.4, 55.1],
    //   ['Milk Tea2', 3.1, 73.4, 55.1],
    //   ['Milk Tea6', 83.1, 73.4, 55.1],
    //   ['Cheese Cocoa', 86.4, 65.2, 82.5],
    //   ['Walnut Brownie', 72.4, 53.9, 39.1],
    //   ['Tea', 22.1, 73.4, 55.1]
    // ]
    const dataValue = [
      { name: '一月份订单', value: '200', target: '300' },
      { name: '二月份订单', value: '100', target: '200' },
      { name: '三月份订单', value: '300', target: '600' },
      { name: '四月份订单', value: '500', target: '580' }
    ]
    this.val = JSON.stringify(dataValue)
  },
  methods: {
    reflashStore () {
      const layout = getLayoutById(this.identify)
      layout.option.dataSource = JSON.parse(this.val)
      // if (layout.option.theme.SeriesSetting) {
      //   this.getSeries(layout.option.dataSource)
      // }
      // if (layout.option.theme.ComponentOption.Color) {
      //   this.getColor(layout.option.dataSource)
      // }
    },
    // 拿到数据中的系列名字
    getSeries (val) {
      console.log(val)
      const layout = getLayoutById(this.identify)
      const seriesOption = []
      if (this.typeOption.includes(layout.option.theme.Basic.ChartType?.type)) {
        val[0].forEach((item, index) => {
          if (index) {
            seriesOption.push({ value: item, label: item })
          }
        })
      } else {
        val.forEach((item, index) => {
          if (index) {
            seriesOption.push({ value: item[0], label: item[0] })
          }
        })
      }

      layout.option.theme.SeriesSetting.SeriesSelect.seriesOption = seriesOption
      layout.option.theme.SeriesSetting.SeriesSelect.selectValue = seriesOption[0].value
      layout.option.theme.SeriesSetting.SeriesSelect.remark = seriesOption[0].value
    },
    // 设置颜色的name 为 对应的系列名字
    getColor (val) {
      const layout = getLayoutById(this.identify)
      const color = []
      if (this.typeOption.includes(layout.option.theme.Basic.ChartType?.type)) {
        val[0].forEach((item, index) => {
          if (index) {
            const idx = (index) % colorTheme['defaultColor'].length
            color.push({ name: item, color: colorTheme['defaultColor'][idx].value })
          }
        })
      } else {
        val.forEach((item, index) => {
          if (index) {
            const idx = (index) % colorTheme['defaultColor'].length
            color.push({ name: item[0], color: colorTheme['defaultColor'][idx].value })
          }
        })
      }

      layout.option.theme.ComponentOption.Color.color = color
    }
  }
}
</script>

<style>
</style>
