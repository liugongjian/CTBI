import loadingMixin from './loadingMixin'
// 分页
export default {
  name: 'LoadingMixin',
  mixins: [loadingMixin],
  data: function () {
    return {
      dataList: [], // 列表数据
      selectedRows: [], // 列表选中行
      pageSizes: [20, 30, 40, 50, 100],
      paginationLayout: 'total, prev, pager, next, sizes, jumper',
      queryForm: {
        page: 1, // 当前页
        limit: 20, // 每页显示条目个数
        total: 0
      }
    }
  },
  methods: {
    //
    handleSizeChange (e) {
      this.queryForm.limit = e
      this.query()
    },
    handleCurrentChange (current) {
      this.queryForm.page = current
      this.query()
    },
    reFilter () {
      this.queryForm.page = 1
      this.query()
    },
    /* 接口请求，使用queryImpl */
    async query (param) {
      this.setLoading()
      await this.queryImpl()
      this.selectedRows = []
      this.resetLoading()
    },
    /* 设定列表数据 */
    setResult (list, total) {
      this.dataList = list
      this.dataList.forEach((item) => {
        if (!item.dataSourceName) {
          item.dataSourceName = '-'
        }
      })
      this.queryForm.total = total
      if (
        total > 0 &&
        (list === null || list.length === 0) &&
        this.queryForm.current > 1
      ) {
        this.queryForm.current--
        this.query()
      }
    },

    /** 列表自定义单选事件 */
    handleSingleSelect (record) {
      if (this.selectedRows.indexOf(record._id) > -1) {
        this.selectedRows.splice(this.selectedRows.indexOf(record._id), 1)
      } else {
        this.selectedRows.push(record)
      }
    },
    /** 列表自定义多选事件 */
    handleSelectAll () {
      if (
        this.selectedRows.length ===
        Math.min(this.queryForm.limit, this.dataList.length)
      ) {
        this.selectedRows = []
      } else {
        this.selectedRows = []
        for (
          let i = 0;
          // 表格当前页数据数组长度 < limit 时, 全选数量为当前数据数组长度
          i < Math.min(this.queryForm.limit, this.dataList.length);
          i++
        ) {
          this.selectedRows.push(this.dataList[i])
        }
      }
    }
  }
}
