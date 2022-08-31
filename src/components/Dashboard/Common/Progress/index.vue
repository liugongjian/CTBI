<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-19 11:32:45
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 14:35:51
 * @Description:
-->
<template>
  <div style="width:100%;height:100%;">
    <div class="box">
      <div v-for="(item,index) in dataValue" :key="index" class="item" :style="{width: showNumStyle}">
        <component :is="isComponent" :data="item" :option="ProgressStyle" :color="Color" :progress-config="ProgressConfig" />
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
    option: {
      type: Object,
      default: () => {}
    },
    dataValue: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showNumStyle () {
      const showNum = this.option.theme?.ComponentOption?.ProgressStyle.showNum || 1
      return `${1 / showNum * 100}%`
    },
    ProgressStyle () {
      return this.option.theme?.ComponentOption?.ProgressStyle || {}
    },
    Color() {
      return this.option.theme?.ComponentOption?.Color || {}
    },
    ProgressConfig () {
      return this.option.theme?.FunctionalOption.ProgressConfig || {}
    },
    isComponent () {
      return this.option.theme?.Basic?.VisualStyle.style || 'barType'
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
