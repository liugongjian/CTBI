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
import { getLayoutOptionById } from '@/utils/optionUtils'
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
      //   dataValue: null
      dataValue: [
        {
          name: 'Sam S Club',
          value: 10000,
          textStyle: {
            color: 'black'
          },
          emphasis: {
            textStyle: {
              color: 'red'
            }
          }
        },
        {
          name: 'Macys',
          value: 6181
        },
        {
          name: 'Amy Schumer',
          value: 4386
        },
        {
          name: 'Jurassic World',
          value: 4055
        },
        {
          name: 'Charter Communications',
          value: 2467
        },
        {
          name: 'Chick Fil A',
          value: 2244
        },
        {
          name: 'Planet Fitness',
          value: 1898
        },
        {
          name: 'Pitch Perfect',
          value: 1484
        },
        {
          name: 'Express',
          value: 1112
        },
        {
          name: 'Home',
          value: 965
        },
        {
          name: 'Johnny Depp',
          value: 847
        },
        {
          name: 'Lena Dunham',
          value: 582
        },
        {
          name: 'Lewis Hamilton',
          value: 555
        },
        {
          name: 'KXAN',
          value: 550
        },
        {
          name: 'Mary Ellen Mark',
          value: 462
        },
        {
          name: 'Farrah Abraham',
          value: 366
        },
        {
          name: 'Rita Ora',
          value: 360
        },
        {
          name: 'Serena Williams',
          value: 282
        },
        {
          name: 'NCAA baseball tournament',
          value: 273
        },
        {
          name: 'Point Break',
          value: 265
        }
      ],
      shape: 'rectangle', // 默认矩形
      vertical: false, // 默认水平
      isMaxValue: true,
      isMinValue: false,
      minValue: 12,
      maxValue: 50
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        // 词云形状
        this.shape = val.theme.ComponentOption.WordCloudShape.shape
        // 词云文字方向
        this.vertical = val.theme.ComponentOption.TextDirection.vertical
        // 词大小范围
        this.isMaxValue = val.theme.ComponentOption.WordCloudTextSize.isMaxValue
        if (this.isMaxValue) {
          this.maxValue = Math.max.apply(Math, this.dataValue.map(function (o) { return o.value }))
          this.maxValue = this.maxValue - 50 > 0 ? 50 : this.maxValue
        } else {
          this.maxValue = val.theme.ComponentOption.WordCloudTextSize.maxValue - 50 > 0 ? 50 : val.theme.ComponentOption.WordCloudTextSize.maxValue
        }
        this.isMinValue = val.theme.ComponentOption.WordCloudTextSize.isMinValue
        if (this.isMinValue) {
          this.maxValue = Math.min.apply(Math, this.dataValue.map(function (o) { return o.value }))
          this.minValue = this.minValue - 12 > 0 ? this.minValue : 12
        } else {
          this.minValue = val.theme.ComponentOption.WordCloudTextSize.minValue - 12 > 0 ? val.theme.ComponentOption.WordCloudTextSize.minValue : 12
        }
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          // this.getOption()
        }
        this.getOption()
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.chartOption = {
        legend: componentOption.Legend,
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}<br />{a}: {c}'
        },
        series: [
          {
            name: '运输成本',
            type: 'wordCloud',
            gridSize: 2,
            // sizeRange: [12, 50],
            sizeRange: [this.minValue, this.maxValue],
            rotationRange: !this.vertical ? [0, 0] : [-90, 90],
            rotationStep: !this.vertical ? 45 : 90, // 水平时 旋转步长 和 纵向时 旋转步长
            shape: this.shape,
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
