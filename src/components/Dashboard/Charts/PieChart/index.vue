<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
      :change-delay="500"
    />
    <div v-else>数据为空</div>
  </div>

</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import pieMixins from '@/components/Dashboard/mixins/pieMixins'
// import { colorTheme } from '@/constants/color.js'
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
    },
    'storeOption.dataSource': {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          // 拿到数据中的系列名字
          this.getSeriesOptions(this.dataValue)
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          // 拿到数据中的指标
          this.getIndicatorOptions(this.dataValue)
          this.getOption()
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      const that = this
      const { ComponentOption, Basic, SeriesSetting, FunctionalOption } = that.storeOption.theme

      // 取到指标的下标 如 2015年 index为1
      const indicatorIdx = that.dataValue[0].indexOf(FunctionalOption.ChartFilter.filteredSery) > -1 ? that.dataValue[0].indexOf(FunctionalOption.ChartFilter.filteredSery) : 1

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
      if (mergeShow && num > 0) {
        that.transfromData(ComponentOption.MergeOther.num, FunctionalOption.ChartFilter.filteredSery)
      }
      // 取到颜色配置
      const color = ComponentOption.Color.color

      // // 显示总计
      const totalShow = ComponentOption.TotalShow.show
      if (totalShow) {
        // 获取数据
        let sum = 0
        for (let i = 1; i < that.dataValue.length; i++) {
          sum += that.dataValue[i][indicatorIdx]
        }
        ComponentOption.TotalShow.value = sum
      }

      // 设置图表的option
      that.chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: (data) => {
            return data.name + ': ' + data.value[data.encode.value[0]] + ', ' + data.percent.toFixed(precision) + '%'
          }
        },
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
                    const colorTemp = color.find((item) => { return data.name === item.name })
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
                  if (SeriesSetting && data.name === SeriesSetting.SeriesSelect.selectValue) {
                    formatter += SeriesSetting.SeriesSelect.remark + ' '
                  } else {
                    formatter += data.name + ' '
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
              itemName: 'product',
              // value: that.dataValue[0][2]
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
