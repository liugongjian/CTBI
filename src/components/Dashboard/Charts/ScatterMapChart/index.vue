<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue"
      ref="scatterMap"
      :option="chartOption"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-scatter-map"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import mapMixins from '@/components/Dashboard/mixins/mapMixins'
import { deepClone, getParameter } from '@/utils/optionUtils'

export default {
  name: 'ScatterMapChart',
  mixins: [mapMixins],
  data () {
    return {
      chartOption: {}
    }
  },
  methods: {
    getOption () {
      const seriesOption = this.getSeriesOption()
      if (seriesOption) {
        const min = Number.parseFloat(seriesOption.min)
        const max = Number.parseFloat(seriesOption.max)
        const labelShow = getParameter(this.storeOption, 'theme.ComponentOption.ChartLabel.labelShow')
        // 获取总计
        this.setTotal()
        const visualMapColor = this.getVisualMap()
        const itemStyle = this.getItemStyle()
        const area = getParameter(this.storeOption, 'theme.ComponentOption.MapAreaSelect.area')
        const areaJson = this.getAreaJson(area)
        const chart = this.$refs.scatterMap && this.$refs.scatterMap.chart
        if (chart) {
          chart.clear()
        }
        this.$echarts.registerMap(this.identify || 'scatterMap', areaJson)
        this.chartOption = {
          tooltip: {
            trigger: 'item',
            formatter: function ({ data, marker }) {
              let temp = []
              if (data) {
                temp = data.text.map(item => {
                  return `${item.name} ${item.value}`
                })
                return [
                  `${marker} ${data.name}`,
                  ...temp
                ].join('<br \>')
              }
              return ''
            }
          },
          geo: {
            map: this.identify || 'scatterMap',
            // layoutCenter: ['50%', '50%'],
            // layoutSize: this.height || 230,
            // 是否开启鼠标缩放和平移漫游。
            roam: true,
            zoom: 1,
            visualMap: {
              show: true,
              orient: 'horizontal',
              type: 'continuous',
              // visualMapContinuous 组件两端文本
              text: [seriesOption.max, seriesOption.min],
              // 指定 visualMapContinuous 组件的允许的最小值。'min' 必须用户指定。
              min,
              // 指定 visualMapContinuous 组件的允许的最大值。'max' 必须用户指定
              max,
              realtime: true,
              calculable: true,
              color: visualMapColor
            },
            itemStyle: {
              normal: {
                areaColor: itemStyle.areaColor,
                borderColor: itemStyle.borderColor
              }
            },
            label: {
              show: getParameter(this.storeOption, 'theme.ComponentOption.ChartLabel.check'),
              position: 'right',
              formatter: ({ value, name }) => {
                if (labelShow === 1) {
                  if (value) {
                    return name
                  }
                  return ''
                } else {
                  return name
                }
              }
            },
            emphasis: {
              label: {
                show: false,
                position: 'right'
              }
            },
            regions: [
              {
                name: '南海诸岛',
                value: 0,
                show: false,
                itemStyle: {
                  normal: {
                    opacity: 0,
                    label: {
                      show: false
                    },
                    color: '#71D4E7'
                  }
                }
              }
            ]
          },
          series: [
            {
              type: 'effectScatter',
              // 该系列使用的坐标系
              coordinateSystem: 'geo',
              symbolSize: function (val) {
                return val[2] / 30
              },
              itemStyle: {
                normal: {
                  color: visualMapColor[0]
                }
              },
              label: {
                show: getParameter(this.storeOption, 'theme.ComponentOption.ChartLabel.check'),
                position: 'right',
                formatter: ({ value, name }) => {
                  if (labelShow === 1) {
                    if (value) {
                      return name
                    }
                    return ''
                  } else {
                    return name
                  }
                }
              },
              data: seriesOption.data,
              // 配置何时显示特效'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
              showEffectOn: 'render',
              // 目前只有ripple这一种
              effectType: 'ripple',
              // 涟漪特效相关配置。
              rippleEffect: {
                // 动画的时间
                period: 4,
                // 动画中波纹的最大缩放比例
                scale: 4,
                // 波纹的绘制方式可选 'stroke' 和 'fill'
                brushType: 'stroke'
              },
              // Scatter才有这个属性,是否开启鼠标 hover 的提示动画效果
              hoverAnimation: true
            }
          ]
        }
      }
    },
    getSeriesOption () {
      const { data, fields } = this.chartData
      if (data && data.length > 0) {
        // 最小值
        let min = null
        // 最大值
        let max = null
        // 维度， 度量
        const { Dimension, Measure } = fields
        // 维度，只会有一条
        const dimensionField = Dimension.fields[0].displayColumn
        // 度量，最多5条数据
        // 仅截取第一个度量作为地图的展示值，其他值放在tooltip中展示
        const measureFields = Measure.fields
        const firstMeasureField = Measure.fields[0].displayColumn
        const result = data.map(item => {
          let value = []
          const text = []
          measureFields.forEach(field => {
            text.push({
              name: field.displayColumn,
              value: item[field.displayColumn]
            })
            value = value.concat(this.getCenter(item[dimensionField]))
            value.push(item[field.displayColumn])
          })

          min = this.getMin(min, item[firstMeasureField])
          max = this.getMax(max, item[firstMeasureField])

          return {
            name: item[dimensionField],
            value,
            text
          }
        })
        return {
          min,
          max,
          data: deepClone(result)
        }
      }
      return null
    }
  }
}
</script>

<style>
</style>
