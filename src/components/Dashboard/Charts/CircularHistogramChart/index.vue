<template>
  <div style="width:100%;height:100%;">
    <v-chart v-if="dataValue" :option="chartOption" :update-options="{ notMerge: true }" autoresize />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone, getDataValueById } from '@/utils/optionUtils'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
export default {
  name: 'CircularHistogramChart',
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
      dataValue: []
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (this.dataValue.length > 0) {
          this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    reloadImpl () {
      this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
      this.getOption()
    },
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      // 设置图例与图表距离
      this.setGrid(componentOption.Legend)
      this.chartOption = {
        polar: {
          radius: [10, '80%']
        },
        angleAxis: {
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          axisLabel: {
            rotate: 10,
            showMaxLabel: true,
            interval: 0,
            fontSize: 10
          },
          axisTick: { show: false },
          axisLine: { show: false },
          data: this.dataValue.xData
        },
        legend: {
          ...componentOption.Legend,
          itemHeight: 10,
          itemWidth: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // type: 'shadow',
            // shadowStyle: {
            //   color: 'rgba(0, 0, 0, 0.03)'
            // }
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.03)',
              type: 'solid',
              width: 10
            }
          }
        },
        series: {
          type: 'bar',
          name: this.dataValue.yKey,
          color: '#1B7CFF',
          barWidth: 10,
          data: this.dataValue.yData,
          coordinateSystem: 'polar'
        }
      }
    },
    formatData (dataValue) {
      console.log(dataValue, '接收的数据')
      const obj = []
      const MeasureData = []
      const DimensionData = []
      let MeasureSecondKey = ''
      let yKey = ''
      const { data, fields } = dataValue
      console.log(fields, data, 'fffff')
      if (data && data.length > 0) {
        yKey = fields.Measure?.fields[0]?.column
        for (const key in fields) {
          // 获取x轴
          if (key === 'Dimension') {
            MeasureSecondKey = fields[key]['fields'][0].column
            data.forEach((item) => { DimensionData.push(item[MeasureSecondKey]) })
          }
          // 获取Y轴/度量
          if (key === 'Measure') {
            MeasureSecondKey = fields[key]['fields'][0].column
            data.forEach((item) => { MeasureData.push(item[MeasureSecondKey]) })
          }
        }
        obj.yKey = yKey
        obj.yData = MeasureData
        obj.xData = DimensionData
        obj.length = 1
      }
      return obj
    },
    setGrid (legend) {
      if (legend.top === 'auto' && legend.left === 'center') { // 图例在上
        this.grid = {
          top: 50
        }
      } else if (legend.top === 'bottom' && legend.left === 'center') { // 图例在下
        this.grid = {
          bottom: 50
        }
      } else if (legend.top === 'center' && legend.left === 'auto') { // 图例在左
        this.grid = {
          left: 120
        }
      } else if (legend.top === 'center' && legend.left === 'right') { // 图例在右
        this.grid = {
          right: 120
        }
      }
    }
  }
}
</script>

<style>
</style>
