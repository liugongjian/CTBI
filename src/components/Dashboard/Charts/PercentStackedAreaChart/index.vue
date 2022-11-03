<!--
 * @Author: 黄璐璐
 * @Date: 2022-09-07 12:06:00
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-08 10:08:13
 * @Description:
-->
<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
      :update-options="{notMerge:true}"
    />
    <svg-icon
      v-else
      icon-class="chart-empty-percent-stacked-area"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import lineMixins from '@/components/Dashboard/mixins/lineMixins'
export default {
  name: 'PercentStackedAreaChart',
  mixins: [lineMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: 'PercentStackedAreaChart'// 图表类型 1.线图；2.面积图; 3.堆叠面积图；4.百分比堆叠图
    }
  },
  watch: {
    'storeOption.theme.ComponentOption.PercentStack': {
      handler (val) {
        this.storeOption.theme.ComponentOption.ChartLabel.type = this.type
        if (val.isStack && !val.isPercent) {
          this.storeOption.theme.ComponentOption.ChartLabel.type = 'StackedAreaChart'
        }
        if (val.isPercent) {
          this.storeOption.theme.ComponentOption.ChartLabel.type = 'PercentStackedAreaChart'
        }
      },
      deep: true
    }
  },
  methods: {
    getOption () {
      const { ComponentOption, FunctionalOption } = this.storeOption.theme
      this.transformData(FunctionalOption.ChartFilter.selectedIndicator)
      this.getPercentStackSeries(ComponentOption, FunctionalOption)

      // 系列配置-图表标签相关
      this.setSeriesItem()
      // 获取颜色设置-使图例颜色与图形颜色对应
      const colorOption = []
      ComponentOption.Color.color.forEach(item => {
        colorOption.push(item.color)
      })
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)
      const legendLayout = this.getLegendLayout(ComponentOption.Legend)

      this.chartOption = {
        grid: this.grid,
        color: colorOption,
        legend: legendLayout,
        xAxis: this.xAxis,
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let result = ''
            params.forEach((item, index) => {
              const { data, seriesName, marker, color, name } = item
              if (index === 0) {
                result += `<div>${name}</div>`
                result += '<div>总计：100%</div>'
              }

              result += `<div style="line-height: 25px;">${marker}</span>
                  <span style="color: ${color};">${seriesName}</span>
                  <span style="float: right;margin-left: 20px;">${data[index + 1]}%</span>
                </div>`
            })
            return result
          }
        },
        yAxis: this.yAxis,
        markPoint: this.markPoint,
        dataset: {
          source: this.dataValue
        },
        dataZoom: {
          type: 'slider',
          show: FunctionalOption.DataZoom.showDataZoom !== 'hide',
          realtime: true,
          start: 0,
          end: 100,
          xAxisIndex: [0, 1]
        },
        series: this.series
      }
      console.log(JSON.parse(JSON.stringify(this.chartOption)))
    }
  }
}
</script>

<style>
</style>
