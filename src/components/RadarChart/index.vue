<template>
  <div
    id="myChart"
    :style="{width: '400px', height: '400px'}"
  />
</template>

<script>
export default {
  name: 'MyChart',
  data () {
    return {
      colors: ['#6700D8', '#FF0034', '#56A3F1', '#FF917C']
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      var chartDom = document.getElementById('myChart')
      var myChart = this.$echarts.init(chartDom)
      // 绘制图表
      myChart.setOption({
        color: this.colors,
        legend: {},
        radar: [
          {
            indicator: [
              { text: 'Indicator1', max: 120 },
              { text: 'Indicator2', max: 10 },
              { text: 'Indicator3', max: 1 },
              { text: 'Indicator4', max: 100 },
              { text: 'Indicator5', max: 2000 },
              { text: 'Indicator6', max: 10 }
            ],
            radius: 120,
            axisName: {
              formatter: '{value}',
              color: '#333'
            },
            splitArea: {
              areaStyle: {
                color: ['#5ee7df', '#5ee7cf', '#5ee7bf', '#5ee7af', '#5ee79f'],
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(211, 253, 250, 0.8)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(211, 253, 250, 0.8)'
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            emphasis: {
              lineStyle: {
                width: 4
              }
            },
            data: [
              {
                value: [100, 8, 0.4, 50, 2000, 1],
                name: 'Data A'
              },
              {
                value: [60, 5, 0.3, 80, 500, 10],
                name: 'Data B'

              }
            ]
          }
        ]
      })
    }
  }
}
</script>
