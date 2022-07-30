<!--
 * @Author: 黄璐璐
 * @Date: 2022-07-29 10:26:53
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-07-29 13:51:50
 * @Description:
-->
<template>
  <div style="width: 100%; height: 100%">
    <!-- <div v-if="dataValue.length>0" class="kbs-wrap">
      <subregion :data="dataValue" :option="getOption" :series="getKanBanSeries" />
    </div>
    <div v-else class="empty">数据为空</div> -->
  </div>
</template>

<script>
// import { getLayoutOptionById } from '@/utils/optionUtils'
// import KanBanSubregionMixins from '@/components/Dashboard/mixins/kanBanSubregionMixins'
// import subregion from './subregion.vue'
// import store from '@/store'
export default {
  name: 'CountUpChart',
  //   components: {
  //     subregion
  //   },
  //   mixins: [KanBanSubregionMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
    storeOption: {
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.kbs-wrap {
  height: 98%;
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
