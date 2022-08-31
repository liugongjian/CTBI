<template>
  <div style="width: 100%; height: 100%">
    <div v-if="dataValue && dataValue.length > 0" class="box">
      <Progress
        :option="storeOption"
        :data-value="dataValue"
      />
    </div>
    <svg-icon v-else icon-class="chart-empty-progress" style="width:100%;height:100%;" />
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import waterRippleMixins from '@/components/Dashboard/mixins/waterRippleMixins'
import Progress from '@/components/Dashboard/Common/Progress'
import store from '@/store'
export default {
  name: 'ProgressChart',
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
