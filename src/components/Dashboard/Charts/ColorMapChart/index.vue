<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-color-map"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import mapMixins from '@/components/Dashboard/mixins/mapMixins'
import { deepClone, getParameter } from '@/utils/optionUtils'
export default {
  name: 'ColorMapChart',
  mixins: [mapMixins],
  data () {
    return {
      chartOption: {}
    }
  },
  methods: {
    getOption () {
      const seriesOption = this.getSeriesOption()
      // 获取总计
      this.setTotal()
      const itemStyle = this.getItemStyle()
      if (seriesOption) {
        const min = Number.parseFloat(seriesOption.min)
        const max = Number.parseFloat(seriesOption.max)
        const labelShow = getParameter(this.storeOption, 'theme.ComponentOption.ChartLabel.labelShow')
        this.chartOption = {
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
            color: ['#FFAC2E', '#FFE4B5']
          },
          tooltip: {
            trigger: 'item',
            formatter: ({ marker, data }) => {
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
          series: [
            {
              type: 'map',
              map: 'china',
              // 是否开启鼠标缩放和平移漫游。
              label: {
                show: getParameter(this.storeOption, 'theme.ComponentOption.ChartLabel.check'),
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
                  show: true,
                  color: '#000'
                }
              },
              roam: true,
              zoom: 1.2,
              itemStyle,
              data: seriesOption.data
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
          const text = measureFields.map((field, index) => {
            return {
              name: field.displayColumn,
              value: item[field.displayColumn]
            }
          })

          min = this.getMin(min, item[firstMeasureField])
          max = this.getMax(max, item[firstMeasureField])

          return {
            name: item[dimensionField],
            value: item[firstMeasureField],
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
