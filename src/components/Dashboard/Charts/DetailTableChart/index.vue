<template>
  <div style="width:100%;height:100%;">
    <div v-if="dataValue && dataValue.tableData" style="width:100%;height:100%;">
      <table-chart
        :table-columns="dataValue && dataValue.columns"
        :table-data="dataValue && dataValue.tableData"
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
        :header-row-style="headerRowStyle"
        :cell-style="cellStyle"
        :is-merge-row="isMergeRow"
        @refresh="refresh"
      />
    </div>
    <svg-icon
      v-else
      icon-class="chart-empty-detail-table"
      class="chart-empty-svg"
    />
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import tableMixins from '@/components/Dashboard/mixins/tableMixins'
import baseMixins from '@/components/Dashboard/mixins/baseMixins'
import TableChart from '../../Common/Table'
import store from '@/store'

export default {
  name: 'DetailTableChart',
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
      pageNum: 1,
      tableLoading: false,
      storeOption: {},
      dataOption: [],
      stripe: true, // 斑马线
      border: false, // 线框
      header: false, // 不显示列头
      sequence: false, // 是否展示序号
      sequenceName: '序号',
      rowStyle: {},
      headerRowStyle: {},
      cellStyle: {}
    }
  },
  computed: {
    isShowPagination() {
      return this.storeOption.theme.DisplayConfig.PaginationSettor.show
    },
    isMergeRow() {
      return this.storeOption.theme.DisplayConfig.MergeForm.show
    },
    pageSize: {
      get() {
        return this.storeOption.theme.DisplayConfig.PaginationSettor.pageSize
      },
      set(v) {
        this.storeOption.theme.DisplayConfig.PaginationSettor.pageSize = v
      }
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        this.getOption()
      },
      deep: true
    },
    // 图表类型切换
    'storeOption.is': {
      handler (val) {
        const isData = this.dataOption.findIndex(item => {
          return item.id === this.identify
        })
        if (isData !== -1) {
          this.$bus.$emit('interReload', [this.identify], 100, false)
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
    refresh (val) {
      this.dataValue = this.formatDataValue(deepClone(this.chartData), val)
    },
    // 图表重绘事件，继承于baseMixins
    reloadImpl () {
      this.dataValue = this.formatDataValue(deepClone(this.chartData))
      if (this.dataValue) {
        this.getOption()
      }
    },
    formatDataValue (chartData, val = { pageNum: 1, pageSize: 20 }) {
      const { data, fields } = chartData
      const columns = []
      for (const key in fields) {
        if (Object.hasOwnProperty.call(fields, key)) {
          const element = fields[key]
          element.fields.forEach(field => {
            columns.push({ prop: field.column, label: field.displayColumn, fixed: false, ellipsis: true })
          })
        }
      }
      const tableDataTmep = []
      data.forEach(item => {
        const obj = {}
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            const element = item[key]
            columns.forEach(jtem => {
              if (key === jtem.label) {
                obj[`${jtem.prop}`] = element
              }
            })
          }
        }
        tableDataTmep.push(obj)
      })
      this.pageSize = val.pageSize
      this.pageNum = val.pageNum
      const tableData = tableDataTmep.slice(
        (val.pageNum - 1) * val.pageSize,
        val.pageNum * val.pageSize
      )
      const dataValue = { tableData, total: tableDataTmep.length, columns }
      return dataValue
    },
    getOption() {
      const { DisplayConfig: { TableTheme, ListHeader, Sequence, TableThemeSimple } } = this.storeOption.theme
      if (TableTheme.show) {
        this.stripe = TableTheme.active === 'stripe'
        this.border = TableTheme.active === 'border'
        const colorType = TableTheme.colorType
        const color = colorType === 'gray' ? '#f5f5fa' : (colorType === 'themeColor' ? '#468cff' : TableTheme.color)
        if (TableTheme.active === 'stripe') {
          // 斑马线
          this.headerRowStyle = { 'border-bottom': `2px ${color} solid` }
        } else if (TableTheme.active === 'border') {
          // 线框
          this.rowStyle = {}
          this.cellStyle = { 'border-bottom': `1px #dfe6ec solid` }
          this.headerRowStyle = { 'border': `0px ${color} solid`, 'background-color': `${color} !important` }
        } else if (TableTheme.active === 'simple') {
          // 简版
          this.cellStyle = { 'border-bottom': `0px ${color} solid` }
          this.stripe = false
          this.border = false
          this.headerRowStyle = { 'border-bottom': `2px ${color} solid`, 'border-top': `3px ${color} solid`, 'background-color': 'transparent', 'color': '#fff' }
        } else if (TableTheme.active === 'verySimple') {
          // 极简
          this.rowStyle = {}
          this.headerRowStyle = {}
        }
      } else {
        if (TableThemeSimple.show) {
          switch (TableThemeSimple.type) {
            case 'simple-no-head':
              this.stripe = true
              ListHeader.head = true
              this.border = false
              break
            case 'simple':
              this.stripe = false
              ListHeader.head = false
              this.border = true
              break
            default:
              this.stripe = true
              ListHeader.head = false
              this.border = false
          }
        }
      }
      this.header = ListHeader.head
      this.sequence = Sequence.show
      this.sequenceName = Sequence.name
      if (this.dataValue && this.dataValue.columns?.length > 0) {
        this.getColumnsOption()
      }
    },
    getColumnsOption() {
      const { DisplayConfig: { Freeze, NewLine } } = this.storeOption.theme
      const positive = Freeze.positive
      const reverse = Freeze.reverse
      if (positive > this.dataValue.columns?.length || reverse > this.dataValue.columns?.length) {
        this.$message.warning(`不得超过总列数, 总列数为${this.dataValue.columns?.length}`)
        return
      }
      if (positive + reverse >= this.dataValue.columns?.length) {
        const columns = this.dataValue.columns?.map((item) => {
          item.fixed = true
          return item
        })
        this.dataValue.columns = columns
      }
      if (positive > 0) {
        const columns = this.dataValue.columns?.map((item, index) => {
          if (index <= positive) {
            item.fixed = true
          }
          return item
        })
        this.dataValue.columns = columns
      }
      if (reverse > 0) {
        const columns = this.dataValue.columns?.map((item, index) => {
          if (index >= reverse) {
            item.fixed = true
          }
          return item
        })
        this.dataValue.columns = columns
      }
      if (NewLine.show) {
        const columns = this.dataValue.columns?.map((item, index) => {
          item.ellipsis = false
          return item
        })
        this.dataValue.columns = columns
      } else {
        const columns = this.dataValue.columns?.map((item, index) => {
          item.ellipsis = true
          return item
        })
        this.dataValue.columns = columns
      }
    }
  }
}
</script>

<style>
</style>
