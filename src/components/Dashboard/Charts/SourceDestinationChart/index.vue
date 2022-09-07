<!--
 * @Author: qinruibin
 * @Date: 2022-08-15 16:42:06
 * @LastEditors: qinruibin
 * @LastEditTime: 2022-08-23 17:57:50
 * @Description:
-->
<template>
  <div style="width: 100%; height: 100%">
    <div
      v-if="dataValue.directionList"
      style="width: 100%; height: 100%"
    >
      <sourceCharts
        :center-data="dataValue.centerData"
        :source-list="dataValue.sourceList"
        :direction-list="dataValue.directionList"
      />
    </div>
    <svg-icon
      v-else
      icon-class="chart-empty-san-key"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import { getLayoutOptionById } from '@/utils/optionUtils'
import sourceCharts from './sourceCharts.vue'
import store from '@/store'
export default {
  name: 'SourceDestinationChart',
  components: {
    sourceCharts
  },
  mixins: [baseMixins],
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
      dataValue: {
        centerData: '',
        sourceList: '',
        directionList: ''
      }
      // centerData: {
      // },
      // sourceList: [
      // ],
      // directionList: [
      // ]
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        console.log(val)
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.formatDataValue()
      // this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
    },
    formatDataValue () {
      this.dataValue.centerData = {
        name: '中心点',
        num: 24
      }
      this.dataValue.sourceList = [
        {
          source: '左1',
          visits: 21,
          proportion: '87.50',
          type: 'left'
        },
        {
          source: '左2',
          visits: 21,
          proportion: '87.50',
          type: 'left'
        }
      ]
      this.dataValue.directionList = [
        {
          source: '右1',
          visits: 21,
          proportion: '87.50',
          type: 'right'
        },
        {
          source: '右2',
          visits: 21,
          proportion: '87.50',
          type: 'right'
        }
      ]
      console.log(this.dataValue, 'dddddd')
    }
  }
}
</script>

<style scoped>
</style>
