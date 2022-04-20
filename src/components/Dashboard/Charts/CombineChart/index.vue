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
import combineMixins from '@/components/Dashboard/mixins/combineMixins'
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
      const { ComponentOption, SeriesSetting } = this.storeOption.theme
      this.getSeries()

      // const {SeriesSelect, SeriesChartLabel, SeriesMark, SeriesMaximum} = SeriesSetting
      const { SeriesSelect, SeriesChartLabel, SeriesMark, SeriesLine } = SeriesSetting
      // 显示最值 不清楚具体的效果是什么样子 SeriesMaximum.check

      // 选择系列 设置标记样式、线条样式 以及标签字体颜色
      const { check, labelShow } = ComponentOption.ChartLabel
      this.series = this.series.map((item) => {
        item.labelLayout = {
          hideOverlap: labelShow === 1
        }
        item.label = {
          show: check
        }
        // 图表样式的标记点
        if (!ComponentOption.SeriesMark.check && item.type === 'line') {
          item.symbol = 'none'
        } else if (ComponentOption.SeriesMark.check && item.type === 'line') {
          item.symbol = ComponentOption.SeriesMark.markType
        }

        // 图表样式曲线
        if (ComponentOption.LineStyle.type === 1) {
          item.smooth = true
        } else {
          item.smooth = false
        }

        // 系列设置里的标记点
        if (SeriesMark?.check && SeriesMark?.markType && item.type === 'line') {
          item.symbol = SeriesMark.markType
          item.lineStyle = {
            type: SeriesLine.lineType
          }
        }
        if (SeriesSelect?.selectValue === item.name) {
          item.label.show = SeriesChartLabel.check
          item.label.color = SeriesChartLabel.color
        }
        return item
      })

      const xAxis = {
        type: 'category'
      }

      this.chartOption = {
        legend: ComponentOption.Legend,
        // xAxis: ComponentOption.ChartDirection.direction === 1 ? xAxis : this.yAxis,
        xAxis: ComponentOption.ChartDirection.direction === 1 ? xAxis : xAxis,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        // yAxis: ComponentOption.ChartDirection.direction === 1 ? this.yAxis : xAxis,
        yAxis: ComponentOption.ChartDirection.direction === 1 ? this.yAxis : this.yAxis,
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
