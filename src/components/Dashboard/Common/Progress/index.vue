<template>
  <div style="width:100%;height:100%;">
    <div class="box">
      <div v-for="(item,index) in dataValue" :key="index" class="item" :style="{width: showNumStyle}">
        <component :is="isComponent" :data="item" :option="progressStyle" :progress-config="progressConfig" />
      </div>
    </div>
  </div>
</template>

<script>
import progressMixins from '@/components/Dashboard/mixins/progressMixins'
import barType from './barType.vue'
import annularType from './annularType.vue'
import waterWave from './waterWave.vue'
export default {
  name: 'Progress',
  components: {
    barType,
    annularType,
    waterWave
  },
  mixins: [progressMixins],
  props: {
    storeOption: {
      type: Object,
      default: () => ({})
    },
    dataValue: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    showNumStyle () {
      const showNum = this.storeOption.theme?.ComponentOption?.progressStyle.showNum || 1
      return `${1 / showNum * 100}%`
    },
    progressStyle () {
      return this.storeOption.theme?.ComponentOption?.progressStyle || {}
    },
    progressConfig () {
      return this.storeOption.theme?.FunctionalOption.progressConfig || {}
    },
    isComponent () {
      return this.storeOption.theme.Basic.VisualStyle.style || 'barType'
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
