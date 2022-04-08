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
import radarMixins from '@/components/BI/mixins/radarMixins'
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
          name: 'Allocated Budget'
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: 'Actual Spending'
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
    this.storeOption = getLayoutOptionById(this.identify)
    this.getOption()
  },
  methods: {
    getOption () {
      const componentOption = this.storeOption.theme.ComponentOption
      this.chartOption = {
        legend: componentOption.Legend,
        radar: {
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ],
          name: { // (圆外的标签)雷达图每个指示器名称的配置项。
            show: false,
            formatter: '{value}',
            textStyle: {
              fontSize: 15,
              color: 'red'
            }
          }
        },
        tooltip: {
          formatter: '{a} <br/>{b} : {c}'
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
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
