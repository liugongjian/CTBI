<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-word-cloud"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import 'echarts-wordcloud'
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import store from '@/store'
export default {
  name: 'WordCloudChart',
  mixins: [baseMixins],
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
      minValue: 12,
      maxValue: 60,
      dataOption: [],
      MeasureKey: ''
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
      this.getOption()
    },
    formatDataValue (chartData) {
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
        // 若没有度量 则计算出现的频次 作为datavalue的value值
        if (MeasureKey.length === 0) {
          this.MeasureKey = '频次'
          const dataValue = data.map(item => {
            for (const key in item) {
              if (Object.hasOwnProperty.call(item, key)) {
                if (DimensionKey.indexOf(key) > -1) {
                  const temp = item[key]
                  delete item[key]
                  item.name = temp
                  var count = 1
                  for (var j = 0; j < data.length; j++) {
                    if (data[j][key] === temp) {
                      count++
                    }
                  }
                  item.value = count
                }
              }
            }
            return item
          })
          return dataValue
        } else {
          const dataValue = data.map(item => {
            for (const key in item) {
              if (Object.hasOwnProperty.call(item, key)) {
                if (DimensionKey.indexOf(key) > -1) {
                  const temp = item[key]
                  delete item[key]
                  item.name = temp
                }
                if (MeasureKey.indexOf(key) > -1) {
                  const temp = item[key]
                  delete item[key]
                  item.value = Number(temp)
                }
              }
            }
            return item
          })
          this.MeasureKey = MeasureKey + ''

          return dataValue
        }
      }
    },
    getOption () {
      const { ComponentOption } = this.storeOption.theme
      // 词云形状
      const shape = ComponentOption.WordCloudShape.shape
      // 词云文字方向
      const vertical = ComponentOption.TextDirection.vertical
      // 词大小范围
      const isMaxValue = ComponentOption.WordCloudTextSize.isMaxValue
      // value求和
      if (this.dataValue) {
        const sum = this.dataValue.reduce((sumTemp, item) => sumTemp + Number(item.value), 0)

        if (isMaxValue) {
          this.maxValue = parseInt((Math.max.apply(Math, this.dataValue.map(function (o) { return Number(o.value) })) * 100 / sum) * 60)
          this.maxValue = this.maxValue - 60 > 0 ? 60 : this.maxValue
        } else {
          this.maxValue = ComponentOption.WordCloudTextSize.maxValue - 60 > 0 ? 60 : ComponentOption.WordCloudTextSize.maxValue
        }
        if (this.maxValue < 12) {
          this.maxValue = 12
        }

        const isMinValue = ComponentOption.WordCloudTextSize.isMinValue
        if (isMinValue) {
          this.minValue = parseInt((Math.min.apply(Math, this.dataValue.map(function (o) { return Number(o.value) })) * 100 / sum) * 12)
          this.minValue = this.minValue - 12 > 0 ? this.minValue : 12
        } else {
          this.minValue = ComponentOption.WordCloudTextSize.minValue - 12 > 0 ? ComponentOption.WordCloudTextSize.minValue : 12
        }
        if (this.minValue > 60) {
          this.minValue = 60
        }
      } else {
        return
      }
      if (this.maxValue < this.minValue) {
        this.maxValue = this.minValue
      }
      console.log('33322', this.minValue, this.maxValue)

      this.chartOption = {
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}<br />{a}: {c}'
        },
        series: [
          {
            name: this.MeasureKey || '频次', // 度量的值
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [this.minValue, this.maxValue],
            rotationRange: !vertical ? [0, 0] : [-90, 90],
            rotationStep: !vertical ? 45 : 90, // 水平时 旋转步长 和 纵向时 旋转步长
            shape: shape,
            width: '70%',
            height: '80%',
            drawOutOfBound: true,
            textStyle: {
              color: function () {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')'
              }
            },
            emphasis: {
              textStyle: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            data: this.dataValue
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
