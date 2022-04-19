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
import { strWithKSeperator, addChineseUnit, addEnglishUnit } from '@/utils/numberUtils'

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
      // dataValue: null,
      type: 'LineChart', // 线图 面积图 堆积面积图 百分比堆叠面积图
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
      const axis = this.storeOption.theme.Axis
      this.getSeries()
      this.chartOption = {
        legend: componentOption.Legend,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: { ...this.generateAxisOptions('X', axis), ...this.getAxisShowTypeOption() },
        yAxis: this.generateAxisOptions('Y', axis),
        dataZoom: this.getDataZoomOption(),
        dataset: {
          source: this.dataValue
        },
        series: this.series
      }
    },
    generateAxisOptions (type, axis) {
      const axisType = type + 'Axis'
      const commonOptions = {
        show: axis[axisType].show,
        name: axis[axisType].showTitle ? axis[axisType].title : '',
        axisTick: {
          show: axis[axisType].showTicks
        },
        axisLabel: {
          show: axis[axisType].showAxisLabel,
          formatter: (value, index) => {
            const { numberFormat, numberDigit, unit, kSeperator } = axis[axisType]
            let res, temp
            if (type === 'X') {
              res = value + unit
            } else {
              switch (axis[axisType].formatType) {
                case '1':
                  if (axis[axisType].lang === 'chinese-simplified') {
                    res = addChineseUnit(value, true)
                  }
                  if (axis[axisType].lang === 'english') {
                    res = addEnglishUnit(value)
                  }
                  if (axis[axisType].lang === 'chinese-complicated') {
                    res = addChineseUnit(value, false)
                  }
                  break
                case '2':
                  temp = (value * (numberFormat === 'percent' ? 100 : 1)).toFixed(numberDigit) + (numberFormat === 'percent' ? '%' : '') + unit
                  res = kSeperator ? strWithKSeperator(temp) : temp
                  break
                case '3':
                  break
              }
            }
            return res
          }
        },
        axisLine: {
          lineStyle: {
            color: axis[axisType].lineColor,
            width: axis[axisType].lineWidth,
            type: axis[axisType].lineType
          }
        },
        splitLine: {
          show: axis[axisType].showSplit,
          lineStyle: {
            width: axis[axisType].splitWidth,
            color: axis[axisType].splitColor,
            type: axis[axisType].splitType
          }
        }
      }

      return type === 'X'
        ? { type: 'category', ...commonOptions }
        : {
          min: axis[axisType].autoMin ? 'dataMin' : axis.YAxis.min,
          max: axis[axisType].autoMax ? 'dataMax' : axis.YAxis.max,
          ...commonOptions
        }
    },
    getDataZoomOption () {
      const sdz = this.storeOption.theme.FunctionalOption.showDataZoom
      const item = {
        realtime: true,
        start: 30,
        end: 70,
        xAxisIndex: [0, 1]
      }
      if (sdz === 'show') {
        item.show = true
      } else if (sdz === 'hide') {
        item.show = false
      } else {
        // TODO：智能显示缩略轴
        item.show = true
      }
      return [item]
    },
    getAxisShowTypeOption () {
      const ast = this.storeOption.theme.FunctionalOption.axisShowType
      const option = {
        axisLabel: {
          rotate: 0,
          interval: 'auto'
        }
      }
      if (ast === 'condense') {
        option.axisLabel.rotate = 90
      } else if (ast === 'sparse') {
        option.axisLabel.interval = 3
      }
      return option
    },
    resolveNull () {
      const ast = this.storeOption.theme.FunctionalOption.nullResolve
      const series = {
        connectNulls: false
      }
      if (ast === 'skip') {
        series.connectNulls = true
      } else if (ast === 'zero') {
        this.dataValue = this.storeOption.dataSource.map(datas => {
          return datas.map((data, index) => {
            if ([null, undefined, NaN, '-'].includes(data)) {
              return typeof data === 'number' ? 0 : '0'
            }
            return data
          })
        })
      }
      return [series]
    }
  }
}
</script>

<style>
</style>
