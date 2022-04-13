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
      dataValue: null,
      radius: []
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          // this.getOption()
        }
        this.radius = val.theme.Basic.VisualStyle.style === 'pie' ? ['0', '75%'] : ['30%', '75%']
        this.getOption()
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
      const radius = this.radius.map(item => {
        item = (parseInt(item) * parseInt(componentOption.ChartRadius[1]) / 100).toFixed('0') + '%'
        return item
      })
      this.chartOption = {
        // 'tooltip': option.Tooltip,
        'tooltip': {
          'trigger': 'item'
        },
        'legend': componentOption.Legend,
        'dataset': {
          'source': this.dataValue
        },
        'series': [
          {
            'type': 'pie',
            // 'radius': componentOption.ChartRadius,
            'radius': radius,
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
