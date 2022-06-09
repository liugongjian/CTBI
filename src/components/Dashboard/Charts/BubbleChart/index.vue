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
import YAxis from '@/components/Dashboard/mixins/YAxisMixins'
import bubbleMixins from '@/components/Dashboard/mixins/bubbleMixins'
export default {
  name: 'BubbleChart',
  mixins: [YAxis, bubbleMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'BubbleChart'
    }
  },
  methods: {
    getOption () {
      const { ComponentOption } = this.storeOption.theme
      const { Legend } = ComponentOption
      // 设置图例与图表距离
      this.setGrid(Legend)
      console.log(this.dataValue, '气泡图dataValue')
      this.chartOption = {
        legend: Legend,
        grid: this.grid,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        dataset: {
          source: this.dataValue
        },
        series: this.series
      }
    }
  }
}
</script>

