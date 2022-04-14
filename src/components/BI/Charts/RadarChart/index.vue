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
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import radarMixins from '@/components/BI/mixins/radarMixins'
import store from '@/store'
export default {
  name: 'RadarChart',
  mixins: [radarMixins],
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
      dataValue: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: '分配预算',
          itemStyle: {
            normal: {
              color: '#FFE434',
              lineStyle: {
                color: '#FFE434'
              }
            }
          },
          areaStyle: {
            normal: {
              width: 1,
              opacity: 0
            }
          },
          label: {
            normal: {
              show: false,
              formatter: (params) => {
                return params.value
              }
            }
          }
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: '实际支出',
          itemStyle: {
            normal: {
              color: '#56A3F1',
              lineStyle: {
                color: '#56A3F1'
              }
            }
          },
          areaStyle: {
            normal: {
              width: 1,
              opacity: 0.5
            }
          },
          label: {
            normal: {
              show: false,
              formatter: (params) => {
                return params.value
              }
            }
          }
        }
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
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
    this.getInit()
  },
  methods: {
    getInit () {
      // 将雷达图中的颜色和数据 添加到 vuex中
      const temp = store.state.app.layout.find(item => {
        return item.i === this.identify
      })
      const newTemp = deepClone(temp)
      const color = []
      this.dataValue.forEach(item => {
        color.push({ name: item.name, color: item.itemStyle.normal.color })
      })
      newTemp.option.theme.ComponentOption.RadarColor.color = color
      store.dispatch('app/updateLayoutItem', { id: this.identify, item: newTemp })
    },
    // 面积填充
    setRadarConfig (areaStyle, labelShow) {
      this.dataValue.forEach((item, index) => {
        item.areaStyle.normal.opacity = areaStyle ? 0.5 : 0
        if (Number(labelShow) === 0) {
          item.label.normal.show = false
        } else if (Number(labelShow) === 1) {
          if (index === 0) {
            item.label.normal.show = true
          }
        } else {
          item.label.normal.show = true
        }
      })
    },
    // setColor (color) {
    //   this.dataValue.forEach(item => {
    //     const isName = color.find((data) => { data.name === item.name })
    //     if (isName) {
    //       console.log(isName)
    //       item.itemStyle.normal.color = isName.color
    //     }
    //   })
    // },
    getOption () {
      console.log('重新渲染')
      const { Legend, RadarChartShape, RadarLabel: { labelShow }, RadarColor: { areaStyle }, RadarCoordinates } =
      this.storeOption.theme.ComponentOption
      const { maxValue, minValue, autoMaxValue, autoMinValue, showCoordinates } = RadarCoordinates
      this.setRadarConfig(areaStyle, labelShow)
      // console.log(color, '颜色')
      // this.setColor(color)
      const shape = RadarChartShape.shape
      this.chartOption = {
        legend: Legend,
        radar: {
          indicator: [
            { name: '销售', max: autoMaxValue ? 6500 : (maxValue || 6500), min: autoMinValue ? 0 : minValue, axisLabel: { show: showCoordinates } },
            { name: '管理', max: 16000 },
            { name: '信息技术', max: 30000 },
            { name: '客服', max: 38000 },
            { name: '研发', max: 52000 },
            { name: '市场', max: 25000 }
          ],
          axisLabel: {
            // show: axisLabel,
            // show: RadarCoordinates.showCoordinates,
            color: '#333',
            showMinLabel: true
          },
          shape: shape,
          name: { // (圆外的标签)雷达图每个指示器名称的配置项。
            show: true,
            formatter: '{value}',
            textStyle: {
              fontSize: 10,
              color: '#333',
              padding: [-10, -12]
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: this.dataValue
            // data: [
            //   {
            //     value: [5000, 12000, 28888, 32020, 16000, 13000],
            //     name: '2018-07',
            //     // 设置区域边框和区域的颜色
            //     itemStyle: {
            //       normal: {
            //         color: 'rgba(255,225,0,.3)',
            //         lineStyle: {
            //           color: 'rgba(255,225,0,.3)'
            //         }
            //       }
            //     },
            //     // areaStyle: {
            //     //   color: 'rgba(255,225,0,.3)'
            //     // },
            //     // 在拐点处显示数值
            //     label: {
            //       normal: {
            //         show: false,
            //         formatter: (params) => {
            //           return params.value
            //         }
            //       }
            //     }
            //   },
            //   {
            //     value: [4400, 10000, 18888, 22020, 46000, 23000],
            //     name: '',
            //     itemStyle: {
            //       normal: {
            //         color: 'rgba(60,135,213,.3)',
            //         lineStyle: {
            //           width: 1,
            //           color: 'rgba(60,135,213,.3)'
            //         }
            //       }
            //     },
            //     // 在拐点处显示数值
            //     label: {
            //       normal: {
            //         show: false,
            //         formatter: (params) => {
            //           return params.value
            //         }
            //       }
            //     }
            //   }
            // ]
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
