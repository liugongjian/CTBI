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
import { getLayoutOptionById } from '@/utils/optionUtils'
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
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        // 显示总计
        const totalShow = val.theme.ComponentOption.TotalShow.show
        if (totalShow) {
          let sum = 0
          for (let i = 1; i < this.dataValue.length; i++) {
            sum += this.dataValue[i][1]
          }
          val.theme.ComponentOption.TotalShow.value = sum
        }
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
  },
  methods: {
    getOption () {
      const { ComponentOption } = this.storeOption.theme
      const radius = this.radius.map(item => {
        item = (parseInt(item) * parseInt(ComponentOption.ChartRadius[1]) / 100).toFixed('0') + '%'
        return item
      })

      const { checkList, check, precision, labelShow } = ComponentOption.ChartLabel
      // 合并数据为其他
      const { num } = ComponentOption.MergeOther
      const mergeShow = ComponentOption.MergeOther.show
      if (mergeShow && num) {
        this.transfromData(ComponentOption.MergeOther.num)
      }
      this.chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: (data) => {
            return data.name + ': ' + data.value[data.encode.value[0]] + ', ' + data.percent.toFixed(precision) + '%'
          }
        },
        legend: ComponentOption.Legend,
        dataset: {
          source: this.dataValue
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
            label: {
              show: check,
              formatter: function (data) {
                let formatter = ''
                if (checkList.includes('维度')) {
                  formatter += data.name + ' '
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
            //   // value: this.dataValue[0][2]
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
