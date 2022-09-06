<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
      :change-delay="500"
    />
    <svg-icon
      v-else
      icon-class="chart-empty-pie"
      class="chart-empty-svg"
    />
  </div>

</template>

<script>
import pieMixins from '@/components/Dashboard/mixins/pieMixins'
export default {
  name: 'PieChart',
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
      radius: [],
      color: []
    }
  },
  methods: {
    getOption () {
      const that = this
      const { ComponentOption, Basic, SeriesSetting, FunctionalOption } = that.storeOption.theme

      // 取到指标的下标 如 2015年 index为1
      const indicatorIdx = that.dataValue && that.dataValue[0].indexOf(FunctionalOption.ChartFilter.selectedIndicator) > -1 ? that.dataValue[0].indexOf(FunctionalOption.ChartFilter.selectedIndicator) : 1

      // 半径变化
      that.radius = Basic.VisualStyle.style === 'pie' ? ['0', '75%'] : ['30%', '75%']
      const radius = that.radius.map(item => {
        item = (parseInt(item) * parseInt(ComponentOption.ChartRadius[1]) / 100).toFixed('0') + '%'
        return item
      })

      // 图表标签
      const { checkList, check, precision, labelShow } = ComponentOption.ChartLabel

      // 合并数据为其他
      const { num } = ComponentOption.MergeOther
      const mergeShow = ComponentOption.MergeOther.show
      let dataValue = []
      if (mergeShow && num > 0 && num < SeriesSetting.SeriesSelect.seriesOption.length) {
        dataValue = that.transformData(ComponentOption.MergeOther.num, FunctionalOption.ChartFilter.selectedIndicator)
      } else {
        dataValue = that.dataValue
      }
      // 取到颜色配置
      const color = ComponentOption.Color.color

      // // 显示总计
      const totalShow = ComponentOption.TotalShow.show
      if (totalShow) {
        // 获取数据
        let sum = 0
        for (let i = 1; i < dataValue.length; i++) {
          sum += Number(dataValue[i][indicatorIdx])
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
            let nameTemp = ''
            if (SeriesSetting && data.data[0] !== '其他合计') {
              SeriesSetting.SeriesSelect.seriesOption.forEach(item => {
                if (item.value === data.data[0]) {
                  nameTemp = item.remark
                }
              })
            } else {
              nameTemp = data.data[0]
            }
            return nameTemp + ': ' + data.value[data.encode.value[0]] + ', ' + data.percent.toFixed(precision) + '%'
          }
        },
        grid: this.grid,
        legend: {
          ...ComponentOption.Legend,
          formatter: function (name) {
            if (SeriesSetting && name !== '其他合计') {
              let nameTemp = ''
              SeriesSetting.SeriesSelect.seriesOption.forEach(item => {
                if (item.value === name) {
                  nameTemp = item.remark
                }
              })
              return nameTemp
            } else {
              return name
            }
          }
        },
        dataset: {
          source: dataValue
        },
        series: [
          {
            type: 'pie',
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
              color: (data) => {
                if (color[0].name && data.data[0] !== '其他合计') {
                  const colorTemp = color.find((item) => { return data.data[0] === item.name })
                  return colorTemp ? colorTemp.color : 'red'
                } else if (data.data[0] === '其他合计') {
                  debugger
                  console.log('1122', color, color[num].color)
                  return color[color.length - 1].color
                } else {
                  const index = (data.dataIndex) % color.length
                  return color[index].color
                }
              }
            },
            label: {
              show: check,
              alignTo: 'labelLine',
              formatter: function (data) {
                let formatter = ''
                if (checkList.includes('维度')) {
                  if (SeriesSetting && data.data[0] !== '其他合计') {
                    let nameTemp = ''
                    SeriesSetting.SeriesSelect.seriesOption.forEach(item => {
                      if (item.value.trim() === data.data[0].trim()) {
                        nameTemp = item.remark
                      }
                    })
                    formatter += nameTemp + ' '
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
