<template>
  <div style="width: 100%; height: 100%; overflow:hidden; overflow-x:auto;">
    <div v-if="dataValue && dataValue.length > 0" style="height: 100%" :style="chartWidth">
      <v-chart
        ref="distribuScatter"
        :option="chartOption"
        autoresize
      />
    </div>
    <svg-icon
      v-else
      icon-class="chart-empty-distribute-scatter"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone, getDataValueById, getLayoutById } from '@/utils/optionUtils'
import distribuScatterMixins from '@/components/Dashboard/mixins/distribuScatterMixins'
import store from '@/store'
export default {
  name: 'DistribuScatter',
  mixins: [distribuScatterMixins],
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
      dataValue: [],
      chartWidth: {
        'width': '100%'
      }
    }
  },
  computed: {
    layout() {
      return getLayoutById(this.identify)
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (this.dataValue.length > 0) {
          this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
          this.getOption()
        }
      },
      deep: true
    },
    dataOption: {
      handler (val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
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
    getOption () {
      const { Legend } = this.storeOption.theme.ComponentOption
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      const { SeriesSelect } = this.storeOption.theme.SeriesSetting
      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      const chart = this.$refs.distribuScatter && this.$refs.distribuScatter.chart
      if (chart) {
        chart.clear()
      }
      this.storeOption.theme.ComponentOption.Color.color.forEach((item) => {
        colorOption.push(item.color)
      })
      const self = this
      const yName = this.storeOption.dataSource.MeasureSecond.value[0].displayColumn
      this.chartOption = {
        legend: { ...Legend },
        tooltip: {
          show: true,
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            show: true,
            axis: 'y'
          },
          // formatter: '{a}<br />{b1}: {c1}'
          formatter: function(params) {
            const { seriesIndex, seriesName, data } = params
            if (self.dimensionLegend.length === 0) {
              return `${seriesName}: ${data[0]}<br />${yName}: ${data[1]}`
            } else {
              const index = parseInt(seriesIndex / self.dimensionLegend.length)
              const xName = self.xList[index]
              return `${params.seriesName}<br />${xName}: ${data[0]}<br />${yName}: ${data[1]}`
            }
          }
        },
        grid: this.getGrid(),
        color: colorOption,
        xAxis: this.getXAxis(XAxis, SeriesSelect),
        yAxis: this.getYAxis(YAxis),
        series: this.getSeries()
      }
    },
    formatData (dataValue) {
      const obj = []
      const MeasureSecond = []
      const DimensionThord = []
      let MeasureSecondKey = ''
      let DimensionThordKey = ''
      const { data, fields } = dataValue
      if (data && data.length > 0) {
        for (const key in fields) {
          // 获取Y轴/度量
          if (key === 'MeasureSecond') {
            MeasureSecondKey = fields[key]['fields'][0].displayColumn
            data.forEach((item) => { MeasureSecond.push(Number(item[MeasureSecondKey])) })
          }
          // 获取x轴
          if (key === 'Measure') {
            fields[key]['fields'].forEach((field, index) => {
              obj[index] = {
                x: field.displayColumn,
                data: data.map(item => [item[field.displayColumn]])
              }
            })
          }
          // 获取颜色图例、维度
          if (key === 'Dimension' && fields[key]['fields'][0]) {
            DimensionThordKey = fields[key]['fields'][0].displayColumn
            data.forEach((item) => { DimensionThord.push(item[DimensionThordKey]) })
          }
        }
        obj.forEach(item => {
          item.y = MeasureSecondKey
          item.data.forEach((items, index) => {
            items[1] = Number(MeasureSecond[index])
            if (DimensionThord.length > 0) {
              items[2] = DimensionThord[index]
            }
          })
        })
      }
      return obj
    },
    getXAxis (XAxis, SeriesSelect) {
      const array = []
      this.dataValue.forEach((item, index) => {
        const name = SeriesSelect.selectValue === item.x ? (SeriesSelect.remark || item.x) : item.x
        array.push({
          gridIndex: index,
          boundaryGap: true,
          type: 'value',
          scale: true,
          name: XAxis.showTitle && (XAxis.unit !== '' ? `${name}(${XAxis.unit})` : name),
          nameLocation: 'middle',
          nameTextStyle: {
            align: 'center',
            verticalAlign: 'bottom',
            lineHeight: -30
            // fontSize: 12
          },
          axisLine: {
            show: XAxis.show,
            onZero: false,
            lineStyle: {
              type: XAxis.lineType,
              width: XAxis.lineWidth,
              color: XAxis.lineColor
            }
          },
          // 轴标签
          axisLabel: {
            show: XAxis.showAxisLabel,
            width: XAxis.lineWidth,
            padding: [0, 12, 0, index * 10],
            // showMinLabel: index && false,
            showMaxLabel: false,
            hideOverlap: true
          },
          // 轴刻度线
          axisTick: {
            show: XAxis.showTicks
          },
          // 网格线
          splitLine: {
            show: XAxis.showSplit,
            lineStyle: {
              type: XAxis.splitType,
              color: XAxis.splitColor,
              width: XAxis.splitWidth
            }
          }
        })
      })
      return array
    },
    getYAxis (YAxis) {
      const array = []
      this.dataValue.forEach((item, index) => {
        const name = YAxis.title ? YAxis.title : item.y
        array.push({
          gridIndex: index,
          boundaryGap: false,
          type: 'value',
          name: index === 0 && YAxis.showTitle && (YAxis.unit !== '' ? `${name}(${YAxis.unit})` : name),
          min: YAxis.autoMin ? Math.min(...(item.data.map(i => i[1]))) : YAxis.min,
          max: YAxis.autoMax ? Math.max(...(item.data.map(i => i[1]))) : YAxis.max,
          nameLocation: 'middle',
          nameTextStyle: {
            lineHeight: 40,
            fontSize: 16
          },
          axisLine: {
            show: true,
            onZero: false,
            lineStyle: {
              type: YAxis.lineType,
              width: YAxis.lineWidth,
              color: YAxis.lineColor
            }
          },
          axisLabel: {
            show: index === 0 ? YAxis.showAxisLabel : false,
            formatter: function(value, index) {
              return value > 10000 ? value.toFixed(0) : value.toFixed(3)
            }
          },
          splitLine: {
            show: YAxis.showSplit,
            lineStyle: {
              type: YAxis.splitType,
              color: YAxis.splitColor,
              width: YAxis.splitWidth
            }
          },
          axisTick: {
            show: index === 0 ? YAxis.showTicks : false
          }
        })
      })
      return array
    },
    getSeries () {
      const array = []
      this.dataValue.forEach((item, index) => {
        // console.log(item)
        if (this.dimensionLegend.length > 0) {
          this.dimensionLegend.forEach(name => {
            const data = item.data.filter(data => data[2] === name)
            array.push({
              name: name,
              type: 'scatter',
              symbolSize: 5,
              xAxisIndex: index,
              yAxisIndex: index,
              data
            })
          })
        } else {
          array.push({
            name: item.x,
            type: 'scatter',
            symbolSize: 5,
            xAxisIndex: index,
            yAxisIndex: index,
            data: item.data
          })
        }
      })
      return array
    },
    getGrid () {
      const array = []
      const minWidth = 250
      const offsetX = 50
      const containerWidth = (this.layout.width || 900) - 45 - (offsetX * 2)
      const chartWidth = (containerWidth / this.dataValue.length).toFixed(0)
      const finalWidth = chartWidth < minWidth ? minWidth : chartWidth
      this.chartWidth = {
        width: (offsetX * 2 + finalWidth * this.dataValue.length) + 'px'
      }
      const finalOffsetX = offsetX * 1.5
      this.dataValue.forEach((item, index) => {
        const x = index === 0 ? finalOffsetX : index * finalWidth + finalOffsetX
        array.push({ x, width: finalWidth })
      })
      return array
    }
  }
}
</script>

<style scoped>
</style>
