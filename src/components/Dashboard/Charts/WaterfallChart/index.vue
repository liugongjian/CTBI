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
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import { numToFixed } from '@/utils/numberUtils'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import store from '@/store'
export default {
  name: 'WaterfallChart',
  mixins: [baseMixins, YAxis],
  data () {
    return {
      storeOption: {},
      chartOption: {},
      dataValue: null,
      dataOption: [],
      xAxis: { type: 'category' },
      yAxis: { type: 'value' }

    }
  },
  computed: {
    dimensionArr() {
      const temp = []
      store.state.app.layout.forEach(item => {
        if (item.id === this.identify) {
          if (item.option.dataSource.Measure.value) {
            item.option.dataSource.Measure.value.forEach(j => {
              temp.push({ displayColumn: j.displayColumn })
            })
          }
        }
      })
      return temp
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        // this.getOption()
        this.reloadImpl()
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
      this.dataValue = this.formatDataValue(deepClone(this.chartData))
      this.xAxis.data = this.dataValue?.dimensionData
      this.getOption()
    },
    formatDataValue(chartData) {
      const DimensionKey = []
      const MeasureKey = []
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
            }
          }
        }

        const dimensionData = []
        const measureData = []
        data.forEach(item => {
          const dimensionDataTemp = []
          DimensionKey.forEach(dim => {
            dimensionDataTemp.push(item[dim])
          })
          MeasureKey.forEach(mea => {
            measureData.push(Number(item[mea]))
          })
          dimensionData.push(dimensionDataTemp.join('-'))
        })

        // 起始值 累计值别名 以及值计算
        const { StartOrCumulative } = this.storeOption.theme.NumberSetting
        const { startValueCheck, startValueRemark, startValue, cumulativeValueCheck, cumulativeValueRemark } = StartOrCumulative
        if (startValueCheck) {
          dimensionData.unshift(startValueRemark)
          measureData.unshift(Number(startValue))
        }
        if (cumulativeValueCheck) {
          dimensionData.push(cumulativeValueRemark)
          let sum = 0
          measureData.forEach((item) => {
            sum += item
          })
          measureData.push(sum)
        }
        return { dimensionData, measureData }
      }
    },
    getOption () {
      const { ComponentOption, NumberSetting, FunctionalOption } = this.storeOption.theme
      const { BarColor: { increaseValueColor, decreaseValueColor } } = ComponentOption

      if (this.dataValue) {
        const measureDataTemp = this.dataValue.measureData

        const incomeData = measureDataTemp.map((item) => {
          if (item >= 0) {
            return numToFixed(item, 3)
          } else {
            return '-'
          }
        })

        const expressData = measureDataTemp.map((item) => {
          if (item < 0) {
            return -(-numToFixed(item, 3))
          } else {
            return '-'
          }
        })

        const placeholderData = [0]
        measureDataTemp.forEach((item, index) => {
          if (index >= 1 && index < measureDataTemp.length - 1) {
            const sum = measureDataTemp[index - 1] + placeholderData[index - 1]
            placeholderData.push(numToFixed(sum, 3))
          } else if (index === measureDataTemp.length - 1) {
            if (NumberSetting.StartOrCumulative.cumulativeValueCheck) {
              placeholderData.push(0)
            } else {
              const sum = measureDataTemp[index - 1] + placeholderData[index - 1]
              placeholderData.push(numToFixed(sum, 3))
            }
          } else {
            return
          }
        })
        // 获取Series
        this.getSeries(incomeData, expressData, placeholderData)
      }

      // 坐标轴设置
      this.setAxis()
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)

      const legendData = [{
        name: `${this.dimensionArr[0]?.displayColumn}增加值`,
        itemStyle: {
          color: increaseValueColor || '#D0021B'
        }
      }, {
        name: `${this.dimensionArr[0]?.displayColumn}减少值`,
        itemStyle: {
          color: decreaseValueColor || '#89c369'
        }
      }]
      const legendVertical = ComponentOption.Legend.show && ComponentOption.Legend.orient === 'vertical'
      const legendText = legendVertical ? { textStyle: {
        width: 60,
        overflow: 'breakAll'
      } } : {}
      if (legendVertical && ComponentOption.Legend.left === 'auto') {
        this.grid.left = 160
      }
      let dataZoomBottom = 12
      if (ComponentOption.Legend.show && ComponentOption.Legend.orient !== 'vertical' && ComponentOption.Legend.top === 'bottom') {
        dataZoomBottom = 40
      }

      this.chartOption = {
        'grid': this.grid,
        'legend': {
          ...ComponentOption.Legend,
          ...legendText,
          data: legendData
        },
        'xAxis': this.xAxis,
        'tooltip': {
          'trigger': 'axis',
          'formatter': (params) => {
            let result = ''
            let sum = 0
            params.forEach((item, index) => {
              if (item.data !== '-') {
                sum += item.data
              } else {
                sum += 0
              }
            })
            params.forEach((item, index) => {
              const { seriesName, axisValue } = item
              if (item.seriesName.indexOf('总计值') > -1) {
                if (index !== params.length - 1) {
                  result += `<div style="line-height: 25px;"><div>${axisValue}</div>
                  <span>${seriesName}</span>
                  <span style="float: right;margin-left: 20px;">${numToFixed(sum, 3)}</span>
                </div>`
                } else {
                  result += `<div style="line-height: 25px;"><div>${axisValue}</div>
                  <span>${seriesName}</span>
                  <span style="float: right;margin-left: 20px;">${numToFixed(item.data, 3)}</span>
                </div>`
                }
              } else if (item.data !== '-') {
                result += `<div style="line-height: 25px;">
                  <span>${seriesName}</span>
                  <span style="float: right;margin-left: 20px;">${numToFixed(item.data, 3)}</span>
                </div>`
              }
            })
            return result
          }
        },
        'yAxis': this.yAxis,
        'series': this.series,
        dataZoom: {
          type: 'slider',
          show: FunctionalOption && FunctionalOption.DataZoom.showDataZoom !== 'hide',
          realtime: true,
          start: 0,
          end: 100,
          xAxisIndex: [0, 1],
          bottom: dataZoomBottom
        }
      }
      console.log(JSON.parse(JSON.stringify(this.series)))
    },
    setAxis () {
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      const dimensionData = this.dataValue && this.dataValue.dimensionData || []
      this.xAxis = [
        {
          type: 'category',
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
            'show': XAxis.showAxisLabel,
            // auto 智能显示 sparse 强制稀疏 condense 最多展示
            // 'rotate': this.storeOption.theme.FunctionalOption.LabelShowType.axisShowType === 'condense' ? -90 : 0,
            'interval': 'auto',
            'width': 100,
            'height': 100,
            'overflow': 'truncate'
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
          data: [...dimensionData],
          // 轴标题和单位
          name: XAxis.showTitle ? (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title) : ''
        }
      ]
      this.yAxis = [
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
          // 轴标题和单位
          name: YAxis.showTitle ? (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title) : ''
        }
      ]
    },
    getSeries (incomeData, expressData, placeholderData) {
      const { StartOrCumulative } = this.storeOption.theme.NumberSetting
      const { startValueCheck, cumulativeValueCheck } = StartOrCumulative
      const { BarColor: { startValueColor, cumulativeValueColor, increaseValueColor, decreaseValueColor } } = this.storeOption.theme.ComponentOption
      this.series = [
        {
          name: `${this.dimensionArr[0]?.displayColumn}总计值`,
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: placeholderData
        },
        {
          name: `${this.dimensionArr[0]?.displayColumn}增加值`,
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'top'
          },
          itemStyle: {
            color: (a) => {
              if (startValueCheck && a.dataIndex === 0) {
                a.color = startValueColor || '#1A7DFF'
              } else if (cumulativeValueCheck && a.dataIndex === incomeData.length - 1) {
                a.color = cumulativeValueColor || '#ff751a'
              } else {
                a.color = increaseValueColor || '#D0021B'
              }
              return a.color
            }
          },
          // markPoint: {
          //   symbol: 'pin',
          //   symbolSize: 50,
          //   label: {
          //     show: true,
          //     color: '#000'
          //   },
          //   data: [
          //     { type: 'min', name: '最小值' },
          //     { coord: [incomeData.length - 1, incomeData[incomeData.length - 1]], name: '' }
          //   ]
          // },
          data: incomeData
        },
        {
          name: `${this.dimensionArr[0]?.displayColumn}减少值`,
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'bottom'
          },
          itemStyle: {
            borderColor: decreaseValueColor || '#89c369',
            color: decreaseValueColor || '#89c369'
          },

          data: expressData
        }
      ]
    }
  }
}
</script>

<style>
</style>
