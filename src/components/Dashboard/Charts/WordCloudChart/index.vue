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
import 'echarts-wordcloud'
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
export default {
  name: 'WordCloudChart',
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
      maxValue: 60
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      const { ComponentOption } = this.storeOption.theme
      // 词云形状
      const shape = ComponentOption.WordCloudShape.shape
      // 词云文字方向
      const vertical = ComponentOption.TextDirection.vertical
      // 词大小范围
      const isMaxValue = ComponentOption.WordCloudTextSize.isMaxValue
      // value求和
      const sum = this.dataValue.reduce((sumTemp, item) => sumTemp + item.value, 0)

      if (isMaxValue) {
        this.maxValue = (Math.max.apply(Math, this.dataValue.map(function (o) { return o.value })) / sum) * 60
        this.maxValue = this.maxValue - 60 > 0 ? 60 : this.maxValue
      } else {
        this.maxValue = ComponentOption.WordCloudTextSize.maxValue - 60 > 0 ? 60 : ComponentOption.WordCloudTextSize.maxValue
      }
      if (this.maxValue < 12) {
        this.maxValue = 12
      }

      const isMinValue = ComponentOption.WordCloudTextSize.isMinValue
      if (isMinValue) {
        this.minValue = (Math.min.apply(Math, this.dataValue.map(function (o) { return o.value })) / sum) * 12
        this.minValue = this.minValue - 12 > 0 ? this.minValue : 12
      } else {
        this.minValue = ComponentOption.WordCloudTextSize.minValue - 12 > 0 ? ComponentOption.WordCloudTextSize.minValue : 12
      }
      if (this.minValue > 60) {
        this.minValue = 60
      }

      this.chartOption = {
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}<br />{a}: {c}'
        },
        series: [
          {
            name: '运输成本', // 后面根据维度修改 TODO
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
