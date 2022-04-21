<template>
  <div style="width:100%;height:100%;">
    <!-- <v-chart
      v-if="dataValue"
      :option="chartOption"
      autoresize
    /> -->
    <div v-if="dataValue" class="box">
      <div v-for="(item,index) in dataValue" :key="index" class="item" :style="{width: showNumStyle}">
        <component :is="isComponent" :data="item" :option="progressStyle" />
      </div>
    </div>
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import progressMixins from '@/components/Dashboard/mixins/progressMixins'
import barType from './barType.vue'
import annularType from './annularType.vue'
import waterWave from './waterWave.vue'
export default {
  name: 'ProgressChart',
  components: {
    barType,
    annularType,
    waterWave
  },
  mixins: [progressMixins],
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
      dataValue: [],
      isComponent: 'barType'
    }
  },
  computed: {
    showNumStyle () {
      const showNum = this.storeOption.theme?.ComponentOption?.progressStyle.showNum || 1
      return `${1 / showNum * 100}%`
    },
    progressStyle () {
      return this.storeOption.theme?.ComponentOption?.progressStyle || {}
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)
          this.getOption()
        }
      },
      deep: true
    },
    'storeOption.dataSource': {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          this.dataValue = deepClone(val)
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          // 拿到数据中的指标
          // this.getIndicatorOptions(this.dataValue)
          this.getOption()
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    getOption () {
      this.isComponent = this.storeOption.theme.Basic.VisualStyle.style
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  height: 93%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  .item {
    text-align: center;
  }
}
</style>
