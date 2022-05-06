<template>
  <div style="width:100%;height:100%;">
    <div v-if="dataValue && dataValue.tableData">
      <table-chart
        :table-columns="columns"
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
        @refresh="refresh"
      />
    </div>
    <div v-else>数据为空</div>
  </div>
</template>

<script>
import { getLayoutOptionById, deepClone } from '@/utils/optionUtils'
import tableMixins from '@/components/Dashboard/mixins/tableMixins'
import TableChart from '../../Common/Table'
export default {
  name: 'DetailTableChart',
  components: { TableChart },
  mixins: [tableMixins],
  props: {
    identify: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataValue: null,
      isShowPagination: true,
      pageNum: 1,
      pageSize: 20,
      tableLoading: false,
      storeOption: {},
      stripe: true, // 斑马线
      border: false, // 线框
      header: false, // 不显示列头
      sequence: false, // 是否展示序号
      sequenceName: '序号'
    }
  },
  watch: {
    storeOption: {
      handler (val) {
        val.theme.Basic.Title.testShow = val.theme.Basic.TestTitle.testShow
        this.stripe = val.theme.DisplayConfig.TableTheme.active === 'stripe'
        this.border = val.theme.DisplayConfig.TableTheme.active === 'border'
        this.header = val.theme.DisplayConfig.ListHeader.head
        this.sequence = val.theme.DisplayConfig.Sequence.show
        this.sequenceName = val.theme.DisplayConfig.Sequence.name
        // this.isShowPagination = val.theme.DisplayConfig.
        if (JSON.stringify(val.dataSource) !== '{}') {
          this.dataValue = deepClone(val.dataSource)
          this.columns = this.dataValue.columns.map((item) => {
            item.fixed = false
            return item
          })
        }
      },
      deep: true
    }
  },
  mounted () {
    this.storeOption = getLayoutOptionById(this.identify)
  },
  methods: {
    refresh() {
      console.log('重新请求数据')
    }
  }
}
</script>

<style>
</style>
