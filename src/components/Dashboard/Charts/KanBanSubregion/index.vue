<!--
 * @Author: 黄璐璐
 * @Date: 2022-06-08 10:55:37
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-03 11:02:10
 * @Description:
-->
<template>
  <div style="width: 100%; height: 100%">
    <div
      v-if="dataValue.length>0"
      class="kbs-wrap"
    >
      <subregion
        :data="dataValue"
        :option="getOption"
        :series="getKanBanSeries"
        :layout="layout"
      />
    </div>
    <svg-icon
      v-else
      icon-class="chart-empty-kan-ban"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import { getLayoutOptionById, getLayoutById } from '@/utils/optionUtils'
import KanBanSubregionMixins from '@/components/Dashboard/mixins/kanBanSubregionMixins'
import subregion from './subregion.vue'
import store from '@/store'
export default {
  name: 'KanBanSubregion',
  components: {
    subregion
  },
  mixins: [KanBanSubregionMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      storeOption: {},
      dataOption: [],
      dataValue: [
      ]
    }
  },
  computed: {
    layout() {
      return getLayoutById(this.identify)
    },
    getOption () {
      return this.storeOption.theme?.StyleConfig || {}
    },
    getKanBanSeries () {
      return this.storeOption.theme?.SeriesSetting?.IndicatorSeries || {}
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  }
}
</script>

<style scoped>
.kbs-wrap {
  height: calc( 98% - 18px );
  overflow: auto;
}
.kbs-item {
  padding: 10px 40px;
}

ul > li {
  list-style: none;
  text-align: center;
}
ul li:nth-child(3) {
  font-size: 24px;
}
</style>
