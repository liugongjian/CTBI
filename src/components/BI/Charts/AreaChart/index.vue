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
import areaMixins from '@/components/BI/mixins/areaMixins'
export default {
  name: 'AreaChart',
  mixins: [areaMixins],
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
      type: '2', // 1 线图 2 面积图 3 堆积面积图 4 百分比堆叠面积图
      //   dataValue: null
      dataValue: [
        ['date', '价格'],
        ['Mon', 820],
        ['Tue', 932],
        ['Wed', 901],
        ['Thu', 934],
        ['Fri', 1290],
        ['Sat', 1330],
        ['Sun', 1320]
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.type = val.theme.Basic.ChartType.type
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
      let series = []
      if (this.type === '1') {
        series = [
          {
            type: 'line'
          }
        ]
      } else {
        series = [
          {
            type: 'line',
            areaStyle: {}
          }
        ]
      }
      this.chartOption = {
        legend: componentOption.Legend,
        xAxis: {
          type: 'category'
        },
        yAxis: {},
        dataset: {
          source: this.dataValue
        },
        series: series
      }
    }
  }
}
</script>

<style>
</style>
