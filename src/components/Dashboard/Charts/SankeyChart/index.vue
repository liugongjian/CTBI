<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
      :update-options="{notMerge:true}"
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { deepClone, getDataValueById, getLayoutOptionById } from '@/utils/optionUtils'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import store from '@/store'

export default {
  name: 'SankeyChart',
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
      dataOption: [],
      chartData: {}
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (this.dataValue) {
          this.dataValue = this.formatDataValue(deepClone(getDataValueById(this.identify)))
        }
        this.getOption()
      },
      deep: true
    },
    dataOption: {
      handler (val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = this.formatDataValue(deepClone(getDataValueById(this.identify)))
          this.getOption()
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
    reloadImpl () {
      this.dataValue = this.formatDataValue(deepClone(this.chartData))
      this.getOption()
    },
    formatDataValue(chartData) {
      const dataValue = []
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
        dataValue.push([DimensionKey.join('-'), ...MeasureKey])
        data.forEach(item => {
          const dimensionData = []
          const measureData = []
          DimensionKey.forEach(dim => {
            dimensionData.push(item[dim])
          })
          MeasureKey.forEach(mea => {
            measureData.push(item[mea])
          })
          dataValue.push([dimensionData.join('-'), ...measureData])
        })
      }

      let tempData1 = []
      const tempLinks = []
      dataValue.forEach((item, index) => {
        if (index > 0) {
          tempData1.push(item[0])
          const item0Temp = (item[0] + '-' + item[1]).split('-')
          item0Temp.forEach((j, idx) => {
            if (idx < item0Temp.length - 2) {
              tempLinks.push({ source: item0Temp[idx], target: item0Temp[idx + 1], value: item0Temp[item0Temp.length - 1] })
            }
          })
        }
      })
      tempData1 = tempData1.join('-').split('-')
      const tempData2 = []
      tempData1.forEach((item, index) => {
        tempData2.push({ name: item })
      })

      // tempData去重
      var obj = {}
      const tempData = tempData2.reduce(function (item, next) {
        obj[next.name] ? '' : obj[next.name] = true && item.push(next)
        return item
      }, [])

      // 判断tempLinks 中有没有 source和target一样的 若一样 则抛出警告
      let flag = true
      tempLinks.forEach((item) => {
        if (item.source === item.target) {
          flag = false
          return
        }
      })

      if (!flag) {
        this.$message({
          message: '维度之间存在一样的value, 请重新选择维度! ',
          type: 'warning'
        })
      } else {
        return { tempData, tempLinks }
      }
    },
    getOption () {
      const { ComponentOption } = this.storeOption.theme
      const color = ComponentOption.SankeyLine.lineColor
      const curveness = ComponentOption.SankeyLine.lineType
      const opacity = ComponentOption.SankeyLine.lineOpacity / 100
      this.chartOption = {
        series: {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency'
          },
          data: this.dataValue && this.dataValue.tempData,
          links: this.dataValue && this.dataValue.tempLinks,
          lineStyle: {
            color: color === 2 ? 'source' : '',
            opacity,
            curveness: curveness === 1 ? 0.5 : 0 // 0.5曲线
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
