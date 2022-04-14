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
    },
    // 合并数据为其他 val val为1 就是保留最大的一个数据 其他数据合并为其他
    transfromData (val) {
      // 取除维度以外的第1列为vlaue
      let data = []
      for (let i = 1; i < this.dataValue.length; i++) {
        data.push({ name: this.dataValue[i][0], value: this.dataValue[i][1] })
      }
      // 数据按数值从大到小排序
      data = data.sort((a, b) => { return b.value - a.value })
      const showCount = val // 单独显示的数据条数
      if (data.length > showCount) {
        // 数据大于9条时将前9条单独显示
        const dataTemp = data.splice(0, showCount)
        let leftSum = 0
        // 剩余数据合并
        data.forEach(d => { leftSum += d.value })
        data = dataTemp.concat({ name: '其他合计', value: leftSum })
      }
      const aTemp = []
      aTemp[0] = [].concat(this.dataValue[0][0], this.dataValue[0][1])
      //  val+2 行
      for (let i = 1; i < val + 2; i++) {
        aTemp[i] = [].concat([data[i - 1].name, data[i - 1].value])
      }
      console.log('<<<<', data, aTemp)
      this.dataValue = aTemp
    }
  }
}
</script>

<style>
</style>
