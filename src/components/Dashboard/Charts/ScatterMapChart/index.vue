<template>
  <div style="width:100%;height:100%;">
    <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    />
    <svg-icon v-else icon-class="chart-empty-scatter-map" style="width:100%;height:100%;" />
  </div>
</template>

<script>
import chinaJson from '../../mixins/china.json'
import { getLayoutOptionById } from '@/utils/optionUtils'
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
      storeOption: {},
      chartOption: {},
      dataValue: [
        { name: '北京市', value: [116.405285, 39.904989, 24] },
        { name: '天津市', value: [117.190182, 39.125596, 60] },
        { name: '上海市', value: [121.472644, 31.231706, 24] },
        { name: '重庆市', value: [106.504962, 29.533155, 2] },
        { name: '河北省', value: [114.502461, 38.045474, 56] },
        { name: '河南省', value: [113.665412, 34.757975, 5] },
        { name: '云南省', value: [102.712251, 25.040609, 30] },
        { name: '辽宁省', value: [123.429096, 41.796767, 59] },
        { name: '黑龙江省', value: [126.642464, 45.756967, 73] },
        { name: '湖南省', value: [112.982279, 28.19409, 99] },
        { name: '安徽省', value: [117.283042, 31.86119, 24] },
        { name: '山东省', value: [117.000923, 36.675807, 10] },
        { name: '新疆维吾尔族自治区', value: [87.617733, 43.792818, 87] },
        { name: '江苏省', value: [118.767413, 32.041544, 51] },
        { name: '浙江省', value: [120.153576, 30.287459, 37] },
        { name: '江西省', value: [115.892151, 28.676493, 48] },
        { name: '湖北省', value: [114.298572, 30.584355, 17] },
        { name: '广西壮族自治区', value: [108.320004, 22.82402, 26] },
        { name: '甘肃省', value: [103.823557, 36.058039, 37] },
        { name: '山西省', value: [112.549248, 37.857014, 18] },
        { name: '内蒙古', value: [111.670801, 40.818311, 34] },
        { name: '陕西省', value: [108.948024, 34.263161, 64] },
        { name: '吉林省', value: [125.3245, 43.886841, 4] },
        { name: '福建省', value: [119.306239, 26.075302, 41] },
        { name: '贵州省', value: [106.713478, 26.578343, 20] },
        { name: '广东省', value: [113.280637, 23.125178, 10] },
        { name: '青海省', value: [101.778916, 36.623178, 3] },
        { name: '西藏自治区', value: [91.132212, 29.660361, 4] },
        { name: '四川省', value: [104.065735, 30.659462, 41] },
        { name: '宁夏回族自治区', value: [106.278179, 38.46637, 8] },
        { name: '海南省', value: [110.33119, 20.031971, 4] }
      ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
          this.getOption()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.$echarts.registerMap('china', chinaJson)
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.chartOption = {
        legend: componentOption.Legend,
        geo: {
          map: 'china',
          roam: true,
          // 图形上的文本标签
          // 地图区域的多边形 图形样式
          itemStyle: {
            areaColor: '#eee', // 地图区域的颜色
            borderColor: 'gray' // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
          },
          // 高亮状态下的多边形和标签样式
          emphasis: {
            label: {
              show: true, // 是否显示标签
              color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
            },
            itemStyle: {
              areaColor: 'rgba(238, 238, 238, 1)' // 地图区域的颜色
            }
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo', // 该系列使用的坐标系 可选: 'cartesian2d','polar','geo'
            // 标记的图形, 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond',
            symbol: 'circle',
            symbolSize: 8, // 标记的大小
            // 图形的样式
            itemStyle: {
              color: 'purple'
            },
            data: this.dataValue
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
