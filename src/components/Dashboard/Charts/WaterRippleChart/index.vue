<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-19 11:32:45
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 15:06:35
 * @Description:
-->
<template>
  <div style="width: 100%; height: 100%">
    <div
      v-if="dataValue && dataValue.length > 0"
      class="box"
    >
      <Progress
        :option="storeOption"
        :data-value="dataValue"
      />
    </div>
    <svg-icon
      v-else
      icon-class="chart-empty-water-ripple"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import waterRippleMixins from '@/components/Dashboard/mixins/waterRippleMixins'
import Progress from '@/components/Dashboard/Common/Progress'
import store from '@/store'
export default {
  name: 'WaterRippleChart',
  components: {
    Progress
  },
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
      dataOption: [],
      dataValue: []
    }
  },
  watch: {
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
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
