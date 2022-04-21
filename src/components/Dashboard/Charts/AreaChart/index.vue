<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
      :update-options="{notMerge:true}"
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import lineMixins from '@/components/Dashboard/mixins/lineMixins'
export default {
  name: 'AreaChart',
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
      type: 'AreaChart', // 1 线图 2 面积图 3 堆积面积图 4 百分比堆叠面积图
      //   dataValue: null
      dataValue: [
        ['date', '价格', '数量'],
        ['Mon', 820, 410],
        ['Tue', 932, 320],
        ['Wed', 901, 300],
        ['Thu', 934, 380],
        ['Fri', 1290, 430],
        ['Sat', 1330, 480],
        ['Sun', 1320, 460]
      ],
      series: [],
      textMap: {
        'LineChart': '线图',
        'AreaChart': '面积图',
        'StackedAreaChart': '堆叠面积图',
        'PercentStackedAreaChart': '百分比堆叠面积图'
      }
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.type = val.theme.Basic.ChartType.type
        val.theme.Basic.Title.text = this.textMap[this.type]
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          this.getOption()
        }
      },
      deep: true
    },
    type: {
      handler (val) {
        this.getOption()
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.getSeries()
      this.chartOption = {
        legend: componentOption.Legend,
        xAxis: {
          type: 'category'
        },
        yAxis: {},
        dataset: {
          source: this.dataValue
        },
        series: this.series
      }
    }
  }
}
</script>

<style>
</style>
