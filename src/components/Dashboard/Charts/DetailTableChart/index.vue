<template>
  <div style="width:100%;height:100%;">
    <div v-if="dataValue && dataValue.tableData" style="width:100%;height:90%;">
      <table-chart
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
      isShowPagination: true,
      pageNum: 1,
      pageSize: 10,
      tableLoading: false,
      storeOption: {},
      dataOption: [],
      stripe: true, // 斑马线
      border: false, // 线框
      header: false, // 不显示列头
      sequence: false, // 是否展示序号
      sequenceName: '序号',
      rowStyle: {}
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        if (val.theme.DisplayConfig.TableTheme.show) {
          this.stripe = val.theme.DisplayConfig.TableTheme.active === 'stripe'
          this.border = val.theme.DisplayConfig.TableTheme.active === 'border'
          const colorType = val.theme.DisplayConfig.TableTheme.colorType
          const color = colorType === 'gray' ? colorType : (colorType === 'themeColor' ? 'blue' : val.theme.DisplayConfig.Color.color[0].color)
          this.rowStyle = val.theme.DisplayConfig.TableTheme.active === 'simple' ? { 'border-bottom': `3px ${color} solid` } : {}
        } else {
          if (val.theme.DisplayConfig.TableThemeSimple.show) {
            switch (val.theme.DisplayConfig.TableThemeSimple.type) {
              case 'simple-no-head':
                this.stripe = true
                val.theme.DisplayConfig.ListHeader.head = true
                this.border = false
                break
              case 'simple':
                this.stripe = false
                val.theme.DisplayConfig.ListHeader.head = false
                this.border = true
                break
              default:
                this.stripe = true
                val.theme.DisplayConfig.ListHeader.head = false
                this.border = false
            }
          }
        }
        this.header = val.theme.DisplayConfig.ListHeader.head
        this.sequence = val.theme.DisplayConfig.Sequence.show
        this.sequenceName = val.theme.DisplayConfig.Sequence.name
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
    },
    formatDataValue (chartData, val = { pageNum: 1, pageSize: 10 }) {
      const { data, fields } = chartData
      const columns = []
      for (const key in fields) {
        if (Object.hasOwnProperty.call(fields, key)) {
          const element = fields[key]
          element.fields.forEach(field => {
            columns.push({ prop: field.column, label: field.displayColumn })
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
    }
  }
}
</script>

<style>
</style>
