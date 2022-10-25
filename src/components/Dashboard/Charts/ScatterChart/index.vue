<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue"
      ref="scatter"
      :option="chartOption"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-scatter"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import { deepClone, formatDataValue, getDataValueById, getLayoutOptionById } from '@/utils/optionUtils'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import store from '@/store'

export default {
  name: 'ScatterChart',
  mixins: [YAxis, baseMixins],
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
      dataOption: [],
      series: [],
      xAxis: { type: 'category' },
      yAxis: {},
      grid: {}
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (this.dataValue) {
          this.dataValue = formatDataValue(deepClone(getDataValueById(this.identify)))
        }
        this.getOption()
      },
      deep: true
    },
    dataOption: {
      handler (val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = formatDataValue(deepClone(getDataValueById(this.identify)))
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    reloadImpl () {
      this.dataValue = formatDataValue(deepClone(this.chartData))
      this.getOption()
    },
    getOption () {
      const { Legend, Slider } = this.storeOption.theme.ComponentOption
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      let measureLen = 1
      let type = 'category'
      if (this.chartData?.fields?.Measure) {
        measureLen = this.chartData.fields.Measure?.fields?.length
      }
      if (this.chartData?.fields?.DimensionOrMeasure?.fields?.length) {
        type = this.chartData.fields.DimensionOrMeasure.fields[0].attributes && this.chartData.fields.DimensionOrMeasure.fields[0].attributes[0].dataType === 'number' ? 'value' : type
      }
      const chart = this.$refs.scatter && this.$refs.scatter.chart
      if (chart) {
        chart.clear()
      }
      this.chartOption = {
        tooltip: {
          show: true,
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            show: true
          },
          formatter: function(params) {
            const { dimensionNames, data } = params
            return `${dimensionNames[0]}: ${data[0]}<br />${dimensionNames[1]}: ${data[1]}`
          }
        },
        'legend': Legend,
        xAxis: [
          {
            type,
            // 轴线显示与样式
            'axisLine': {
              'show': XAxis.show,
              'lineStyle': {
                'type': XAxis.lineType,
                'width': XAxis.lineWidth,
                'color': XAxis.lineColor
              }
            },
            // 轴标签
            'axisLabel': {
              'show': XAxis.showAxisLabel
            },
            // 轴刻度线
            'axisTick': {
              'show': XAxis.showTicks
            },
            // 网格线
            'splitLine': {
              show: XAxis.showSplit,
              lineStyle: {
                type: XAxis.splitType,
                color: XAxis.splitColor,
                width: XAxis.splitWidth
              }
            },
            // 轴标题和单位
            name: XAxis.showTitle && (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title)
          }
        ],
        yAxis: [
          {
            'axisLine': {
              'show': YAxis.show,
              'lineStyle': {
                'type': YAxis.lineType,
                'width': YAxis.lineWidth,
                'color': YAxis.lineColor
              }
            },
            'axisLabel': {
              'show': YAxis.showAxisLabel,
              formatter: (value, index) => {
                return this.formatYLabel(value, YAxis)
              }
            },
            'splitLine': {
              show: YAxis.showSplit,
              lineStyle: {
                type: YAxis.splitType,
                color: YAxis.splitColor,
                width: YAxis.splitWidth
              }
            },
            'axisTick': {
              'show': YAxis.showTicks
            },
            min: YAxis.autoMin ? 0 : YAxis.min,
            max: function (value) {
              if (!YAxis.autoMax) {
                return YAxis.max < value.max ? null : YAxis.max
              }
            },
            // 轴标题和单位
            name: YAxis.showTitle && (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title)
          }
        ],
        dataset: {
          source: this.dataValue
        },
        'series': Array(measureLen).fill({
          'symbolSize': Slider.symbolSize,
          'type': 'scatter'
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
