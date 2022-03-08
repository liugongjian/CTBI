<template>
  <div
    ref="drawLine"
    style="width:600px;height:400px;"
  />
</template>
<script>
export default {
  name: 'DoughnutChart',
  props: {
    pieData: {
      type: Object,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {

    }
  },
  watch: {
    pieData () {
      this.drawLine()
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(this.$refs.drawLine)
      // 绘制图表
      myChart.setOption({
        // 提示
        tooltip: {
          trigger: 'item',
          //  a（系列名称），b（数据项名称），c（数值）, d（饼图：百分比 |
          // b-series里data的name，c-data的value,d-占据位置百分比
          formatter: '{b} : {c} ({d}%)',
          // 是否把tooltip限制在图表的区域内
          confine: true
        },
        // 图例
        legend: {
          orient: 'vertical',
          x: 'left',
          // 图例的名字需要和饼图的name一致，才会显示图例
          data: ['A', 'B', 'C', 'D', 'E'],
          itemWidth: 50, // 图例标记的图形宽度
          itemHeight: 20 // 图例标记的图形高度
        },
        series: [
          {
            // 设为饼图
            type: 'pie',
            // 设置内外环半径,两者差值越大，环越粗
            radius: ['50%', '70%'],
            // 移入图形是否放大
            animationType: 'scale',
            // 用来控制是否由 ECharts 调整标签位置以实现防止标签重叠
            avoidLabelOverlap: false,
            // 对应效果图中的中间内容显示与否以及设置样式
            label: {
              // 默认用扇形颜色显示数据的 name
              show: false,
              position: 'center'
            },
            labelLine: {
              // label线不显示
              show: false
            },
            //  高亮样式即鼠标移入时效果
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            data: [
              {
                value: 335,
                name: 'A',
                itemStyle: {
                  color: {
                    // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，
                    // 如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    // 定义开始结束颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: '#ff0000' // 0% 处的颜色
                      },
                      {
                        offset: 0.5,
                        color: '#ff6666' // 50% 处的颜色
                      },
                      {
                        offset: 0.7,
                        color: '#ffb3b3' // 70% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#ffe5e5' // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              {
                value: 310,
                name: 'B',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    // 定义开始结束颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: '#ff6600' // 0% 处的颜色
                      },
                      {
                        offset: 0.5,
                        color: '#ff944d' // 50% 处的颜色
                      },
                      {
                        offset: 0.7,
                        color: '#ffb380' // 70% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#fff0e5' // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              {
                value: 234,
                name: 'C',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    // 定义开始结束颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: '#ffff00' // 0% 处的颜色
                      },
                      {
                        offset: 0.5,
                        color: '#ffff66' // 50% 处的颜色
                      },
                      {
                        offset: 0.7,
                        color: '#ffffb3' // 70% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#ffffe5' // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              {
                value: 135,
                name: 'D',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0, // 左上角x
                    y: 0, // 左上角y
                    x2: 0, // 右下角x
                    y2: 1, // 右下角y
                    // 定义开始结束颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: '#79ff4d' // 0% 处的颜色
                      },
                      {
                        offset: 0.5,
                        color: '#9fff80' // 50% 处的颜色
                      },
                      {
                        offset: 0.7,
                        color: '#c6ffb3' // 70% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#ecffe5' // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              {
                value: 1548,
                name: 'E',
                itemStyle: {
                  color: {
                    // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，
                    // 如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 0,
                    y2: 0,
                    // 定义开始结束颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: '#39ac39' // 0% 处的颜色
                      },
                      {
                        offset: 0.5,
                        color: '#66cc66' // 50% 处的颜色
                      },
                      {
                        offset: 0.7,
                        color: '#9fdf9f' // 70% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#c6ecc6' // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              }
            ]
          }
        ]
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

