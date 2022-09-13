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
      dataOption: [],
      xAxis: { type: 'category' },
      yAxis: { type: 'value' }

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
      this.xAxis.data = this.dataValue.dimensionData
      this.getOption()
    },
    formatDataValue(chartData) {
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
            measureData.push(Number(item[mea]))
          })
          dimensionData.push(dimensionDataTemp.join('-'))
        })
        return { dimensionData, measureData }
      }
    },
    getOption () {
      const { StartOrCumulative } = this.storeOption.theme.NumberSetting
      const { ComponentOption } = this.storeOption.theme
      const { startValueCheck, startValueRemark, startValue, cumulativeValueCheck, cumulativeValueRemark } = StartOrCumulative
      if (this.dataValue) {
        if (startValueCheck) {
          if (this.dataValue.dimensionData.indexOf(startValueRemark) >= 0) {
            this.dataValue.dimensionData.splice(0, 1)
            this.dataValue.measureData.splice(0, 1)
          }
          this.dataValue.dimensionData.unshift(startValueRemark)
          this.dataValue.measureData.unshift(Number(startValue))
        }
        if (cumulativeValueCheck) {
          if (this.dataValue.dimensionData.indexOf(cumulativeValueRemark) >= 0) {
            this.dataValue.dimensionData.pop(1)
            this.dataValue.measureData.pop(1)
          }
          this.dataValue.dimensionData.push(cumulativeValueRemark)
          let sum = 0
          this.dataValue.measureData.forEach((item) => {
            sum += item
          })
          this.dataValue.measureData.push(sum)
        }

        const incomeData = this.dataValue.measureData.map((item) => {
          if (item >= 0) {
            return item
          } else {
            return '-'
          }
        })

        const expressData = this.dataValue.measureData.map((item) => {
          if (item < 0) {
            return -(-item)
          } else {
            return '-'
          }
        })

        const placeholderData = [0]
        this.dataValue.measureData.forEach((item, index) => {
          if (index >= 2) {
            let sum = 0
            for (let i = 0; i < index; i++) {
              sum += this.dataValue.measureData[i]
            }
            placeholderData.push(sum)
          } else if (index === 1) {
            placeholderData.push(this.dataValue.measureData[0])
          } else {
            return
          }
        })
        console.log('dada', placeholderData)
        // 获取Series
        this.getSeries(incomeData, expressData, placeholderData)
      }
      console.log('111')

      // // 系列配置-图表标签相关
      // this.setSeriesItem()
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)

      this.chartOption = {
        'grid': this.grid,
        'legend': {
          ...ComponentOption.Legend
        },
        'xAxis': this.xAxis,
        'tooltip': {
          trigger: 'axis'
        },
        'yAxis': this.yAxis,
        'series': this.series
      }
    },
    getSeries (incomeData, expressData, placeholderData) {
      this.series = [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: placeholderData
        },
        {
          name: '增加值',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'top'
          },
          data: incomeData
        },
        {
          name: '减少值',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'bottom'
          },
          data: expressData
        }
      ]
    }
  }
}
</script>

<style>
</style>
