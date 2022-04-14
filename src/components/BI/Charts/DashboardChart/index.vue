<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import dashboardMixins from '@/components/BI/mixins/dashboardMixins'
export default {
  name: 'DashboardChart',
  mixins: [dashboardMixins],
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
      dataValue: 50,
      series: [
        {
          name: '仪表盘',
          type: 'gauge',
          radius: '100%',
          progress: {
            show: false
          },
          startAngle: 200,
          endAngle: -20,
          axisLine: {
            show: true,
            lineStyle: {
              color: [
                [0.33, '#1a7dff'],
                [0.67, '#ff751a'],
                [1, '#16cad6']
              ],
              width: 20 // 标准
              // width: 50 // 扇形
            }

          },
          splitLine: {
            show: false
          },
          // 刻度
          axisTick: {
            show: true,
            splitNumber: 10,
            length: 21,
            distance: -20,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: true,
            valueAnimation: true,
            formatter: '{value}',
            textStyle: {
              fontSize: 16
            }
          },
          data: [
            {
              'value': 50,
              'name': '速度'
            }
          ],
          title: {
            show: false
          }
        }

      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
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
    setStyle (style) {
      const data = this.series[0]
      data.data.value = this.dataValue
      data.axisLine.lineStyle.width = 20
      data.startAngle = 200
      data.endAngle = -20
      if (style === 'standard') {
        data.axisTick.show = false
      } else if (style === 'fan') {
        data.startAngle = 520
        data.endAngle = -700
        data.axisTick.show = false
        data.axisLine.lineStyle.width = 50
      } else {
        data.axisTick.show = true
      }
    },
    getOption () {
      const style = this.storeOption.theme.Basic.VisualStyle.style
      console.log(style)
      this.setStyle(style)
      this.chartOption = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: this.series
        // series: [
        //   {
        //     name: '仪表盘',
        //     type: 'gauge',
        //     radius: '100%',
        //     progress: {
        //       show: false
        //     },
        //     // startAngle: 520,
        //     // endAngle: -700,
        //     startAngle: 200,
        //     endAngle: -20,
        //     axisLine: {
        //       show: true,
        //       lineStyle: {
        //         color: [
        //           [0.33, '#1a7dff'],
        //           [0.66, '#ff751a'],
        //           [1, '#16cad6']
        //         ],
        //         width: 20 // 标准
        //         // width: 50 // 扇形
        //       }

        //     },
        //     splitLine: {
        //       show: false
        //     },
        //     // 刻度
        //     // axisTick: {
        //     //   show: true,
        //     //   splitNumber: 10,
        //     //   length: 21,
        //     //   distance: -20,
        //     //   lineStyle: {
        //     //     color: '#fff',
        //     //     width: 2
        //     //   }
        //     // },
        //     axisLabel: {
        //       show: false
        //     },
        //     detail: {
        //       show: true,
        //       valueAnimation: true,
        //       formatter: '{value}',
        //       textStyle: {
        //         fontSize: 16
        //       }
        //     },
        //     data: [
        //       {
        //         'value': this.dataValue,
        //         'name': '速度'
        //       }
        //     ],
        //     title: {
        //       show: false
        //     }
        //   }

        // ]
      }
    }
  }
}
</script>

<style>
</style>
