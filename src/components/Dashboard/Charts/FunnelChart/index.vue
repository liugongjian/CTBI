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
import baseMixins from '../../mixins/baseMixins'
export default {
  name: 'FunnelChart',
  mixins: [baseMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // tmp数据用于存放临时数据，以方便切换漏斗显示和转化显示的重置操作
      rectangle: false, // 自定义属性，用于切换矩形
      storeOption: {},
      chartOption: {},
      sort: 'none',
      minSize: '10%',
      left: '10%',
      width: '60%',
      height: '60%',
      labelHeight: '80%',
      labelFormatter: '{c}%',
      tooltipFormatter: '',
      labelPos: '6%',
      dataValue: [],
      dataValueTmp: {},
      dataValueTrans: [], // 转化分析的数据
      dataValueTransTmp: {}, // 存放转化分析，转化好的数据
      transTmpData: [], // 数据处理需要，非 series 数据
      calcData: [],
      lastData: [],
      firstData: [],
      isTrans: false,
      calcDataTmp: {},
      seriesData: [],
      labelData: [], // 存放转化分析的 label 数据
      transDataLabel: {} // 存放转化分析数据的顶部对齐 label 数据，取数据中的最大值max + max/4 作为天花板
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        // if (JSON.stringify(val.dataSource) !== '{}') {
        //   this.dataValue = val.dataSource
        // }
        this.getOption()
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    reloadImpl () {
      this.formatDataValue(this.chartData)
      this.getOption()
    },
    formatDataValue (chartData) {
      const data = []
      const dataTrans = []
      const dataLabel = []
      const key = chartData.fields.Measure.fields[0].column
      chartData.data.forEach(item => {
        data.push({
          'name': item.type,
          'value': item[key],
          'isTrans': false
        })
      })
      chartData.data.forEach((item, index) => {
        dataTrans.push({
          'name': item.type,
          'value': item[key],
          'isTransCol': false,
          'tooltip': {
            show: true
          }
        })
        if (index !== chartData.data.length - 1) {
          dataTrans.push({
            'name': item.type,
            'value': item[key],
            'isTransCol': true,
            'label': {
              show: false
            },
            'tooltip': {
              show: false,
              trigger: 'none'
            }
          })
        } else {
          dataTrans.push({
            'name': item.type,
            'value': item[key],
            'isTransCol': true,
            'label': {
              show: false
            },
            'itemStyle': {
              opacity: 0
            },
            'tooltip': {
              show: false,
              trigger: 'none'
            }
          })
        }
      })
      this.dataValue = data
      this.dataValueTmp = {
        name: '漏斗图',
        type: 'funnel',
        gap: 2,
        left: this.left,
        minSize: this.minSize,
        orient: 'vertical',
        height: this.height,
        sort: this.sort,
        width: this.width,
        rectangle: this.rectangle, // 自定义属性用于切换 矩形
        label: {
          show: true,
          position: 'outside',
          formatter: function(params) {
            return params.name || '未命名'
          }
        },
        labelLayout: {
          x: this.labelPos
        },
        itemStyle: {
          show: true,
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: this.dataValue
      }
      this.transTmpData = data
      this.dataValueTrans = dataTrans
      this.dataValueTransTmp = {
        name: '漏斗图-转化分析',
        type: 'funnel',
        left: '20%',
        minSize: this.minSize,
        sort: 'none',
        width: this.width,
        height: this.height,
        top: '',
        zLevel: 2,
        orient: 'horizontal',
        funnelAlign: 'bottom',
        label: {
          show: false
        },
        itemStyle: {
          color: function(params) {
            if (params.data.isTransCol) {
              // 置灰
              return 'rgb(240, 241, 244)'
            } else {
              var col = 'rgb('
              for (var i = 0; i < 3; i++) { col += parseInt(Math.random() * 256) + ',' }
              col = col.substring(0, col.length - 1) + ')'
              return col
            }
          }
        },
        data: this.dataValueTrans
      }
      chartData.data.forEach((item, index) => {
        dataLabel.push({
          'name': item.type,
          'value': 0,
          'visiableVal': item[key],
          'isTransCol': false,
          'label': {
            show: true,
            color: 'black'
          }
        })
        if (index !== chartData.data.length - 1) {
          dataLabel.push({
            'name': item.type,
            'value': 0,
            'visiableVal': item[key],
            'isTransCol': true,
            'label': {
              show: false
            }
          })
        } else {
          dataLabel.push({
            'name': item.type,
            'value': 0,
            'visiableVal': item[key],
            'isFinal': true,
            'label': {
              show: false
            },
            'itemStyle': {
              opacity: 0
            }
          })
        }
      })
      this.labelData = dataLabel
      // 计算 transDataLabel
      this.transDataLabel = {
        type: 'funnel',
        left: '20%',
        minSize: this.minSize,
        sort: 'none',
        width: this.width,
        height: '0%',
        orient: 'horizontal',
        funnelAlign: 'bottom',
        zLevel: 1,
        top: '',
        tooltip: {
          show: false
        },
        label: {
          color: 'balck',
          position: 'leftTop',
          formatter: function(params) {
            return params.name ? params.name + '\n' + params.data.visiableVal : '未命名' + '\n' + params.data.visiableVal
          }
        },
        labelLayout: function(params) {
          return {
            y: params.rect.height + 40
          }
        },
        itemStyle: {
          color: 'rgba(240, 241, 244, 1)'
        },
        data: this.labelData
      }
    },
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.displayStyleHandler(this.storeOption.theme.ComponentOption.DisplayStyle)
      this.dataTransformer()
      const that = this
      if (this.storeOption.theme?.Basic?.VisualStyle.VisualStyle === 'funnel-horizontal') {
        // 直接去掉series里的数据
        this.isTrans = true
        this.seriesData = [this.dataValueTransTmp, this.transDataLabel]
      } else {
        this.isTrans = false
        this.seriesData = [this.dataValueTmp, this.calcDataTmp]
      }
      this.chartOption = {
        animation: false,
        legend: {
          ...componentOption.Legend,
          formatter: function(name) {
            return name || '未命名'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            // 转化分析中lastData，firstData数据没有对齐
            // 转化分析隔开 tooltip
            const index = that.storeOption.theme?.Basic?.VisualStyle.VisualStyle === 'funnel-horizontal' && (index / 2).toString().indexOf('.') < 0 ? (params.dataIndex / 2) : params.dataIndex
            const firstline = that.lastData[index]['name'] ? that.lastData[index]['name'] + ' : ' + that.dataValue[index]['value'] : '未命名' + ' : ' + that.dataValue[index]['value']
            const secondline = '占上一层的百分比 : ' + that.lastData[index]['value'] + '%'
            const thirdline = '占第一层的百分比 : ' + that.firstData[index]['value'] + '%'
            const tip = firstline + '<br/>' + secondline + '<br/>' + thirdline
            return tip
          }
        },
        series: this.seriesData
      }
    },
    // 静态样式初始化
    displayStyleHandler (item) {
      // 默认情况下，无序、梯形
      this.rectangle = false // 重置，默认梯形
      if (item.default) {
        this.sort = 'none'
        this.minSize = '10%'
      } else if (item.trapezoid) {
        // 梯形, 顺序从大到小
        this.sort = 'descending'
        this.minSize = '10%'
      } else if (item.rectangle) {
        // 矩形，似乎需要修改源码
        this.rectangle = true
      }
      // 显示类别标签的位置
      if (item.labelPos) {
        if (item.labelPos === 'left') {
          this.left = '30%'
          this.labelPos = '6%'
        } else if (item.labelPos === 'right') {
          this.left = '10%'
          this.labelPos = '90%'
        }
      }
      // 转化率的计算方式
      if (item.calcMethod) {
        this.calcData = []
        const tmp = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
        if (item.calcMethod === 'last') {
          // 占上一层的百分比
          for (let i = 1; i < tmp.length; i++) {
            tmp[i]['value'] = (this.transTmpData[i]['value'] / this.transTmpData[i - 1]['value']).toFixed(3) * 100
          }
          tmp[0]['value'] = 100
        } else if (item.calcMethod === 'first') {
          // 占第一层的百分比
          tmp.map((item, index) => {
            tmp[index].value = ((item.value / tmp[0]['value'])).toFixed(3) * 100
          })
        }
        this.calcData = tmp
        this.calcDataTmp = {
          name: 'Actual',
          type: 'funnel',
          left: '58%',
          height: this.height,
          // height: '30%',
          minSize: this.minSize,
          orient: 'vertical',
          sort: this.sort,
          rectangle: this.rectangle, // 自定义属性用于切换 矩形
          width: '5%',
          label: {
            position: 'inside',
            formatter: this.labelFormatter,
            color: '#fff'
          },
          itemStyle: {
            show: true,
            opacity: 1,
            color: 'rgba(255,111, 255, 0)',
            borderWidth: 0
          },
          data: this.calcData,
          z: 100
        }
      }
      // 显示数据标签的形式
      if (item.dataLabel) {
        const tmpPercent = JSON.parse(JSON.stringify(this.calcData)) // 深克隆，防止数据相互影响
        const tmpValue = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
        if (item.dataLabel === 'conversion') {
          // 转化率
          this.calcData = tmpPercent
          this.labelFormatter = '{c}%'
        } else if (item.dataLabel === 'metric') {
          // 度量值
          this.calcData = tmpValue
          this.labelFormatter = '{c}'
        } else if (item.dataLabel === 'coMe') {
          // 转化率加度量值
          for (let i = 0; i < tmpPercent.length; i++) {
            this.calcData[i]['value'] = tmpValue[i]['value'] + ' (' + tmpPercent[i]['value'] + '%)'
          }
          this.labelFormatter = '{c}'
        }
      }
      // 底部梯形 or 三角形
      this.minSize = item.triangle === 'true' ? '0' : '10%'
    },
    dataTransformer () {
      // 构建出 lastData\firstData 多个series叠加
      const tmpLast = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
      const tmpFirst = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
      // 占上一层的百分比
      for (let i = 1; i < tmpLast.length; i++) {
        tmpLast[i]['value'] = (this.transTmpData[i]['value'] / this.transTmpData[i - 1]['value']).toFixed(3) * 100
      }
      tmpLast[0]['value'] = 100
      this.lastData = tmpLast
      // 占第一层的百分比
      tmpFirst.map((item, index) => {
        tmpFirst[index].value = ((item.value / tmpFirst[0]['value'])).toFixed(3) * 100
      })
      this.firstData = tmpFirst
    }
  }
}
</script>

<style>
</style>
