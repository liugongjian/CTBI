<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <svg-icon v-else icon-class="chart-empty-rose" style="width:100%;height:100%;" />
  </div>

</template>

<script>
import pieMixins from '@/components/Dashboard/mixins/pieMixins'
export default {
  name: 'RoseChart',
  mixins: [pieMixins],
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
      radius: ['0', '75%']
    }
  },
  methods: {
    getOption () {
      const that = this
      const { ComponentOption, SeriesSetting, FunctionalOption } = that.storeOption.theme

      // 取到指标的下标 如 2015年 index为1
      const indicatorIdx = that.dataValue && that.dataValue[0].indexOf(FunctionalOption.ChartFilter.selectedIndicator) > -1 ? that.dataValue[0].indexOf(FunctionalOption.ChartFilter.selectedIndicator) : 1

      // 半径变化
      const radius = that.radius.map(item => {
        item = (parseInt(item) * parseInt(ComponentOption.ChartRadius[1]) / 100).toFixed('0') + '%'
        return item
      })
      // 图表标签
      const { checkList, check, precision, labelShow } = ComponentOption.ChartLabel
      // 取到颜色配置
      const color = ComponentOption.Color.color
      // // 显示总计
      const totalShow = ComponentOption.TotalShow.show
      if (totalShow) {
        // 获取数据
        let sum = 0
        for (let i = 1; i < that.dataValue.length; i++) {
          sum += Number(that.dataValue[i][indicatorIdx])
        }
        ComponentOption.TotalShow.value = sum
      }
      // 设置图例与图表距离
      this.setGrid(ComponentOption.Legend)
      // 设置图表的option
      that.chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: (data) => {
            return data.data[0] + ': ' + data.value[data.encode.value[0]] + ', ' + data.percent.toFixed(precision) + '%'
          }
        },
        grid: this.grid,
        legend: {
          ...ComponentOption.Legend,
          formatter: (name) => {
            if (SeriesSetting && name === SeriesSetting.SeriesSelect.selectValue) {
              return SeriesSetting.SeriesSelect.remark
            } else {
              return name
            }
          }
        },
        dataset: {
          source: that.dataValue
        },
        series: [
          {
            type: 'pie',
            roseType: 'area',
            radius: radius,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              normal: {
                color: (data) => {
                  if (color[0].name) {
                    const colorTemp = color.find((item) => { return data.data[0] === item.name })
                    return colorTemp ? colorTemp.color : 'red'
                  } else {
                    const index = (data.dataIndex) % color.length
                    return color[index].value
                  }
                }
              }
            },
            label: {
              show: check,
              formatter: function (data) {
                let formatter = ''
                if (checkList.includes('维度')) {
                  if (SeriesSetting && data.data[0] === SeriesSetting.SeriesSelect.selectValue) {
                    formatter += SeriesSetting.SeriesSelect.remark + ' '
                  } else {
                    formatter += data.data[0] + ' '
                  }
                }
                if (checkList.includes('度量')) {
                  formatter += data.value[data.encode.value[0]] + ' '
                }
                if (checkList.includes('百分比')) {
                  formatter += data.percent.toFixed(precision) + '%'
                }
                return formatter
              }
            },
            // 数据标签展示样式 todo
            labelLayout: {
              hideOverlap: labelShow === 1
            },
            encode: {
              itemName: 0,
              value: indicatorIdx // 除维度以外的第2列
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
