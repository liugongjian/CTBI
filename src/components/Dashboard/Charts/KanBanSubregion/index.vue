<template>
  <div style="width: 100%; height: 100%">
    <div v-if="dataValue" class="kbs-wrap">
      <subregion :data="dataValue" :option="getOption" />
    </div>
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import KanBanSubregionMixins from '@/components/Dashboard/mixins/kanBanSubregionMixins'
import subregion from './subregion.vue'
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
      chartOption: {},
      dataValue: [
        // {
        //   'name': '东北',
        //   data: [
        //     { title: '单价', value: '4.45万' },
        //     { title: '利润金额', value: '4.45万' }
        //   ]
        // }, {
        //   'name': '华东',
        //   data: [
        //     { title: '单价', value: '4.45万' },
        //     { title: '利润金额', value: '4.45万' }
        //   ]
        // }, {
        //   'name': '华北',
        //   data: [
        //     { title: '单价', value: '4.45万' },
        //     { title: '利润金额', value: '4.45万' }
        //   ]
        // }, {
        //   'name': '华南',
        //   data: [
        //     { title: '单价', value: '4.45万' },
        //     { title: '利润金额', value: '4.45万' }
        //   ]
        // }
      ]
    }
  },
  computed: {
    getOption() {
      console.log(this.storeOption)
      return this.storeOption.theme?.StyleConfig?.IndexQuickly || {}
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
          this.getColor(this.dataValue)
          // 拿到名字 并设置svg
          this.getNameSvg(this.dataValue)
        }
      }
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    // this.getOption()
  },
  methods: {
    // getOption () {}
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
