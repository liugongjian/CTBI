<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import store from '@/store'
export default {
  name: 'WaterfallChart',
  mixins: [baseMixins],
  data () {
    return {
      storeOption: {},
      chartOption: {},
      dataValue: null,
      dataOption: []
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.getOption()
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
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatDataValue(deepClone(this.chartData))
      console.log('dddddd', this.dataValue)
      this.getOption()
    },
    formatDataValue(chartData) {
      console.log('oooo', chartData)
      const DimensionKey = []
      const MeasureKey = []
      const { data, fields } = chartData
      if (data && data.length > 0) {
        for (const key in fields) {
          if (Object.hasOwnProperty.call(fields, key)) {
            const element = fields[key]
            if (key === 'Dimension') {
              element.fields.forEach(field => {
                DimensionKey.push(field.displayColumn)
              })
            } else if (key === 'Measure') {
              element.fields.forEach(field => {
                MeasureKey.push(field.displayColumn)
              })
            }
          }
        }

        const dimensionData = []
        const measureData = []
        data.forEach(item => {
          const dimensionDataTemp = []
          DimensionKey.forEach(dim => {
            dimensionDataTemp.push(item[dim])
          })
          MeasureKey.forEach(mea => {
            measureData.push(item[mea])
          })
          dimensionData.push(dimensionDataTemp.join('-'))
        })
        return { dimensionData, measureData }
      }
    },
    getOption () {
      const { StartOrCumulative } = this.storeOption.theme.NumberSetting.StartOrCumulative
      const { startValueCheck, startValueRemark, startValue, cumulativeValueCheck, cumulativeValueRemark } = StartOrCumulative
      if (startValueCheck) {
        this.dataValue.dimensionData.unshift(startValueRemark)
        this.dataValue.measureData.unshift(startValue)
      }
      if (cumulativeValueCheck) {
        this.dataValue.dimensionData.push(cumulativeValueRemark)
      }

      // this.getSeries(componentOption) // 获取Series

      // // 系列配置-图表标签相关
      // this.setSeriesItem()
      // // 获取颜色设置-使图例颜色与图形颜色对应
      // const colorOption = []
      // componentOption.Color.color.forEach(item => {
      //   colorOption.push(item.color)
      // })
      // // 设置图例与图表距离
      // this.setGrid(componentOption.Legend)

      // // 获取指标筛选中的图例数据
      // const legendData = []
      // this.storeOption.theme.FunctionalOption.ChartFilter.indicatorOption.forEach(item => {
      //   legendData.push({ name: item.value })
      // })
      // this.chartOption = {
      //   'grid': this.grid,
      //   'color': colorOption,
      //   'legend': {
      //     ...componentOption.Legend,
      //     data: legendData
      //   },
      //   'xAxis': this.xAxis,
      //   'tooltip': {
      //     trigger: 'axis'
      //   },
      //   'yAxis': this.yAxis,
      //   'markPoint': this.markPoint,
      //   'dataset': {
      //     'source': this.dataValue
      //   },
      //   'dataZoom': {
      //     'type': 'slider',
      //     'show': this.storeOption.theme.FunctionalOption.DataZoom.showDataZoom !== 'hide',
      //     'realtime': true,
      //     'start': 0,
      //     'end': 100,
      //     'xAxisIndex': [0, 1]
      //   },
      //   'series': this.series
      // }
    },
    getSeries (componentOption) {
      this.series = []
      let seriesLength = 0
      if (this.dataValue && this.dataValue.length > 0) {
        this.dataValue.forEach(item => {
          seriesLength = item.length - 1
        })
      } else {
        return
      }
      this.setAxis()

      for (let i = 0; i < seriesLength; i++) {
        this.series.push({
          type: 'bar',
          name: this.dataValue[0][i + 1],
          label: {
            show: componentOption.ChartLabel.check, // 标签显示
            position: 'top' // 标签位置
          },
          labelLayout: {
            hideOverlap: componentOption.ChartLabel.labelShow === 1 // 1.智能显示，2.全量显示 标签
          },
          itemStyle: this.getItemStyle(componentOption) // 图形样式配置-颜色
        })
      }
    }
  }
}
</script>

<style>
</style>
