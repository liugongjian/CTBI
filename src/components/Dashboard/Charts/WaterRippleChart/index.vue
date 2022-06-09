<template>
  <div style="width: 100%; height: 100%">
    <div v-if="dataValue" class="box">
      <Progress
        :store-option="storeOption"
        :data-value="dataValue"
      />
    </div>
    <div v-else>数据为空</div>
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
    // storeOption: {
    //   handler (val) {
    //     if (JSON.stringify(val.dataSource) !== '{}') {
    //       this.dataValue = deepClone(val.dataSource)
    //     }
    //   },
    //   deep: true
    // },
    // 'storeOption.dataSource': {
    //   handler (val) {
    //     if (JSON.stringify(val) !== '{}') {
    //       this.dataValue = deepClone(val)
    //       // 拿到数据的系列名字 并设置颜色
    //       this.getColor(this.dataValue)
    //       // 获取目标值
    //       this.getCfgTargetOption(this.dataValue)
    //     }
    //   }
    // }
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
