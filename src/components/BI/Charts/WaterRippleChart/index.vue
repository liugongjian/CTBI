<template>
  <div style="width: 100%; height: 100%">
    <v-chart v-if="dataValue" :option="chartOption" autoresize />
    <div v-else>数据为空</div>
  </div>
</template>

<script>
// import 'echarts-liquidfill'
import { getLayoutOptionById } from '@/utils/optionUtils'
import waterRippleMixins from '@/components/BI/mixins/waterRippleMixins'
export default {
  name: 'WaterRippleChart',
  mixins: [waterRippleMixins],
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
      dataValue: [0.6, 0.5, 0.4, 0.3]
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
        toolTip: {
          show: true
        },
        label: {
          fontSize: 20
        },
        series: [
          {
            name: '水波纹',
            type: 'liquidFill',
            data: this.dataValue
          }
        ]
      }
    }
  }
}
</script>

<style></style>
