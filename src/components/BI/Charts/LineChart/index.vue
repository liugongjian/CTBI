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
import lineMixins from '@/components/BI/mixins/linemixins'
export default {
  name: 'LineChart',
  mixins: [lineMixins],
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
        'dataset': {
          'source': this.dataValue
        },
        'yAxis': {},
        'series': [
          {
            'type': 'line'
          },
          {
            'type': 'line'
          },
          {
            'type': 'line'
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
