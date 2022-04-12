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
import dashboardMixins from '@/components/BI/mixins/dashboardMixins'
export default {
  name: 'DashboardChart',
  mixins: [dashboardMixins],
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
      dataValue: 50
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
      // const componentOption = this.storeOption.theme.ComponentOption
      this.chartOption = {
        // legend: componentOption.Legend,
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '仪表盘',
            type: 'gauge',
            progress: {
              show: true
            },
            detail: {
              show: true,
              valueAnimation: true,
              formatter: '{value}',
              textStyle: {
                fontSize: 16
              }
            },
            data: [
              {
                'value': this.dataValue,
                'name': '速度'
              }
            ],
            title: {
              show: false
            },
            splitNumber: 'none' // 仪表盘刻度
          }

        ]
      }
    }
  }
}
</script>

<style>
</style>
