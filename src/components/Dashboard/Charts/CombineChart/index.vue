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
import { strWithKSeperator, addChineseUnit, addEnglishUnit } from '@/utils/numberUtils'
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
      dataValue: null
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)// 深拷贝，避免修改数据
          this.getOption()
        }
      },
      deep: true
    },
    'storeOption.dataSource': {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          // 拿到数据中的系列名字
          this.getSeriesOptions(this.dataValue)
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          this.getOption()
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      const { ComponentOption, Axis } = this.storeOption.theme
      this.getSeries()
      this.getOptionSeries()

      // 取到图例的颜色配置
      const color = []
      ComponentOption.Color.color.forEach(item => {
        color.push(item.color)
      })

      this.chartOption = {
        color: color, // 图例颜色
        legend: ComponentOption.Legend,
        // xAxis: ComponentOption.ChartDirection.direction === 1 ? xAxis : yAxis,
        xAxis: ComponentOption.ChartDirection.direction === 1 ? { ...this.generateAxisOptions('X', Axis), ...this.getAxisShowTypeOption() } : { ...this.generateAxisOptions('X', Axis), ...this.getAxisShowTypeOption() },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: [
          ComponentOption.ChartDirection.direction === 1 ? { ...this.yAxis[0], ...this.generateAxisOptions('Y', Axis) } : { ...this.yAxis[0], ...this.generateAxisOptions('Y', Axis) },
          ComponentOption.ChartDirection.direction === 1 ? { ...this.yAxis[1], ...this.generateAxisOptions('Y1', Axis) } : { ...this.yAxis[1], ...this.generateAxisOptions('Y1', Axis) }
        ],
        // yAxis: ComponentOption.ChartDirection.direction === 1 ? this.yAxis : this.yAxis,
        dataset: {
          source: this.dataValue
        },
        // dataZoom: this.getDataZoomOption(),
        series: this.series
      }
    },
    // 拿到option设置里面的series设置
    getOptionSeries () {
      const { ComponentOption, SeriesSetting, FunctionalOption } = this.storeOption.theme
      // const {SeriesSelect, SeriesChartLabel, SeriesMark, SeriesMaximum} = SeriesSetting
      const { SeriesSelect, SeriesChartLabel, SeriesMark, SeriesLine } = SeriesSetting
      // 显示最值 不清楚具体的效果是什么样子 SeriesMaximum.check TODO

      // 选择系列 设置标记样式、线条样式 以及标签字体颜色
      const { check, labelShow } = ComponentOption.ChartLabel
      // 取到颜色配置
      const color = ComponentOption.Color.color

      // 空值处理
      const ast = FunctionalOption.NullProcess.emptyResolve

      this.series = this.series.map((item) => {
        item.itemStyle = {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          color: (data) => {
            if (color[0].name) {
              const colorTemp = color.find((item) => { return data.seriesName === item.name })
              return colorTemp ? colorTemp.color : 'red'
            } else {
              const index = (data.dataIndex) % color.length
              return color[index].value
            }
          }
        }
        item.connectNulls = false // 直接断开
        if (ast === 'skip') { // 直接跨过
          item.connectNulls = true
        } else if (ast === 'zero') { // 置为0,不断开
          this.dataValue = this.dataValue.map(datas => {
            return datas.map((data, index) => {
              if ([null, undefined, NaN, '-'].includes(data)) {
                return typeof data === 'number' ? 0 : '0'
              }
              return data
            })
          })
        }
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
    },
    // 显示缩略轴
    getDataZoomOption () {
      const sdz = this.storeOption.theme.FunctionalOption.DataZoom.showDataZoom
      const item = {
        realtime: true,
        start: 30,
        end: 70,
        xAxisIndex: [0, 1]
      }
      if (sdz === 'show') { // 显示缩略轴
        item.show = true
      } else if (sdz === 'hide') { // 隐藏缩略轴
        item.show = false
      } else {
        // TODO：智能显示缩略轴
        item.show = true
      }
      return [item]
    },
    // 坐标轴设置
    generateAxisOptions (type, axis) {
      const axisType = type + 'Axis'
      const commonOptions = {
        name: axis[axisType].showTitle && (axis[axisType].unit ? `${axis[axisType].title}(${axis[axisType].unit})` : axis[axisType].title),
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
          },
          show: axis[axisType].show
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

      if (type === 'X') {
        return { type: 'category', ...commonOptions }
      } else {
        if (axis[axisType].autoMin && axis[axisType].autoMax) {
          // 最大值 最小值自动
          return { ...commonOptions }
        } if (!axis[axisType].autoMin && !axis[axisType].autoMax && !axis.YAxis.min && !axis.YAxis.max) {
          // 最大值 最小值均未自动 且最大值、最小值均为0
          return { ...commonOptions }
        } else if (!axis[axisType].autoMin && axis[axisType].autoMax) {
          // 最大值自动 最小值写入
          const min = axis.YAxis.min < 'dataMin' ? axis.YAxis.min : 'dataMin'
          return { min: min, ...commonOptions }
        } else if (axis[axisType].autoMin && !axis[axisType].autoMax) {
          // 最小值自动 最大值写入
          const max = axis.YAxis.max > 'dataMax' ? axis.YAxis.max : 'dataMax'
          return { max: max, ...commonOptions }
        }
      }
    },
    // 坐标轴维值显示
    getAxisShowTypeOption () {
      const ast = this.storeOption.theme.FunctionalOption.LabelShowType.axisShowType
      const option = {
        axisLabel: {
          rotate: 0,
          interval: 'auto'
        }
      }
      if (ast === 'condense') { // 最多显示
        option.axisLabel.rotate = 90
      } else if (ast === 'sparse') { // 强制悉数
        option.axisLabel.interval = 3
      }
      return option
    },
    // 空值处理
    resolveNull () {
      const ast = this.storeOption.theme.FunctionalOption.NullProcess.emptyResolve
      this.series.connectNulls = false
      // const series = {
      //   connectNulls: false
      // }
      if (ast === 'skip') {
        this.series.connectNulls = true
      } else if (ast === 'zero') {
        this.dataValue = this.dataValue.map(datas => {
          return datas.map((data, index) => {
            if ([null, undefined, NaN, '-'].includes(data)) {
              return typeof data === 'number' ? 0 : '0'
            }
            return data
          })
        })
      }
      // return [series]
    }
  }
}
</script>

<style>
</style>
