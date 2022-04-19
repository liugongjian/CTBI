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
import pieMixins from '@/components/Dashboard/mixins/pieMixins'
import { colorTheme } from '@/constants/color.js'
import store from '@/store'
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
          this.dataValue = val.dataSource
          // this.getOption()
        }
        // 显示总计
        const totalShow = val.theme.ComponentOption.TotalShow.show
        if (totalShow) {
          let sum = 0
          for (let i = 1; i < this.dataValue.length; i++) {
            sum += this.dataValue[i][1]
          }
          val.theme.ComponentOption.TotalShow.value = sum
        }
        this.getOption()
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getInitColor()
  },
  methods: {
    getInitColor () {
      // 将图中的颜色和数据 添加到 vuex中
      const temp = store.state.app.layout.find(item => {
        return item.i === this.identify
      })
      const newTemp = deepClone(temp)
      this.color = []
      if (this.dataValue) {
        this.dataValue.forEach((item, index) => {
          if (index) {
            const idx = (index) % colorTheme['defaultColor'].length
            this.color.push({ name: item[0], color: colorTheme['defaultColor'][idx] })
          }
        })
      } else {
        colorTheme['defaultColor'].forEach((item, index) => {
          this.color.push({ name: '', color: colorTheme['defaultColor'][index] })
        })
      }

      newTemp.option.theme.ComponentOption.Color.color = this.color
      store.dispatch('app/updateLayoutItem', { id: this.identify, item: newTemp })
    },
    getOption () {
      debugger
      const that = this
      that.getInitColor()
      const { ComponentOption, Basic } = that.storeOption.theme
      that.radius = Basic.VisualStyle.style === 'pie' ? ['0', '75%'] : ['30%', '75%']
      const radius = that.radius.map(item => {
        item = (parseInt(item) * parseInt(ComponentOption.ChartRadius[1]) / 100).toFixed('0') + '%'
        return item
      })

      const { checkList, check, precision, labelShow } = ComponentOption.ChartLabel
      // 合并数据为其他
      const { num } = ComponentOption.MergeOther
      const mergeShow = ComponentOption.MergeOther.show
      if (mergeShow && num) {
        that.transfromData(ComponentOption.MergeOther.num)
      }

      console.log('....111', that.color)
      that.color = ComponentOption.Color.color
      console.log('....222', that.color)
      that.chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: (data) => {
            return data.name + ': ' + data.value[data.encode.value[0]] + ', ' + data.percent.toFixed(precision) + '%'
          }
        },
        legend: ComponentOption.Legend,
        dataset: {
          source: that.dataValue
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
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              normal: {
                color: (data) => {
                  // const index = (data.dataIndex) % colorTheme['defaultColor'].length
                  // return colorTheme['defaultColor'][index]
                  const colorTemp = that.color.find((item) => { return data.name === item.name })
                  console.log('.....', that.color, data.name, colorTemp)
                  return colorTemp.color
                }
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
