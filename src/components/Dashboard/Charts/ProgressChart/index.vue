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
import progressMixins from '@/components/Dashboard/mixins/progressMixins'
export default {
  name: 'ProgressChart',
  mixins: [progressMixins],
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
      dataValue: [20, 40, 60, 45]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          this.getOption()
        }
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
      const myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6']
      this.chartOption = {
        legend: componentOption.Legend,
        grid: {
          left: '30',
          top: '15',
          right: '60',
          bottom: '15',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: { show: false }, // 坐标轴在 grid 区域中的分隔线
          axisLabel: { show: false }, // 坐标轴刻度标签
          axisTick: { show: false }, // 坐标轴刻度
          axisLine: { show: false } // 坐标轴轴线
        },
        yAxis: {
          type: 'category',
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            color: 'rgba(0,0,0,.7)',
            fontSize: 10
          },
          data: ['a', 's', 'd', 'f']
        },
        series: [// 系列列表。每个系列通过 type 决定自己的图表类型
          {
            name: '项目', // 系列名称
            type: 'bar', // 柱状、条形图
            barWidth: 19, // 柱条的宽度,默认自适应
            data: this.dataValue, // 系列中数据内容数组
            label: { // 图形上的文本标签
              show: true,
              position: 'right', // 标签的位置
              offset: [10, 2], // 标签文字的偏移，此处表示向上偏移40
              formatter: '{c}%', // 标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
              color: 'rgba(0,0,0,.7)', // 标签字体颜色
              fontSize: 16 // 标签字号
            },
            itemStyle: {
              normal: {
                barBorderRadius: 10, // 柱条圆角半径,单位px.
                color: function (params) {
                  const num = myColor.length// 得到myColor颜色数组的长度
                  return myColor[params.dataIndex % num]// 返回颜色数组中的一个对应的颜色值
                }
              }
            },
            zlevel: 1// 柱状图所有图形的 zlevel 值,
          },
          {
            name: '进度条背景',
            type: 'bar',
            label: { // 图形上的文本标签
              show: true,
              position: 'right', // 标签的位置
              offset: [0, 0],
              // formatter: '{c}{a}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
              color: 'rgba(0,0,0,.7)', // 标签字体颜色
              fontSize: 12 // 标签字号
            },
            barGap: '-100%',
            barWidth: 19,
            data: [100, 100, 100, 100, 100],
            color: 'rgba(0,0,0,.2)', // 柱条颜色
            itemStyle: {
              normal: {
                barBorderRadius: 10
              }
            }
          }

        ]
      }
    }
  }
}
</script>

<style>
</style>
