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
// import { deepClone, getLayoutOptionById } from '@/utils/optionUtils'
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
    // this.reloadImpl1()
  },
  methods: {
    reloadImpl () {
      console.log('dakdakdka', this.chartData)
      // this.chartData = {
      //   data: [
      //     {
      //       'name': '胡一苗',
      //       'remark': '这是胡一苗remark',
      //       'rule': '这是胡一苗rule',
      //       'id_count': '1.00'
      //     },
      //     {
      //       'name': '胡二苗',
      //       'remark': '这是胡二苗remark',
      //       'rule': '这是胡二苗rule',
      //       'id_count': '2.00'
      //     },
      //     {
      //       'name': '胡三苗',
      //       'remark': '这是胡三苗remark',
      //       'rule': '这是胡三苗rule',
      //       'id_count': '3.00'
      //     },
      //     {
      //       'name': '胡四苗',
      //       'remark': '这是胡四苗remark',
      //       'rule': '这是胡四苗rule',
      //       'id_count': '4.00'
      //     },
      //     {
      //       'name': '胡五苗',
      //       'remark': '这是胡五苗remark',
      //       'rule': '这是胡五苗rule',
      //       'id_count': '5.00'
      //     },
      //     {
      //       'name': '胡六苗',
      //       'remark': '这是胡六苗remark',
      //       'rule': '这是胡六苗rule',
      //       'id_count': '6.00'
      //     }
      //   ],
      //   columns: [
      //     {
      //       'name': 'name'
      //     },
      //     {
      //       'name': 'remark'
      //     },
      //     {
      //       'name': 'rule'
      //     },
      //     {
      //       'name': 'id_count'
      //     }
      //   ],
      //   fields: {
      //     'Dimension': {
      //       'name': '类别轴/维度',
      //       'fields': [
      //         {
      //           'type': 'Dimension',
      //           'column': 'name',
      //           'attributes': [
      //             {
      //               'isHidden': false,
      //               'displayColumn': 'name',
      //               'comment': 'name',
      //               'dataType': 'text',
      //               '_id': '1r7dCsNpjrFys'
      //             }
      //           ],
      //           'displayColumn': 'name',
      //           '_id': 'NKImPkOubUoXe',
      //           'dataSetID': 'KZLeXW6yJs72e'
      //         },
      //         {
      //           'type': 'Dimension',
      //           'column': 'remark',
      //           'attributes': [
      //             {
      //               'isHidden': false,
      //               'displayColumn': 'remark',
      //               'comment': 'remark',
      //               'dataType': 'text',
      //               '_id': '1r7dCsNpjrFys'
      //             }
      //           ],
      //           'displayColumn': 'remark',
      //           '_id': 'NKImPkOubUoXe',
      //           'dataSetID': 'KZLeXW6yJs72e'
      //         },
      //         {
      //           'type': 'Dimension',
      //           'column': 'rule',
      //           'attributes': [
      //             {
      //               'isHidden': false,
      //               'displayColumn': 'rule',
      //               'comment': 'rule',
      //               'dataType': 'text',
      //               '_id': '1r7dCsNpjrFys'
      //             }
      //           ],
      //           'displayColumn': 'rule',
      //           '_id': 'NKImPkOubUoXe',
      //           'dataSetID': 'KZLeXW6yJs72e'
      //         }
      //       ]
      //     },
      //     'Measure': {
      //       'name': '值轴/度量',
      //       'fields': [
      //         {
      //           'type': 'Measure',
      //           'column': 'id_count',
      //           'attributes': [
      //             {
      //               'isHidden': false,
      //               'displayColumn': 'id_count',
      //               'comment': 'id_count',
      //               'dataType': 'number',
      //               '_id': 'EDLBMblf43lcB'
      //             }
      //           ],
      //           'displayColumn': 'id_count',
      //           '_id': 'VdNUjAgSNl65A',
      //           'dataSetID': 'KZLeXW6yJs72e'
      //         }
      //       ]
      //     }
      //   }

      // }
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
      const tempData = []
      tempData1.forEach((item, index) => {
        tempData.push({ name: item })
      })

      return { tempData, tempLinks }
    },
    getOption () {
      console.log('dadawwww', this.dataValue)
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
