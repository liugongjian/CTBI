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
    // 主轴-0标记 副轴-1标记
    const dataValue = [
      ['date', '价格-0', '数量-0', '温度-1'],
      ['Mon', 820, 410, 36],
      ['Tue', 932, 320, 36.3],
      ['Wed', 901, 300, 36.6],
      ['Thu', 934, 380, undefined],
      ['Fri', 1290, 430, 39.6],
      ['Sat', 1330, 480, 37.6],
      ['Sun', 1320, 460, 38]
    ]
    // const dataValue = [
    //   { name: '一月份订单', value: '200', target: '300' },
    //   { name: '二月份订单', value: '100', target: '200' },
    //   { name: '三月份订单', value: '300', target: '600' },
    //   { name: '四月份订单', value: '500', target: '580' }
    // ]
    this.val = JSON.stringify(dataValue)
  },
  methods: {
    reflashStore () {
      const layout = getLayoutById(this.identify)
      layout.option.dataSource = JSON.parse(this.val)
    }
  }
}
</script>

<style>
</style>
