<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
export default {
  name: 'FunnelChart',
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
      sort: 'none',
      minSize: '10%',
      left: '10%',
      width: '60%',
      height: '80%',
      formatter: '{c}%',
      labelPos: '6%',
      dataValue: [{ value: 60, name: 'Visit' },
        { value: 40, name: 'Inquiry' },
        { value: 20, name: 'Order' },
        { value: 80, name: 'Click' },
        { value: 100, name: 'Show' }],
      transTmpData: [{ value: 60, name: 'Visit' },
        { value: 40, name: 'Inquiry' },
        { value: 20, name: 'Order' },
        { value: 80, name: 'Click' },
        { value: 100, name: 'Show' }],
      calcData: []
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        console.log('狗子你变了', val)
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
        }
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
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.displayStyleHandler(this.storeOption.theme.ComponentOption.DisplayStyle)
      this.chartOption = {
        animation: false,
        legend: componentOption.Legend,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            gap: 2,
            left: this.left,
            minSize: this.minSize,
            sort: this.sort,
            width: this.width,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            labelLayout: {
              x: this.labelPos
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: this.dataValue
          },
          {
            name: 'Actual',
            type: 'funnel',
            left: this.left,
            minSize: this.minSize,
            sort: this.sort,
            width: this.width,
            label: {
              position: 'inside',
              formatter: this.formatter,
              color: '#fff'
            },
            itemStyle: {
              opacity: 0.5,
              color: 'rgba(255, 255, 255, 0)',
              borderWidth: 0
            },
            emphasis: {
              label: {
                position: 'inside',
                formatter: '{b}: {c}%'
              }
            },
            data: this.calcData,
            // Ensure outer shape will not be over inner shape when hover.
            z: 100
          }
        ]
      }
      console.log('wanle')
    },
    displayStyleHandler (item) {
      // 默认情况下，无序、梯形
      if (item.default) {
        this.sort = 'none'
        this.minSize = '10%'
      } else if (item.trapezoid) {
        // 梯形, 顺序从大到小
        this.sort = 'descending'
        this.minSize = '10%'
      } else if (item.rectangle) {
        // 矩形，似乎需要修改源码
        alert('暂时没有矩形哦')
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
      }
      // 显示数据标签的形式
      if (item.dataLabel) {
        const tmpPercent = JSON.parse(JSON.stringify(this.calcData)) // 深克隆，防止数据相互影响
        const tmpValue = JSON.parse(JSON.stringify(this.transTmpData)) // 深克隆，防止数据相互影响
        if (item.dataLabel === 'conversion') {
          // 转化率
          this.calcData = tmpPercent
          this.formatter = '{c}%'
        } else if (item.dataLabel === 'metric') {
          // 度量值
          this.calcData = tmpValue
          this.formatter = '{c}'
        } else if (item.dataLabel === 'coMe') {
          // 转化率加度量值
          for (let i = 0; i < tmpPercent.length; i++) {
            this.calcData[i]['value'] = tmpValue[i]['value'] + ' (' + tmpPercent[i]['value'] + '%)'
          }
          this.formatter = '{c}'
        }
      }
    }
  }
}
</script>

<style>
</style>
