<template>
  <div class="self-chart-content">
    <v-chart
      v-if="dataValue && dataValue.length > 0"
      :option="chartOption"
      :update-options="{notMerge:true}"
      digit="2"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-funnel"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
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
      // 转化分析横向、纵向切换时，属性变化
      transStyle: 'horizontal',
      borderRadius: [0, 20, 20, 0],
      transDataLabelVertical: {},
      dataValueTransTmpVertical: {},
      // // tmp数据用于存放临时数据，以方便切换漏斗显示和转化显示的重置操作
      rectangle: false, // 自定义属性，用于切换矩形
      storeOption: {},
      chartOption: {},
      sort: 'none',
      minSize: '10%',
      left: '10%',
      insideLeft: '58%',
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
        if (val.dataSource.Dimension.value.length === 0 || val.dataSource.Measure.value.length === 0) return
        // this.reloadImpl()
        this.getOption()
      },
      deep: true
    }
  },
  methods: {
    reloadImpl () {
      if (this.chartData.data.length === 0) return
      this.formatDataValue(this.chartData)
      this.getOption()
    },
    formatDataValue (chartData) {
      const data = []
      const dataTrans = []
      const dataLabel = []
      const measureName = chartData.fields.Measure.fields[0].displayColumn
      const dimensionName = chartData.fields.Dimension.fields[0].displayColumn
      const that = this
      // 标准数据渲染
      chartData.data.forEach(item => {
        data.push({
          // 'name': item.type,
          'name': item[dimensionName],
          'value': Number(item[measureName]),
          'isTrans': false
        })
      })
      // 转化分析数据渲染
      chartData.data.forEach((item, index) => {
        dataTrans.push({
          'name': item[dimensionName],
          'value': Number(item[measureName]),
          'label': {
            show: true,
            backgroundColor: '#ffffff',
            padding: [1, 15, 1, 15],
            color: 'black',
            borderRadius: that.borderRadius,
            formatter: function (params) {
              const index = params.dataIndex / 2
              if (index === 0) return null
              return (index).toString().indexOf('.') < 0 ? that.lastData[index].value : ''
            }
          },

          'labelLine': {
            length: -20
          },
          'isTransCol': false,
          'tooltip': {
            show: true
          }
        })
        if (index === 0) {
          dataTrans[0].label = {
            show: false
          }
        }
        if (index !== chartData.data.length - 1) {
          dataTrans.push({
            'name': item[dimensionName],
            'value': Number(item[measureName]),
            'isTransCol': true,
            'tooltip': {
              show: false,
              trigger: 'none'
            },
            'emphasis': { itemStyle: { color: 'rgba(240, 241, 244, 1)' } }
          })
        } else {
          dataTrans.push({
            'name': item[dimensionName],
            'value': Number(item[measureName]),
            'isTransCol': true,
            'itemStyle': {
              opacity: 0
            },
            'tooltip': {
              show: false,
              trigger: 'none'
            },
            'emphasis': { itemStyle: { color: 'rgba(240, 241, 244, 1)' } }
          })
        }
      })
      that.dataValue = data
      that.dataValueTmp = {
        name: '漏斗图',
        type: 'funnel',
        gap: 2,
        left: that.left,
        minSize: that.minSize,
        orient: 'vertical',
        height: that.height,
        sort: that.sort,
        width: that.width,
        rectangle: that.rectangle, // 自定义属性用于切换 矩形
        label: {
          show: true,
          position: 'outside',
          formatter: function (params) {
            return params.name || '未命名'
          }
        },
        labelLayout: {
          x: that.labelPos
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
        data: that.dataValue
      }
      that.transTmpData = data
      that.dataValueTrans = dataTrans
      // 横向
      that.dataValueTransTmp = {
        name: '漏斗图-转化分析',
        type: 'funnel',
        left: '20%',
        minSize: that.minSize,
        sort: 'none',
        width: that.width,
        height: that.height,
        top: '',
        zLevel: 2,
        orient: 'horizontal',
        funnelAlign: 'bottom',
        label: {
          show: true,
          backgroundColor: 'rgba(0,23,11,0.5)'
        },
        labelLine: {
          show: false,
          length: -20
        },
        labelLayout: function (params) {
          return {
            x: params.rect.x // 控制白色半圆数据框
          }
        },
        itemStyle: {
          color: function (params) {
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
        data: that.dataValueTrans
      }
      // 纵向
      that.dataValueTransTmpVertical = {
        name: '漏斗图-转化分析',
        type: 'funnel',
        left: '20%',
        minSize: that.minSize,
        sort: 'none',
        width: that.width,
        height: that.height,
        top: '10%',
        zLevel: 2,
        orient: 'vertical',
        funnelAlign: 'left',
        label: {
          show: true,
          position: 'left',
          backgroundColor: 'rgba(0,23,11,0.5)'
        },
        labelLayout: function (p) {
          return {
            x: '30%'
          }
        },
        labelLine: {
          show: false
        },
        itemStyle: {
          color: function (params) {
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
        data: that.dataValueTrans
      }
      chartData.data.forEach((item, index) => {
        dataLabel.push({
          'name': item[dimensionName],
          'value': 0,
          'visiableVal': item[measureName],
          'isTransCol': false,
          'label': {
            show: true,
            color: 'black'
          }
        })
        if (index !== chartData.data.length - 1) {
          dataLabel.push({
            'name': item[dimensionName],
            'value': 0,
            'visiableVal': item[measureName],
            'isTransCol': true,
            'label': {
              show: false
            },
            'emphasis': { itemStyle: { color: 'rgba(240, 241, 244, 1)' } }
          })
        } else {
          dataLabel.push({
            'name': item[dimensionName],
            'value': 0,
            'visiableVal': item[measureName],
            'isFinal': true,
            'label': {
              show: false
            },
            'itemStyle': {
              opacity: 0
            },
            'emphasis': { itemStyle: { color: 'rgba(240, 241, 244, 1)' } }
          })
        }
      })
      that.labelData = dataLabel
      // 计算 transDataLabel
      that.transDataLabel = {
        type: 'funnel',
        left: '20%',
        minSize: that.minSize,
        sort: 'none',
        width: that.width,
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
          formatter: function (params) {
            return params.name ? params.name + '\n' + params.data.visiableVal : '未命名' + '\n' + params.data.visiableVal
          }
        },
        labelLayout: function (params) {
          return {
            x: params.rect.x,
            y: params.rect.height + 40
          }
        },
        itemStyle: {
          color: 'rgba(240, 241, 244, 1)'
        },
        data: that.labelData
      }
      // 纵向
      that.transDataLabelVertical = {
        type: 'funnel',
        left: '20%',
        minSize: that.minSize,
        sort: 'none',
        width: '0%',
        height: that.height,
        orient: 'vertical',
        funnelAlign: 'left',
        zLevel: 1,
        top: '10%',
        tooltip: {
          show: false
        },
        label: {
          show: true,
          color: 'black',
          position: 'left',
          formatter: function (params) {
            return params.name ? params.name + '\n' + params.data.visiableVal : '未命名' + '\n' + params.data.visiableVal
          }
        },
        labelLayout: function (p) {
          return {
            x: '5%',
            y: p.rect.y + p.rect.height / 2
          }
        },
        itemStyle: {
          color: 'rgba(240, 241, 244, 1)'
        },
        data: that.labelData
      }
    },
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      if (this.dataValue.length > 0) {
        this.displayStyleHandler(this.storeOption.theme.ComponentOption.DisplayStyle)
        this.dataTransformer()
      }

      // 更新dataValueTmp
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
          formatter: function (params) {
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
      // 更新 calcDataTmp
      this.calcDataTmp = {
        name: 'Actual',
        type: 'funnel',
        left: this.insideLeft,
        height: this.height,
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
      const that = this
      this.seriesData = []
      if (this.storeOption.theme?.Basic?.VisualStyle.VisualStyle === 'funnel-horizontal') {
        // 直接去掉series里的数据
        this.isTrans = true
        if (this.transStyle === 'horizontal') {
          this.seriesData = [this.dataValueTransTmp, this.transDataLabel]
        } else if (this.transStyle === 'vertical') {
          this.seriesData = [this.dataValueTransTmpVertical, this.transDataLabelVertical]
        }
      } else {
        this.isTrans = false
        this.seriesData = [this.dataValueTmp, this.calcDataTmp]
      }
      const legendVertical = componentOption.Legend.show && componentOption.Legend.orient === 'vertical'
      const legendText = legendVertical ? { textStyle: {
        width: 60,
        overflow: 'breakAll'
      } } : {}
      this.chartOption = {
        animation: false,
        legend: {
          ...componentOption.Legend,
          ...legendText,
          formatter: function (name) {
            return name || '未命名'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            // 转化分析中lastData，firstData数据没有对齐
            // 转化分析隔开 tooltip
            const index = that.storeOption.theme?.Basic?.VisualStyle.VisualStyle === 'funnel-horizontal' && (index / 2).toString().indexOf('.') < 0 ? (params.dataIndex / 2) : params.dataIndex
            const firstline = that.lastData[index]['name'] ? that.lastData[index]['name'] + ' : ' + (that.dataValue[index]['value']).toFixed(3) : '未命名' + ' : ' + (that.dataValue[index]['value']).toFixed(3)
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
      if (item.horizontal) {
        this.transStyle = 'horizontal'
        this.borderRadius = [0, 20, 20, 0]
      } else if (item.vertical) {
        this.transStyle = 'vertical'
        this.borderRadius = [0, 0, 20, 20]
      }
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
      // 转化分析中，设置静态样式
      if (item.horizontal) {
        this.funnelAlign = 'bottom'
        this.orient = 'horizontal'
        this.labelPosition = 'leftTop'
      } else if (item.vertical) {
        this.funnelAlign = 'left'
        this.orient = 'vertical'
        this.labelPosition = 'left'
      }
      const componentOption = this.storeOption.theme.ComponentOption
      let legendX = ''
      if (componentOption.Legend.show && componentOption.Legend.orient === 'vertical') {
        legendX = componentOption.Legend.left
      }
      // 显示类别标签的位置
      if (item.labelPos) {
        if (item.labelPos === 'left') {
          this.left = '30%'
          this.insideLeft = '58%'
          this.labelPos = legendX === 'auto' ? 120 : '6%'
        } else if (item.labelPos === 'right') {
          this.left = legendX === 'auto' ? '12%' : '5%'
          this.insideLeft = legendX === 'auto' ? '39%' : '33%'
          this.labelPos = legendX === 'right' ? '80%' : '90%'
        }
      }
      // 底部梯形 or 三角形
      this.minSize = item.triangle === 'true' ? '0' : '10%'
      // 转化率的计算方式
      if (item.calcMethod) {
        this.calcData = []
        const tmp = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
        if (item.calcMethod === 'last') {
          // 占上一层的百分比
          for (let i = 1; i < tmp.length; i++) {
            tmp[i]['value'] = (this.transTmpData[i]['value'] / this.transTmpData[i - 1]['value']).toFixed(3) * 100
            tmp[i]['value'] = +(tmp[i]['value']).toFixed(3)
          }
          tmp[0]['value'] = 100
        } else if (item.calcMethod === 'first') {
          // 占第一层的百分比
          tmp.map((item, index) => {
            tmp[index].value = ((item.value / tmp[0]['value'])).toFixed(3) * 100
            tmp[index].value = +(tmp[index].value).toFixed(3)
          })
        }
        this.calcData = tmp
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
            this.calcData[i]['value'] = +(tmpValue[i]['value']).toFixed(3) + ' (' + (tmpPercent[i]['value']).toFixed(3) + '%)'
          }
          this.labelFormatter = '{c}'
        }
      }
    },
    dataTransformer () {
      // 构建出 lastData\firstData 多个series叠加
      const tmpLast = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
      const tmpFirst = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
      // 占上一层的百分比
      for (let i = 1; i < tmpLast.length; i++) {
        tmpLast[i]['value'] = (this.transTmpData[i]['value'] / this.transTmpData[i - 1]['value']).toFixed(3) * 100
        tmpLast[i]['value'] = +(tmpLast[i]['value']).toFixed(3)
      }
      tmpLast[0]['value'] = 100
      this.lastData = tmpLast
      // 占第一层的百分比
      tmpFirst.map((item, index) => {
        tmpFirst[index].value = ((item.value / tmpFirst[0]['value'])).toFixed(3) * 100
        tmpFirst[index].value = +(tmpFirst[index].value).toFixed(3)
      })
      this.firstData = tmpFirst
    }
  }
}
</script>

<style>
</style>
