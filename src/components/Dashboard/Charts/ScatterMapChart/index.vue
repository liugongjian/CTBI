<template>
  <div class="self-chart-content">
    <v-chart
      :option="chartOption"
      autoresize
    />
    <!-- <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <svg-icon
      v-else
      icon-class="chart-empty-scatter-map"
      class="chart-empty-svg"
    /> -->
  </div>
</template>

<script>
import mapMixins from '@/components/Dashboard/mixins/mapMixins'
export default {
  name: 'ScatterMapChart',
  mixins: [mapMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chartOption: {}
    }
  },
  mounted () {
    this.getOption()
  },
  methods: {
    getOption () {
      // const componentOption = this.storeOption.theme.ComponentOption
      this.chartOption = {
        title: {
          text: '',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.name + ' : ' + params.value[2]
          }
        },
        visualMap: {
          min: 0,
          max: 200,
          show: false,
          calculable: false,
          inRange: {
            color: ['#FFAC2E']
          },
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'china',
          layoutCenter: ['50%', '50%'],
          layoutSize: 630,
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#EBEDF0',
              borderColor: '#fff'
            },
            emphasis: {
              areaColor: '#ECF0F3'
            }
          },
          regions: [
            {
              name: '南海诸岛',
              value: 0,
              show: false,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  },
                  color: '#71D4E7'
                }
              }
            }
          ]
        },
        series: [
          {
            name: 'pm2.5',
            type: 'effectScatter',
            scaling: 1.7,
            // 该系列使用的坐标系
            coordinateSystem: 'geo',
            symbolSize: function (val) {
              return val[2] / 10
            },
            data: [
              { name: '合肥', value: [117.29, 32.0581, 134] },
              { name: '上海', value: [121.4648, 31.2891, 90] },
              { name: '北京', value: [116.4551, 40.2539, 210] },
              { name: '杭州', value: [119.5313, 29.8773, 30] },
              { name: '乌鲁木齐', value: [87.9236, 43.5883, 230] },
              { name: '长沙市', value: [113.0823, 28.2568, 21] },
              { name: '广州', value: [113.5107, 23.2196, 90] },
              { name: '南京', value: [118.8062, 31.9208, 55] },
              { name: '成都', value: [103.9526, 30.7617, 33] },
              { name: '武汉', value: [114.3896, 30.6628, 66] },
              { name: '中山', value: [113.4229, 22.478, 21] }
            ],
            // 配置何时显示特效'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
            showEffectOn: 'render',
            // 目前只有ripple这一种
            effectType: 'ripple',
            // 涟漪特效相关配置。
            rippleEffect: {
              // 动画的时间
              period: 4,
              // 动画中波纹的最大缩放比例
              scale: 4,
              // 波纹的绘制方式可选 'stroke' 和 'fill'
              brushType: 'stroke'
            },
            // Scatter才有这个属性,是否开启鼠标 hover 的提示动画效果
            hoverAnimation: true
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
