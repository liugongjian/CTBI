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
import chinaJson from '../../mixins/china.json'
import mapMixins from '@/components/Dashboard/mixins/mapMixins'
export default {
  name: 'LineMapChart',
  mixins: [mapMixins],
  data () {
    return {
      chartOption: {},
      dataValue: [9, 3, 4, 14, 27, 18, 19]
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
    this.getOption()
  },
  methods: {
    getOption () {
      const coor = []
      for (var i = 0; i < this.dataValue.length; i++) {
        coor.push({
          name: chinaJson.features[this.dataValue[i]].properties.name,
          value: chinaJson.features[this.dataValue[i]].properties.center
        })
      }
      const lines_coord = []
      for (let i = 0; i < coor.length; i++) {
        if (coor[i].value) {
          lines_coord.push({
            coords: [coor[i].value, [116.405285, 39.904989, 24]]
          })
        }
      }

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
            type: 'effectScatter',
            coordinateSystem: 'geo', // 该系列使用的坐标系 可选: 'cartesian2d','polar','geo'
            // 标记的图形, 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond',
            symbol: 'circle',
            symbolSize: 8, // 标记的大小
            // 图形的样式
            itemStyle: {
              color: 'purple'
            },
            data: coor
          },
          {
            type: 'lines',
            coordinateSystem: 'geo',
            effect: {
              show: true, period: 5, trailLength: 0, symbol: 'arrow', color: '#01AAED', symbolSize: 8
            },
            lineStyle: {
              width: 1.2, opacity: 0.6, curveness: 0.2, color: '#FFB800'
            },
            data: lines_coord
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
