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
      width: '60%',
      height: '60%',
      dataValue: [
        { value: 60, name: 'Visit' },
        { value: 40, name: 'Inquiry' },
        { value: 20, name: 'Order' },
        { value: 80, name: 'Click' },
        { value: 100, name: 'Show' }
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        console.log('狗子你变了')
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
      console.log('this.storeOption:   ', this.storeOption)
      this.displayStyleHandler(this.storeOption.theme.ComponentOption.DisplayStyle)
      this.chartOption = {
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
          }
        ]
      }
    },
    displayStyleHandler (item) {
      console.log('item:   ', item)
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
    }
  }
}
</script>

<style>
</style>
