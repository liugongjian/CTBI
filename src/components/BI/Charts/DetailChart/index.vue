<template>
  <div style="width:100%;height:100%;">
    <div>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import dashboardMixins from '@/components/BI/mixins/dashboardMixins'
export default {
  name: 'DetailChart',
  mixins: [dashboardMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      storeOption: {},
      chartOption: {}
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      // const componentOption = this.storeOption.theme.ComponentOption
      this.chartOption = {
        // legend: componentOption.Legend,
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '明细表',
            type: 'table'
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
