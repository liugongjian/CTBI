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
      radius: []
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
      const { ComponentOption, Basic } = this.storeOption.theme
      this.radius = Basic.VisualStyle.style === 'pie' ? ['0', '75%'] : ['30%', '75%']
      const radius = this.radius.map(item => {
        item = (parseInt(item) * parseInt(ComponentOption.ChartRadius[1]) / 100).toFixed('0') + '%'
        return item
      })

      const { checkList, check, precision, labelShow } = ComponentOption.ChartLabel
      // const mergeShow = ComponentOption.MergeOther.show
      // if (mergeShow) {
      //   this.transfromData(ComponentOption.MergeOther.num)
      // }
      this.chartOption = {
        // 'tooltip': option.Tooltip,
        tooltip: {
          trigger: 'item',
          formatter: (data) => {
            return data.name + ': ' + data.value[1] + ', ' + data.percent.toFixed(precision) + '%'
          }
        },
        legend: ComponentOption.Legend,
        dataset: {
          source: this.dataValue
        },
        series: [
          {
            type: 'pie',
            // 'radius': ComponentOption.ChartRadius,
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
                  formatter += data.value[1] + ' '
                }
                if (checkList.includes('百分比')) {
                  formatter += data.percent.toFixed(precision) + '%'
                }
                return formatter
              }
            },
            labelLayout: {
              hideOverlap: labelShow === 1
            }
            // encode: {
            //   itemName: 'product',
            //   value: this.dataValue[0][2]
            // }

          }
        ]
      }
    },
    // 合并数据为其他 val val为1 就是保留最大的一个数据 其他数据合并为其他
    transfromData (val) {
      // sumArr 的长度为数据列数
      // dataValue: [
      //   ['date', '价格', '数量'],
      //   ['Mon', 820, 410],
      //   ['Tue', 932, 320],
      //   ['Wed', 901, 300],
      //   ['Thu', 934, 380],
      //   ['Fri', 1290, 430],
      //   ['Sat', 1330, 480],
      //   ['Sun', 1320, 460]
      // ],
      const sumArr = []
      for (let ii = 0; ii < this.dataValue[0].length - 1; ii++) {
        sumArr.push(0)
      }
      for (let i = 1; i < this.dataValue.length; i++) {
        debugger
        for (let j = 0; j < sumArr.length; j++) {
          debugger
          sumArr[j] += this.dataValue[i][j + 1]
        }
      }
      for (let i = 1; i < this.dataValue.length; i++) {
        for (let j = 0; j < sumArr.length; j++) {
          this.dataValue[i][j + 1] = (this.dataValue[i][j + 1] / sumArr[j] * 100).toFixed(2)
        }
      }
    }
  }
}
</script>

<style>
</style>
