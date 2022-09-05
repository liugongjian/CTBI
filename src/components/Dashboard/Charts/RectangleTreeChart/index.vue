<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      :update-options="{notMerge:true}"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-rectangle-tree"
      class="chart-empty-svg"
    />
  </div>

</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import store from '@/store'
import { colorTheme } from '@/constants/color.js'
export default {
  name: 'RectangleTreeChart',
  mixins: [baseMixins],
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
      MeasureKey: ''
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.getOption()
      },
      deep: true
    },
    // 图表类型切换
    'storeOption.is': {
      handler (val) {
        const isData = this.dataOption.findIndex(item => {
          return item.id === this.identify
        })
        if (isData !== -1) {
          this.$bus.$emit('interReload', [this.identify], 100, false)
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatDataValue(deepClone(this.chartData))
      this.getColor()
      this.getOption()
    },
    formatDataValue (chartData) {
      const DimensionKey = []
      const MeasureKey = []
      const { data, fields } = chartData
      if (data && data.length > 0) {
        for (const key in fields) {
          if (Object.hasOwnProperty.call(fields, key)) {
            const element = fields[key]
            if (key === 'Dimension') {
              element.fields.forEach(field => {
                DimensionKey.push(field.displayColumn)
              })
            } else if (key === 'Measure') {
              element.fields.forEach(field => {
                MeasureKey.push(field.displayColumn)
              })
            }
          }
        }

        const dataValueTemp = data.map(item => {
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              if (DimensionKey.indexOf(key) > -1) {
                const temp = item[key]
                delete item[key]
                item.name = temp
              }
              if (MeasureKey.indexOf(key) > -1) {
                const temp = item[key]
                delete item[key]
                item.value = temp
              }
            }
          }
          return item
        })
        let sum = 0
        dataValueTemp.forEach((item) => {
          sum += item.value
        })
        const dataValue = dataValueTemp.map(item => {
          item.percent = Number((item.value / sum * 100).toFixed(2))
          return item
        })
        this.MeasureKey = MeasureKey + ''

        return dataValue
      }
    },
    getColor () {
      const color = []
      const colorValue = colorTheme[this.storeOption.theme.ComponentOption.Color.theme]
      this.dataValue.forEach((item, index) => {
        const idx = (index) % colorValue.length
        color.push({ name: item.name, color: colorValue[idx].value, remark: item.name })
      })

      this.storeOption.theme.ComponentOption.Color.color = color
    },
    getOption () {
      const { ComponentOption } = this.storeOption.theme
      // 是否显示标签
      const labelShow = ComponentOption.ChartLabel.check
      const checkList = ComponentOption.ChartLabel.checkList

      // 颜色
      const color = ComponentOption.Color.color

      // // 显示总计
      const totalShow = ComponentOption.TotalShow.show
      if (totalShow) {
        // 获取数据
        let sum = 0
        for (let i = 1; i < this.dataValue.length; i++) {
          sum += this.dataValue[i].value
        }
        ComponentOption.TotalShow.value = sum
      }

      this.dataValue = this.dataValue && this.dataValue.map((item) => {
        color.forEach(j => {
          if (item.name === j.name) {
            item.itemStyle = {
              color: j.color
            }
          }
        })
        return item
      })
      this.chartOption = {
        tooltip: {
          show: true,
          nodeClick: false,
          roam: false,
          trigger: 'item',
          formatter: function (data) {
            if (labelShow) {
              let tip = ''
              if (checkList.includes('百分比') && checkList.includes('度量')) {
                tip = data.name + '\n' + data.data.value + '(' + data.data.percent + '%' + ')'
              } else if (checkList.includes('百分比') && !checkList.includes('度量')) {
                tip = data.name + '\n' + data.data.percent + '%'
              } else if (!checkList.includes('百分比') && checkList.includes('度量')) {
                tip = data.name + '\n' + data.data.value
              } else if (!checkList.includes('百分比') && !checkList.includes('度量')) {
                tip = data.name
              }
              return tip
            } else {
              return data.name
            }
          }
        },
        label: {
          show: labelShow,
          formatter: function (data) {
            if (labelShow) {
              let tip = ''
              if (checkList.includes('百分比') && checkList.includes('度量')) {
                tip = data.name + '\n' + data.data.value + '(' + data.data.percent + '%' + ')'
              } else if (checkList.includes('百分比') && !checkList.includes('度量')) {
                tip = data.name + '\n' + data.data.percent + '%'
              } else if (!checkList.includes('百分比') && checkList.includes('度量')) {
                tip = data.name + '\n' + data.data.value
              } else if (!checkList.includes('百分比') && !checkList.includes('度量')) {
                tip = data.name
              }
              return tip
            } else {
              return data.name
            }
          }
        },
        series: [
          {
            name: this.MeasureKey, // 度量的值
            type: 'treemap',
            data: this.dataValue
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
