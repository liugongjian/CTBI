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
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import radarMixins from '@/components/Dashboard/mixins/radarMixins'
export default {
  name: 'RadarChart',
  mixins: [radarMixins],
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
      dataValue: null,
      series: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: '分配预算',
          itemStyle: {
            normal: {
              color: '#FFE434',
              lineStyle: {
                color: '#FFE434'
              }
            }
          },
          areaStyle: {
            normal: {
              width: 1,
              opacity: 0
            }
          },
          label: {
            normal: {
              show: false,
              formatter: (params) => {
                return params.value
              }
            }
          }
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: '实际支出',
          itemStyle: {
            normal: {
              color: '#56A3F1',
              lineStyle: {
                color: '#56A3F1'
              }
            }
          },
          areaStyle: {
            normal: {
              width: 1,
              opacity: 0.5
            }
          },
          label: {
            normal: {
              show: false,
              formatter: (params) => {
                return params.value
              }
            }
          }
        }
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
        }
        this.getOption()
      },
      deep: true
    },
    'storeOption.dataSource': {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          this.setData()
          this.getOption()
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    setData () {
      this.series[0].name = this.dataValue[0][0]
      this.series[0].value = this.dataValue[0][1]
      this.series[1].name = this.dataValue[1][0]
      this.series[1].value = this.dataValue[1][1]
    },
    // 面积填充
    setRadarConfig (areaStyle, labelShow) {
      this.series.forEach((item, index) => {
        item.areaStyle.normal.opacity = areaStyle ? 0.5 : 0
        if (Number(labelShow) === 0) {
          item.label.normal.show = false
        } else if (Number(labelShow) === 1) {
          if (index === 0) {
            item.label.normal.show = true
          }
        } else {
          item.label.normal.show = true
        }
      })
    },
    setColor (color) {
      this.series.forEach(item => {
        const data = color.find((data) => { return data.name === item.name })
        if (data) {
          item.itemStyle.normal.color = data.color
        }
      })
    },
    getOption () {
      const { Legend, RadarChartShape, RadarLabel: { labelShow }, RadarColor: { areaStyle, color }, RadarCoordinates } =
        this.storeOption.theme.ComponentOption
      const { maxValue, minValue, autoMaxValue, autoMinValue, showCoordinates } = RadarCoordinates
      this.setRadarConfig(areaStyle, labelShow)
      this.setColor(color)
      const shape = RadarChartShape.shape
      this.chartOption = {
        legend: Legend,
        radar: {
          indicator: [
            { name: '销售', max: autoMaxValue ? 6500 : (maxValue || 6500), min: autoMinValue ? 0 : minValue, axisLabel: { show: showCoordinates } },
            { name: '管理', max: 16000 },
            { name: '信息技术', max: 30000 },
            { name: '客服', max: 38000 },
            { name: '研发', max: 52000 },
            { name: '市场', max: 25000 }
          ],
          axisLabel: {
            // show: axisLabel,
            // show: RadarCoordinates.showCoordinates,
            color: '#333',
            showMinLabel: true
          },
          shape: shape,
          name: { // (圆外的标签)雷达图每个指示器名称的配置项。
            show: true,
            formatter: '{value}',
            textStyle: {
              fontSize: 10,
              color: '#333',
              padding: [-10, -12]
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: this.series
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
