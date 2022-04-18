<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import barMixins from '@/components/BI/mixins/barMixins'
import { deepClone } from '@/utils/optionUtils'
export default {
  name: 'StackedBarChart',
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
      type: 'StackedBarChart', // 图表类型 1.柱图；2.堆积柱状图；3.百分比堆积柱状图
      dataValue: null,
      series: [],
      textMap: {
        'BarChart': '柱图',
        'StackedBarChart': '堆积柱状图',
        'PercentStackedBarChart': '百分比堆积柱状图'
      }
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.type = val.theme.Basic.ChartType.type
        val.theme.ComponentOption.ChartLabel.type = this.type
        val.theme.Basic.Title.text = this.textMap[this.type]
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        this.type = val.theme.ComponentOption.PercentStack.isStack ? 'StackedBarChart' : 'BarChart'
        this.type = val.theme.ComponentOption.PercentStack.isPercent ? 'PercentStackedBarChart' : this.type
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)// 深拷贝，避免修改数据
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
      this.getSeries()
      this.chartOption = {
        'legend': componentOption.Legend,
        'xAxis': this.xAxis,
        'tooltip': this.tooltip,
        'yAxis': this.yAxis,
        'dataset': {
          'source': this.dataValue
        },
        'series': this.series
      }
    }
  }
}
</script>

<style>
</style>
