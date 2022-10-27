<!--
 * @Author: qinruibin
 * @Date: 2022-08-15 16:42:06
 * @LastEditors: qinruibin
 * @LastEditTime: 2022-10-27 09:50:10
 * @Description:
-->
<template>
  <div style="width: 100%; height: 100%">
    <div v-if="directionList.length" class="source-chart" style="width: 100%; height: 100%">
      <sourceCharts
        :center-data="centerData"
        :source-list="sourceList"
        :direction-list="directionList"
      />
    </div>
    <svg-icon v-else icon-class="chart-empty-san-key" class="chart-empty-svg" />
  </div>
</template>

<script>
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import {
  getLayoutOptionById,
  deepClone,
  getDataValueById
} from '@/utils/optionUtils'
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
  data() {
    return {
      storeOption: {},
      chartOption: {},
      // dataValue: {
      //   centerData: '',
      //   sourceList: '',
      //   directionList: ''
      // }
      centerData: [],
      sourceList: [
      ],
      directionList: [
      ]
    }
  },
  watch: {
    storeOption: {
      handler(val) {
        console.log(val)
      },
      deep: true
    }
  },
  mounted() {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    // 图表重绘事件，继承于baseMixins
    reloadImpl() {
      // this.formatDataValue()
      this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
    },
    formatData (dataValue) {
      this.centerData = []
      this.sourceList = []
      this.directionList = []
      console.log(dataValue, 'daadad')
      const type = dataValue.fields.DimensionType.fields[0].displayColumn || dataValue.fields.DimensionType.fields[0].column
      const name = dataValue.fields.DimensionName.fields[0].displayColumn || dataValue.fields.DimensionName.fields[0].column
      const center = dataValue.fields.Dimension.fields[0].displayColumn || dataValue.fields.Dimension.fields[0].column
      const values = dataValue.fields.Measure.fields[0].displayColumn || dataValue.fields.Measure.fields[0].column
      // const data = dataValue.data
      dataValue.data.forEach((value, i) => {
        if (value[type] === 'center') {
          this.centerData.push({ name: value[center], num: value[values] })
        }
        if (value[type] === 'source') {
          this.sourceList.push({ name: value[name], value: value[values], type: value[center] })
        }
        if (value[type] === 'goal') {
          this.directionList.push({ name: value[name], value: value[values], type: value[center] })
        }
      })
      console.log(this.centerData, this.sourceList, this.directionList, 'ccccc')
    }
    // formatDataValue() {
    //   this.dataValue.centerData = {
    //     name: '中心点',
    //     num: 24
    //   }
    //   this.dataValue.sourceList = [
    //     {
    //       source: '左1',
    //       visits: 21,
    //       proportion: '87.50',
    //       type: 'left'
    //     },
    //     {
    //       source: '左2',
    //       visits: 21,
    //       proportion: '87.50',
    //       type: 'left'
    //     }
    //   ]
    //   this.dataValue.directionList = [
    //     {
    //       source: '右1',
    //       visits: 21,
    //       proportion: '87.50',
    //       type: 'right'
    //     },
    //     {
    //       source: '右2',
    //       visits: 21,
    //       proportion: '87.50',
    //       type: 'right'
    //     }
    //   ]
    //   console.log(this.dataValue, 'dddddd')
    // }
  }
}
</script>

<style scoped lang='scss'>
.source-chart{
  overflow:hidden;
}
</style>
