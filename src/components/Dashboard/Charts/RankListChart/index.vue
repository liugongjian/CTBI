<template>
  <div style="width:100%;height:100%;">
    <div v-if="dataValue && dataValue.tableData">
      <table-chart
        style="width:100%,height:100%"
        :table-columns="dataValue.columns"
        :table-data="dataValue.tableData"
        :page-num.sync="pageNum"
        :page-size.sync="pageSize"
        :total="dataValue.total"
        :loading="tableLoading"
        :is-show-pagination="isShowPagination"
        :is-show-default-option="true"
        :stripe="stripe"
        :border="border"
        :header="header"
        :sequence="sequence"
        :sequence-name="sequenceName"
        :row-style="rowStyle"
        :max-number="dataValue.maxNumber"
        :color-option="colorOption"
        :position="position"
        @refresh="refresh"
      />
    </div>
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById } from '@/utils/optionUtils'
import tableMixins from '@/components/Dashboard/mixins/tableMixins'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import TableChart from '../RankTable'
import store from '@/store'

export default {
  name: 'RankListChart',
  components: { TableChart },
  mixins: [tableMixins, baseMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataValue: null,
      columns: [],
      isShowPagination: false,
      pageNum: 1,
      pageSize: 20,
      tableLoading: false,
      storeOption: {},
      dataOption: [],
      stripe: true, // 斑马线
      border: false, // 线框
      header: true, // 不显示列头
      sequence: false, // 是否展示序号
      sequenceName: '序号',
      rowStyle: {},
      colorOption: '',
      position: ''
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        console.log(val, 'vavav')
        this.sequenceName = val.theme.StyleConfig.Rank.title
        this.header = val.theme.StyleConfig.Rank.show
        this.colorOption = val.theme.StyleConfig.Rank.color
        this.position = val.theme.StyleConfig.Rank.position
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
    this.dataOption = store.state.app.dataOption
  },
  methods: {
    refresh() {
      console.log('重新请求数据')
    },
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatDataValue()
      // this.dataValue = this.formatData(deepClone(getDataValueById(this.identify)))
      console.log(this.dataValue)
    },
    // formatData (dataValue) {
    //   console.log(dataValue, '接收的数据')
    // }
    formatDataValue() {
      const tableData = [{ 'name': '111', 'value': 3434 }, { 'name': 'Sam S Club', 'value': 10000 }, { 'name': 'a Club', 'value': 12122 }]
      const maxNumber = Math.max.apply(Math, tableData.map(item => { return item.value }))
      const columns = [{ prop: 'name', label: '姓名', width: '100' }, { prop: 'value', label: '价格', width: '100' }]
      const dataValue = { tableData: tableData.sort(function (a, b) {
        return (b.value - a.value)
      }), total: tableData.length, columns, maxNumber }
      return dataValue
    }
  }
}
</script>

<style>
</style>
