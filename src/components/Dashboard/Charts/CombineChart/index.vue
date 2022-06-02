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
import { getLayoutOptionById, getDataValueById, deepClone, formatDataValue } from '@/utils/optionUtils'
import combineMixins from '@/components/Dashboard/mixins/combineMixins'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import store from '@/store'
export default {
  name: 'CombineChart',
  mixins: [combineMixins, YAxis],
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
      dataOption: [],
      dataValue: null
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.getOption()
      },
      deep: true
    },
    // 图表类型切换
    'storeOption.is': {
      handler (val) {
        const isData = this.dataOption.findIndex(item => {
          return item.id === this.identify
        })
        if (isData !== -1) {
          this.$bus.$emit('interReload', [this.identify], 100, false)
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
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      // 判断主值轴和副值轴二者是否有一
      if (this.isHaveMeasure(deepClone(this.chartData))) {
        this.dataValue = this.formatDataValue(deepClone(this.chartData))
        // 拿到数据中的系列名字
        this.getSeriesOptions(this.dataValue)
        // 拿到数据的系列名字 并设置颜色
        this.getColor(this.dataValue)
        this.getOption()
      }
    },
    isHaveMeasure(chartData) {
      const { data, fields } = chartData
      let flagMeasure = false
      let flagMeasureSecond = false
      if (data && data.length > 0) {
        for (const key in fields) {
          if (Object.hasOwnProperty.call(fields, key)) {
            const element = fields[key]
            if (key === 'Measure' && element.fields.length > 0) {
              flagMeasure = true
            }
            if (key === 'MeasureSecond' && element.fields.length > 0) {
              flagMeasureSecond = true
            }
          }
        }
      }

      if (!flagMeasure && !flagMeasureSecond) {
        this.$message({
          message: `主值轴/副值轴区域缺少度量项`,
          type: 'error'
        })
        return false
      } else {
        return true
      }
    },
    // 组合图特有的 数据 转换方法
    formatDataValue(chartData) {
      const dataValue = []
      const DimensionKey = []
      const MeasureKey = []
      const MeasureSecondKey = []
      const { data, fields } = chartData
      if (data && data.length > 0) {
        for (const key in fields) {
          if (Object.hasOwnProperty.call(fields, key)) {
            const element = fields[key]
            if (key === 'Dimension') {
              element.fields.forEach(field => {
                DimensionKey.push(field.displayColumn)
              })
            } else if (key === 'Measure') {
              element.fields.forEach(field => {
                MeasureKey.push(field.displayColumn)
              })
            } else if (key === 'MeasureSecond') {
              element.fields.forEach(field => {
                MeasureSecondKey.push(field.displayColumn + '-1')
              })
            }
          }
        }
        dataValue.push([DimensionKey.join('-'), ...MeasureKey, ...MeasureSecondKey])
        data.forEach(item => {
          const dimensionData = []
          const measureData = []
          const measureSecondData = []
          DimensionKey.forEach(dim => {
            dimensionData.push(item[dim])
          })
          MeasureKey.forEach(mea => {
            measureData.push(item[mea])
          })
          MeasureSecondKey.forEach(mea => {
            measureSecondData.push(item[mea.split('-')[0]])
          })
          dataValue.push([dimensionData.join('-'), ...measureData, ...measureSecondData])
        })
      }
      return dataValue
    },
    getOption () {
      const { ComponentOption, Axis } = this.storeOption.theme
      this.getSeries()
      this.getOptionSeries()

      // 取到图例的颜色配置
      const color = []
      ComponentOption.Color.color.forEach(item => {
        color.push(item.color)
      })
      this.setGrid(ComponentOption.Legend)

      this.chartOption = {
        color: color, // 图例颜色
        grid: this.grid,
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
        dataZoom: this.getDataZoomOption(),
        series: this.series
      }
    },
    // 拿到option设置里面的series设置
    getOptionSeries () {
      const { ComponentOption, SeriesSetting, FunctionalOption } = this.storeOption.theme
      const { SeriesSelect } = SeriesSetting
      const { SeriesChartLabel, SeriesMark, SeriesLine, SeriesMaximum } = SeriesSelect
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
        // 空值处理
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
        // 图表样式的标记点
        if (!ComponentOption.SeriesMark.check && item.type === 'line') {
          item.symbol = 'circle'
          item.hoverAnimation = false
          item.symbolSize = 1
        } else if (ComponentOption.SeriesMark.check && item.type === 'line') {
          item.symbol = ComponentOption.SeriesMark.markType
        }
        item.label = {
          show: check
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
        if (SeriesSelect?.selectValue.split('-')[0] === item.name) {
          item.label.show = SeriesChartLabel.check && check
          item.label.color = SeriesChartLabel.color
          if (SeriesMaximum?.check) {
            item.markPoint = {
              symbol: 'pin',
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        }
        return item
      })
    },
    // 显示缩略轴
    getDataZoomOption () {
      const sdz = this.storeOption.theme.FunctionalOption.DataZoom.showDataZoom
      const item = {
        realtime: true,
        start: 0,
        end: 100,
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
            return this.formatYLabel(value, axis[axisType])
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
        return {
          max: axis[axisType].autoMax ? null : !axis.YAxis.max,
          min: axis[axisType].autoMin ? null : !axis.YAxis.min,
          ...commonOptions
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
    }
  }
}
</script>

<style>
</style>
