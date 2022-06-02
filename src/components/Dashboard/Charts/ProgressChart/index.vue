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
import { getLayoutOptionById, getDataValueById, formatDataValue } from '@/utils/optionUtils'
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
  watch: {
    storeOption: {
      handler (val) {
        if (this.dataValue.length !== 0) {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
        }
      },
      deep: true
    },
    dataOption: {
      handler(val) {
        const isData = val.findIndex(item => {
          return item.i === this.identify
        })
        if (isData !== -1) {
          this.dataValue = this.formatData(formatDataValue(getDataValueById(this.identify)))
          // 拿到数据的系列名字 并设置颜色
          this.getColor(this.dataValue)
          // 获取目标值
          this.getCfgTargetOption(this.dataValue)
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    formatData(data) {
      const array = []
      data.forEach((item, index) => {
        if (index === 0) {
          for (let i = 0; i < item.length; i++) {
            array[i] = { name: item[i], value: 0 }
          }
        } else {
          for (let i = 0; i < item.length; i++) {
            array[i].value += item[i]
          }
        }
      })
      return array
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
