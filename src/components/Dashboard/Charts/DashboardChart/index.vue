<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue && dataValue.length > 0"
      :option="chartOption"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-dashboard"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import dashboardMixins from '@/components/Dashboard/mixins/dashboardMixins'
import store from '@/store'
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
      dataOption: [],
      dataValue: {},
      title: {
        x: 'center',
        y: '75%',
        text: '实际50',
        textStyle: {
          fontSize: 16,
          color: '#0095ff'
        }
      },
      series: [
        {
          name: '仪表盘',
          type: 'gauge',
          radius: '100%',
          progress: {
            show: false
          },
          min: 0,
          max: 100,
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
            show: true
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
            show: true,
            distance: 25,
            formatter: (params) => {
              return params
            } // 控制百分比 原始值
          },
          title: {
            show: true,
            color: '#333',
            fontSize: 13
          },
          splitNumber: 4,
          detail: {
            show: true,
            valueAnimation: true,
            formatter: '{value}',
            textStyle: {
              fontSize: 16
            }
          },
          data: [
            // {
            //   'value': 50,
            //   'name': '速度'
            // }
          ]
        }

      ]
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    setStyle (style) {
      const data = this.series[0]
      data.data.value = this.dataValue
      data.axisLine.lineStyle.width = 20
      data.startAngle = 200
      data.endAngle = -20
      data.axisLabel.distance = 25
      if (style === 'standard') {
        data.axisTick.show = false
      } else if (style === 'fan') {
        data.startAngle = 520
        data.endAngle = -700
        data.axisTick.show = false
        data.axisLine.lineStyle.width = 50
        data.axisLabel.distance = 55
      } else {
        data.axisTick.show = true
      }
    },
    setConfigSize (ConfigSize) {
      this.series[0].min = ConfigSize.start
      this.series[0].max = ConfigSize.end
    },
    setConfigLabel (label) {
      const data = this.series[0]
      data.title.color = label.name.color
      data.title.fontSize = label.name.fontSize
      data.detail.color = label.value.color
      data.detail.textStyle.fontSize = label.value.fontSize
      // 百分比 数值切换
      data.detail.formatter = label.format ? this.dataValue.value : `${(this.dataValue.value / data.max * 100).toFixed(label.decimal)}%`
      // 副标签控制
      this.title.textStyle.color = label.deputy.color
      this.title.textStyle.fontSize = label.deputy.fontSize
      this.title.text = label.format ? `占比: ${(this.dataValue.value / data.max * 100).toFixed(label.deputy.decimal)}%` : `实际: ${this.dataValue.value}`
    },
    setScale (scale) {
      this.series[0].splitLine.show = scale.show
      this.series[0].axisLabel.show = scale.show
      this.series[0].axisLabel.formatter = (params) => {
        if (scale.type === 'original') {
          return params
        } else {
          return (params / this.series[0].max * 100).toFixed(0) + '%'
        }
      }
    },
    getOption () {
      const { Basic: { VisualStyle: { style } }, ComponentOption, StyleConfig } = this.storeOption.theme
      const { ConfigSize } = ComponentOption
      const { Label, Scale } = StyleConfig
      this.setStyle(style)
      this.setConfigSize(ConfigSize)
      this.setConfigLabel(Label)
      this.setScale(Scale)
      this.series[0].data[0] = this.dataValue
      this.chartOption = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'

        },
        title: this.title,
        series: this.series
      }
    }
  }
}
</script>

<style>
</style>
