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
import { deepClone } from '@/utils/optionUtils'
import combineMixins from '@/components/BI/mixins/combineMixins'
export default {
  name: 'CombineChart',
  mixins: [combineMixins],
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
      dataValue: [
        ['date', '价格-0', '数量-0', '温度-1'],
        ['Mon', 820, 410, 36],
        ['Tue', 932, 320, 36.3],
        ['Wed', 901, 300, 35.6],
        ['Thu', 934, 380, 36.6],
        ['Fri', 1290, 430, 39.6],
        ['Sat', 1330, 480, 37.6],
        ['Sun', 1320, 460, 38]
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)// 深拷贝，避免修改数据
        //   this.getOption()
        }
        this.getOption()
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      this.dataValue = [
        ['date', '价格-0', '数量-0', '温度-1'],
        ['Mon', 820, 410, 36],
        ['Tue', 932, 320, 36.3],
        ['Wed', 901, 300, 35.6],
        ['Thu', 934, 380, 36.6],
        ['Fri', 1290, 430, 39.6],
        ['Sat', 1330, 480, 37.6],
        ['Sun', 1320, 460, 38]
      ]
      const { ComponentOption } = this.storeOption.theme
      this.getSeries()

      // 图表标签
      const { check } = ComponentOption.ChartLabel
      this.series = this.series.map((item) => {
        item.label = {
          show: check,
          formatter: function (data) {
            if (data.seriesName.indexOf('-') > -1) {
              return data.seriesName.split('-')[0]
            } else {
              return data.seriesName
            }
          }
        }
        return item
      })

      this.chartOption = {
        legend: ComponentOption.Legend,
        xAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: this.yAxis,
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
