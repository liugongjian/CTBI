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
import pieMixins from '@/components/BI/mixins/pieMixins'
export default {
  name: 'PieChart',
  mixins: [pieMixins],
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
        // 'tooltip': option.Tooltip,
        'legend': componentOption.Legend,
        'dataset': {
          'source': this.dataValue
        },
        'series': [
          {
            'type': 'pie',
            'radius': componentOption.ChartRadius,
            'emphasis': {
              'itemStyle': {
                'shadowBlur': 10,
                'shadowOffsetX': 0,
                'shadowColor': 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
