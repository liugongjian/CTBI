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
import chinaJson from './china.json'
import { getLayoutOptionById } from '@/utils/optionUtils'
import colorMapMixins from '@/components/BI/mixins/colorMapMixins'
export default {
  name: 'ColorMapChart',
  mixins: [colorMapMixins],
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
          name: '南海诸岛',
          value: 10,
          eventTotal: 100,
          specialImportant: 10,
          import: 10,
          compare: 10,
          common: 40,
          specail: 20
        },
        {
          name: '上海市',
          value: 10
        },
        {
          name: '重庆市',
          value: 20
        },
        {
          name: '河北省',
          value: 30
        },
        {
          name: '云南省',
          value: 70
        },
        {
          name: '辽宁省',
          value: 20
        },
        {
          name: '黑龙江省',
          value: 40
        },
        {
          name: '山东省',
          value: 50
        },
        {
          name: '新疆维吾尔自治区',
          value: 60
        },
        {
          name: '江西省',
          value: 40
        },
        {
          name: '湖北省',
          value: 10
        },
        {
          name: '广西壮族自治区',
          value: 20
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
        visualMap: {
          show: true,
          type: 'continuous',
          min: 0,
          max: 100,
          realtime: false,
          calculable: true
        },
        geo: {
          map: 'china',
          zoom: 1,
          roam: true,
          itemStyle: {
            borderColor: 'rgba(0, 0, 0, 0.2)',
            areaColor: '#f2d5ad'
          }
        },
        series: [
          {
            name: '地区分布',
            type: 'map',
            geoIndex: 0,
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
