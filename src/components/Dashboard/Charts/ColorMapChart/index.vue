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
import mapMixins from '@/components/Dashboard/mixins/mapMixins'
import { deepClone } from '@/utils/optionUtils'
export default {
  name: 'ColorMapChart',
  mixins: [mapMixins],
  data () {
    return {
      chartOption: {},
      dataValue: null
    }
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.dataValue = this.getSeriesData()
      this.chartOption = {
        legend: componentOption.Legend,
        visualMap: {
          show: true,
          type: 'piecewise',
          orient: 'horizontal',
          text: ['100', '0'],
          min: 0,
          max: 100,
          realtime: false,
          calculable: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>{c}'
        },
        series: [
          {
            type: 'map',
            map: 'china',
            roam: true,
            label: {
              show: true
            },
            labelLayout: {
              hideOverlap: true
            },
            data: this.dataValue
          }
        ]
      }
    },
    getSeriesData () {
      const { data, fields } = this.chartData
      if (data && data.length > 0) {
        // 维度， 度量
        const { Dimension, Measure } = fields
        // 维度，只会有一条
        const dimensionField = Dimension.fields[0].displayColumn
        // 度量，最多5条数据
        // 仅截取第一个度量作为地图的展示值，其他值放在tooltip中展示
        const measureFields = Measure.fields
        const firstMeasureField = Measure.fields[0].displayColumn
        const result = data.map(item => {
          const attributes = measureFields.map(field => {
            return {
              name: field.displayColumn,
              value: item[field.displayColumn]
            }
          })
          return {
            name: item[dimensionField],
            value: item[firstMeasureField],
            attributes
          }
        })
        return deepClone(result)
      }
      return []
    }
  }
}
</script>

<style>
</style>
