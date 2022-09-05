<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="JSON.stringify(dataValue) !== '{}'"
      :option="chartOption"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-radar"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import radarMixins from '@/components/Dashboard/mixins/radarMixins'
import store from '@/store'
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
      dataOption: [],
      indicator: [],
      dataValue: {},
      series: [
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (JSON.stringify(this.dataValue) !== '{}') {
          this.dataValue = val.dataSource
        }
        this.getOption()
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    setData () {
      const { data = [], fields } = this.dataValue
      const { Color } =
        this.storeOption.theme.ComponentOption
      if (data && data.length > 0) {
        for (const key in fields) {
          if (key === 'Dimension') {
            // 维度只有一个
            const column = fields[key]['fields'][0].column
            this.indicator = data.map(item => { return { name: item[column] } })
          } else if (key === 'Measure') {
            fields[key]['fields'].forEach((field, index) => {
              const column = field.column
              this.series.push({
                value: data.map(item => item[column]),
                name: column,
                areaStyle: {
                  normal: {
                    width: 1,
                    opacity: 0
                  }
                },
                itemStyle: {
                  normal: {
                    color: Color['theme'][index].value,
                    lineStyle: {
                      color: Color['theme'][index].value
                    }
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
              })
            })
          }
        }
      }
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
      const { Legend, RadarChartShape, RadarLabel: { labelShow, areaStyle }, Color: { color } } =
        this.storeOption.theme.ComponentOption
      this.setRadarConfig(areaStyle, labelShow)
      this.setColor(color)
      this.setData()
      const shape = RadarChartShape.shape
      this.chartOption = {
        legend: Legend,
        radar: {
          indicator: [
            ...this.indicator
          ],
          axisLabel: {
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
