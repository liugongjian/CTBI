<template>
  <div style="width: 100%; height: 100%">
    <v-chart v-if="dataValue" :option="chartOption" autoresize />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone, getDataValueById } from '@/utils/optionUtils'
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
  data() {
    return {
      storeOption: {},
      chartOption: {},
      dataValue: []
    }
  },
  watch: {
    storeOption: {
      handler(val) {
        if (this.dataValue.length > 0) {
          this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
          this.getOption()
        }
      },
      deep: true
    },
    dataOption: {
      handler(val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          console.log(val, 'dataO')
          this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    getOption() {
      const { Legend } = this.storeOption.theme.ComponentOption
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      const { SeriesSelect } = this.storeOption.theme.SeriesSetting
      // console.log(XAxis, 99999, YAxis, Legend)
      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      this.storeOption.theme.ComponentOption.Color.color.forEach((item) => {
        colorOption.push(item.color)
      })
      this.chartOption = {
        legend: Legend,
        tooltip: {
          show: true,
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            show: true
          },
          formatter: '{b}<br />{a}: {c}'
        },
        grid: this.getGrid(),
        color: colorOption,
        xAxis: this.getXAxis(XAxis, SeriesSelect),
        yAxis: this.getYAxis(YAxis),
        series: this.getSeries()
      }
    },
    formatData(dataValue) {
      const obj = []
      const MeasureSecond = []
      let MeasureSecondKey = ''
      const { data, fields } = dataValue
      if (data && data.length > 0) {
        for (const key in fields) {
          // 获取Y轴/度量
          if (key === 'MeasureSecond') {
            MeasureSecondKey = fields[key]['fields'][0].column
            data.forEach((item) => { MeasureSecond.push(item[MeasureSecondKey]) })
          }
          // 获取x轴
          if (key === 'Measure') {
            fields[key]['fields'].forEach((field, index) => {
              obj[index] = {
                x: field.column,
                data: data.map(item => [item[field.column]])
              }
            })
          }
        }
        obj.forEach(item => {
          item.y = MeasureSecondKey
          item.data.forEach((items, index) => {
            items[1] = MeasureSecond[index]
          })
        })
      }
      return obj
    },
    getXAxis(XAxis, SeriesSelect) {
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
            lineHeight: -40,
            fontSize: 16
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
            padding: [0, 12, 0, index * 10]
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
    getYAxis(YAxis) {
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
            show: index === 0 ? YAxis.showAxisLabel : false
            // formatter: (value, index) => {
            //   return this.formatYLabel(value, YAxis)
            // }
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
    getSeries() {
      const array = []
      this.dataValue.forEach((item, index) => {
        array.push({
          name: item.x,
          type: 'scatter',
          symbolSize: 5,
          xAxisIndex: index,
          yAxisIndex: index,
          data: item.data
        })
      })
      return array
    },
    getGrid() {
      const array = []
      this.dataValue.forEach((item, index) => {
        const width = (1 / this.dataValue.length * 90).toFixed(0)
        const x = index === 0 ? 5 : index * width + 5
        array.push({ x: x + '%', width: width + '%' })
      })
      return array
    }
  }
}
</script>

<style scoped>
</style>
