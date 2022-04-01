<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import barMixins from '@/components/BI/mixins/barMixins'
export default {
  name: 'BarChart',
  mixins: [barMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      storeOption: {},
      chartOption: {},
      dataValue: null
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.chartOption = {
        'legend': componentOption.Legend,
        'xAxis': {
          'type': 'category'
        },
        'yAxis': {},
        'dataset': {
          'source': this.dataValue
        },
        'series': [
          {
            'type': 'bar'
          },
          {
            'type': 'bar'
          },
          {
            'type': 'bar'
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
