<template>
  <div style="width: 100%; height: 100%">
    <v-chart v-if="dataValue" :option="chartOption" autoresize />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import lineMixins from '@/components/Dashboard/mixins/lineMixins'
export default {
  name: 'DistribuScatter',
  mixins: [YAxis, lineMixins],
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
      dataValue: [
        ['date', '价格', '数量', '温度'],
        ['Mon', 820, 410, 36],
        ['Tue', 932, 320, 36.3],
        ['Wed', 901, 300, 36.6],
        ['Thu', 934, 380, null],
        ['Fri', 1290, 430, 39.6],
        ['Sat', 1330, 480, 37.6],
        ['Sun', 1320, 460, 38],
        ['前两天', '后五天'],
        ['Tue', 'Sun']
      ]
      //   series: []
    }
  },
  watch: {
    storeOption: {
      handler(val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)
          this.getOption()
        }
      },
      deep: true
    },
    'storeOption.dataSource': {
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          console.log(this.dataValue, 999988)
          // 拿到数据中的系列名字
          this.getSeriesOptions(this.dataValue)
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          // 拿到数据中的指标
          this.getIndicatorOptions(this.dataValue)
          this.getOption()
        }
      }
    }
  },
  mounted() {
    this.storeOption = getLayoutOptionById(this.identify)
    // console.log(this.storeOption, "storrrrrrrrrrrrr");
    this.getOption()
  },
  methods: {
    changeBaseData() {
      const data = []
      let max = 0
      data.push(this.dataValue.pop())
      data.push(this.dataValue.pop())
      this.dataValue.forEach((item, index) => {
        console.log(item)
        if (index !== 0) {
          if (item[1] > max) {
            max = item[1]
          }
        }
      })
      data.push(max)
      console.log(data)
      return data
    },
    getOption() {
      const { Legend } = this.storeOption.theme.ComponentOption
      const { XAxis, YAxis } = this.storeOption.theme.Axis
      const data = this.changeBaseData()
      const options = []
      data[1].forEach((item, index) => {
        // {
        //           xAxis: "Tue",
        //           label: {
        //             position: "start",
        //             padding: [30, 120, 0, 0],
        //             formatter: "警戒线",
        //           },
        //         },
        options.push({
          xAxis: data[0][index],
          lineStyle: {
            color: '#fff',
            type: 'solid',
            shadowOffsetX: 20
          },
          label: {
            color: '#000',
            position: 'start',
            padding: [-20, 50, 0, 0],
            formatter: item,
            distance: 0
          }
        })
      })
      console.log(XAxis, 99999, YAxis, Legend)
      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      this.storeOption.theme.ComponentOption.Color.color.forEach((item) => {
        colorOption.push(item.color)
      })
      // const lastOptions = this.dataValue.pop();
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
        color: colorOption,
        legend: Legend,
        // legend: {
        //   data: [1, 2],
        //   bottom: 10,
        // },
        xAxis: [
          {
            type: 'category',
            zlevel: 999,
            // 轴线显示与样式
            axisLine: {
              show: XAxis.show,
              lineStyle: {
                type: XAxis.lineType,
                width: XAxis.lineWidth,
                color: XAxis.lineColor
              }
            },
            // 轴标签
            axisLabel: {
              show: XAxis.showAxisLabel,
              width: XAxis.lineWidth
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
            offset: -50,
            // 轴标题和单位
            name:
              XAxis.showTitle &&
              (XAxis.unit ? `${XAxis.title}(${XAxis.unit})` : XAxis.title)
          }
        ],
        yAxis: [
          {
            axisLine: {
              show: YAxis.show,
              lineStyle: {
                type: YAxis.lineType,
                width: YAxis.lineWidth,
                color: YAxis.lineColor
              }
            },
            axisLabel: {
              show: YAxis.showAxisLabel,
              formatter: (value, index) => {
                return this.formatYLabel(value, YAxis)
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
              show: YAxis.showTicks
            },
            min: YAxis.autoMin ? -80 : YAxis.min,
            max: function (value) {
              if (!YAxis.autoMax) {
                return YAxis.max < value.max ? null : YAxis.max
              }
            },
            // 轴标题和单位
            name:
              YAxis.showTitle &&
              (YAxis.unit ? `${YAxis.title}(${YAxis.unit})` : YAxis.title)
          }
        ],
        dataset: [
          {
            source: this.dataValue
          }
        ],
        series: [
          {
            type: 'scatter',

            zlevel: 99,
            markLine: {
              symbol: 'none',

              data: options
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
</style>
