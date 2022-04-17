<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>

</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import pieMixins from '@/components/BI/mixins/pieMixins'
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
        console.log('storeOptionchange', this.dataValue)
        // this.getOption()
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      const that = this
      const { ComponentOption, Basic, SeriesSetting } = that.storeOption.theme

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
      if (mergeShow && num) {
        that.transfromData(ComponentOption.MergeOther.num)
      }
      // 取到颜色配置
      const color = ComponentOption.Color.color

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
            if (name === SeriesSetting.SeriesSelect.selectValue) {
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
                    return colorTemp.color
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
                  if (data.name === SeriesSetting.SeriesSelect.selectValue) {
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
            }
            // encode: {
            //   itemName: 'product',
            //   // value: that.dataValue[0][2]
            //   value: 2 // 除维度以外的第2列
            // }
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
