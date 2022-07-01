<template>
  <div style="width: 100%; height: 100%">
    <v-chart v-if="dataValue" :option="chartOption" autoresize />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone, getDataValueById } from '@/utils/optionUtils'
// import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import lineMixins from '@/components/Dashboard/mixins/lineMixins'
import store from '@/store'
export default {
  name: 'DistribuScatter',
  mixins: [lineMixins],
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
        console.log(val, 'val')
        if (this.dataValue.length > 0) {
          this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
          console.log(this.dataValue, 'this.dataValue')
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
    // 'storeOption.dataSource': {
    //   handler(val) {
    //     console.log(val, 'data')
    //     if (JSON.stringify(val) !== '{}') {
    //       this.dataValue = deepClone(val)
    //       console.log(this.dataValue, 999988)
    //       // 拿到数据中的系列名字
    //       // this.getSeriesOptions(this.dataValue)
    //       // 拿到数据的系列名字 并设置颜色
    //       // this.getColor(this.dataValue)
    //       // 拿到数据中的指标
    //       // this.getIndicatorOptions(this.dataValue)
    //       this.getOption()
    //     }
    //   }
    // }
  },
  mounted() {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    getOption() {
      console.log('触发')
      // const { Legend } = this.storeOption.theme.ComponentOption
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      // const data = this.changeBaseData()
      // const options = []
      // data[1].forEach((item, index) => {
      //   // {
      //   //           xAxis: "Tue",
      //   //           label: {
      //   //             position: "start",
      //   //             padding: [30, 120, 0, 0],
      //   //             formatter: "警戒线",
      //   //           },
      //   //         },
      //   options.push({
      //     xAxis: data[0][index],
      //     lineStyle: {
      //       color: '#fff',
      //       type: 'solid',
      //       shadowOffsetX: 20
      //     },
      //     label: {
      //       color: '#000',
      //       position: 'start',
      //       padding: [-20, 50, 0, 0],
      //       formatter: item,
      //       distance: 0
      //     }
      //   })
      // })
      // console.log(XAxis, 99999, YAxis, Legend)
      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      this.storeOption.theme.ComponentOption.Color.color.forEach((item) => {
        colorOption.push(item.color)
      })
      this.chartOption = {
        tooltip: {
          show: true,
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            show: true
          },
          formatter: '{b}<br />{a}: {c}'
        },
        // grid: [
        //   { x: '10%', y: '7%', width: '25%', height: '38%' },
        //   { x: '35%', y: '7%', width: '25%', height: '38%' }
        //   // { x: '60%', y: '7%', width: '25%', height: '38%' }
        // ],
        grid: this.getGrid(),
        // visualMap: {
        //   type: 'piecewise',
        //   top: 'top',
        //   min: 0,
        //   max: 6,
        //   left: 10,
        //   splitNumber: 6,
        //   dimension: 6,
        //   pieces: []
        // },
        // color: colorOption,
        // legend: Legend,
        // legend: {
        //   data: [1, 2],
        //   bottom: 10,
        // },
        xAxis: this.getXAxis(XAxis),
        // xAxis: [
        //   {
        //     type: 'category',
        //     zlevel: 999,
        //     // 轴线显示与样式
        //     axisLine: {
        //       show: XAxis.show,
        //       lineStyle: {
        //         type: XAxis.lineType,
        //         width: XAxis.lineWidth,
        //         color: XAxis.lineColor
        //       }
        //     },
        //     // 轴标签
        //     axisLabel: {
        //       show: XAxis.showAxisLabel,
        //       width: XAxis.lineWidth
        //     },
        //     // 轴刻度线
        //     axisTick: {
        //       show: XAxis.showTicks
        //     },
        //     // 网格线
        //     splitLine: {
        //       show: XAxis.showSplit,
        //       lineStyle: {
        //         type: XAxis.splitType,
        //         color: XAxis.splitColor,
        //         width: XAxis.splitWidth
        //       }
        //     },
        //     offset: -50,
        //     // 轴标题和单位
        //     name:
        //       XAxis.showTitle &&
        //       (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title)
        //   }
        // ],
        yAxis: this.getYAxis(YAxis),
        // yAxis: [
        //   {
        //     axisLine: {
        //       show: YAxis.show,
        //       lineStyle: {
        //         type: YAxis.lineType,
        //         width: YAxis.lineWidth,
        //         color: YAxis.lineColor
        //       }
        //     },
        //     axisLabel: {
        //       show: YAxis.showAxisLabel,
        //       formatter: (value, index) => {
        //         return this.formatYLabel(value, YAxis)
        //       }
        //     },
        //     splitLine: {
        //       show: YAxis.showSplit,
        //       lineStyle: {
        //         type: YAxis.splitType,
        //         color: YAxis.splitColor,
        //         width: YAxis.splitWidth
        //       }
        //     },
        //     axisTick: {
        //       show: YAxis.showTicks
        //     },
        //     min: YAxis.autoMin ? -80 : YAxis.min,
        //     max: function (value) {
        //       if (!YAxis.autoMax) {
        //         return YAxis.max < value.max ? null : YAxis.max
        //       }
        //     },
        //     // 轴标题和单位
        //     name:
        //       YAxis.showTitle &&
        //       (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title)
        //   }
        // ],
        // dataset: [
        //   {
        //     source: this.dataValue
        //   }
        // ],
        series: this.getSeries()
      }
    },
    formatData(dataValue) {
      const obj = []
      const MeasureSecond = []
      const { data, fields } = dataValue
      if (data && data.length > 0) {
        for (const key in fields) {
          // 获取Y轴/度量
          if (key === 'MeasureSecond') {
            const column = fields[key]['fields'][0].column
            data.forEach((item) => { MeasureSecond.push(item[column]) })
          }
          // 获取x轴
          if (key === 'Measure') {
            fields[key]['fields'].forEach((field, index) => {
              obj[index] = data.map(item => [item[field.column]])
            })
          }
        }
        obj.forEach(item => {
          item.forEach((items, index) => {
            items[1] = MeasureSecond[index]
          })
        })
      }
      console.log(MeasureSecond, 'MeasureSecond')
      console.log(obj, 'obj')
      return obj
    },
    getXAxis(XAxis) {
      const array = []
      this.dataValue.forEach((item, index) => {
        array.push({
          gridIndex: index,
          boundaryGap: true,
          scale: true,
          type: 'value',
          min: Math.min(...(item.map(i => i[0]))),
          max: Math.max(...(item.map(i => i[0]))),
          axisLine: {
            show: XAxis.show,
            onZero: false
            // lineStyle: {
            //   type: XAxis.lineType,
            //   width: XAxis.lineWidth,
            //   color: XAxis.lineColor
            // }
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
          },
          // offset: -50,
          // 轴标题和单位
          name:
              XAxis.showTitle &&
              (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title)
        })
      })
      console.log(array, 'x轴')
      return array
    },
    getYAxis(YAxis) {
      const array = []
      this.dataValue.forEach((item, index) => {
        array.push({
          gridIndex: index,
          boundaryGap: false,
          type: 'value',
          min: Math.min(...(item.map(i => i[1]))),
          max: Math.max(...(item.map(i => i[1]))),
          axisLine: {
            // show: index === 0 ? YAxis.show : false,
            show: true,
            onZero: false
            // lineStyle: {
            //   type: YAxis.lineType,
            //   width: YAxis.lineWidth,
            //   color: YAxis.lineColor
            // }
          },
          axisLabel: {
            show: index === 0 ? YAxis.showAxisLabel : false,
            formatter: (value, index) => {
              return this.formatYLabel(value, YAxis)
            }
          },
          splitLine: {
            show: index === 0 ? YAxis.showSplit : false
            // lineStyle: {
            //   type: YAxis.splitType,
            //   color: YAxis.splitColor,
            //   width: YAxis.splitWidth
            // }
          },
          axisTick: {
            show: index === 0 ? YAxis.showTicks : false
          }
          // min: YAxis.autoMin ? -80 : YAxis.min,
          // max: function (value) {
          //   if (!YAxis.autoMax) {
          //     return YAxis.max < value.max ? null : YAxis.max
          //   }
          // },
          // 轴标题和单位
          // name:
          //     YAxis.showTitle &&
          //     (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title)
        })
      })
      console.log(array, 'y轴')
      return array
    },
    getSeries() {
      const array = []
      this.dataValue.forEach((item, index) => {
        array.push({
          name: index,
          type: 'scatter',
          symbolSize: 5,
          xAxisIndex: index,
          yAxisIndex: index,
          data: item
        })
      })
      console.log(array, 'serve')
      return array
    },
    getGrid() {
      const array = []
      this.dataValue.forEach((item, index) => {
        const width = (1 / this.dataValue.length * 100).toFixed(0)
        const x = index === 0 ? 10 : index * width + 10
        array.push({ x: x + '%', width: width + '%' })
      })
      console.log(array, 'grid')
      return array
    }
  }
}
</script>

<style scoped>
</style>
