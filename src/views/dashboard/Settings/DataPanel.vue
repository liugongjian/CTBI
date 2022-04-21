<template>
  <div>
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
export default {
  name: 'DataPanel',
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      val: ''
    }
  },
  mounted () {
    const dataValue = [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Matcha Latte11', 13.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5],
      ['Walnut Brownie', 72.4, 53.9, 39.1]
    ]
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
