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
import { getLayoutOptionById } from '@/utils/optionUtils'
import radarMixins from '@/components/BI/mixins/radarMixins'
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
      dataValue: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: '分配预算'
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: '实际支出'
        }
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
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
      const { Legend, RadarChartShape, RadarLabel: { labelShow }, RadarColor: { areaStyle } } = this.storeOption.theme.ComponentOption
      let axisLabel = false
      let itemAxisLabel = false
      if (Number(labelShow) === 0) {
        axisLabel = false
      } else if (Number(labelShow) === 1) {
        itemAxisLabel = true
      } else {
        axisLabel = true
      }
      console.log(areaStyle, 'areaStyle')
      const shape = RadarChartShape.shape
      this.chartOption = {
        color: ['#FFE434', '#56A3F1'],
        legend: Legend,
        radar: {
          indicator: [
            { name: '销售', max: 6500 },
            { name: '管理', max: 16000 },
            { name: '信息技术', max: 30000 },
            { name: '客服', max: 38000 },
            { name: '研发', max: 52000 },
            { name: '市场', max: 25000, axisLabel: { show: itemAxisLabel } }
          ],
          axisLabel: {
            show: axisLabel,
            color: '#333',
            showMinLabel: false
          },
          radius: 40, // 缩放
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
            data: this.dataValue,
            areaStyle: {
              opacity: areaStyle ? 0.5 : 0
            }
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
