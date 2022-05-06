<template>
  <div style="width: 100%; height: 100%">
    <div v-if="dataValue">
      <Disperse />
      <Integration />
    </div>
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import trendMixins from '@/components/Dashboard/mixins/trendMixins'
import Disperse from './Disperse.vue'
import Integration from './Integration.vue'
export default {
  name: 'TrendChart',
  components: {
    Disperse,
    Integration
  },
  mixins: [trendMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      storeOption: {},
      dataValue: null
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = val.dataSource
        }
      },
      deep: true
    },
    'storeOption.dataSource': {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          // 拿到数据的系列名字 并设置颜色
          // this.getColor(this.dataValue)
          // 拿到名字 并设置svg
          // this.getNameSvg(this.dataValue)
          // 拿到系列和值
          // this.getDataSeries(this.dataValue)
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  }
}
</script>

<style>

</style>
