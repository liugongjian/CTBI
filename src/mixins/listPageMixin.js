import loadingMixin from './loadingMixin'
// 分页
export default {
  name: 'LoadingMixin',
  mixins: [loadingMixin],
  data: function () {
    return {
      // 是否开启滑动加载
      lazy: false,
      // 防抖控制
      queryTimes: null,
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
  mounted () {
    this.$nextTick(() => {
      this.bindLazyLoadEvent()
    })
  },
  computed: {
    tableRef () {
      // 此处需要定义表格组件的refs 为 multipleTable
      // 该值可自行定义
      return this.$refs.multipleTable?.$el.querySelector('.el-table__body-wrapper')
    }
  },
  beforeDestroy () {
    if (this.lazy && this.tableRef) {
      this.tableRef.removeEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    bindLazyLoadEvent () {
      if (this.lazy && this.tableRef) {
        this.tableRef.addEventListener('scroll', this.handleScroll)
      }
    },
    handleScroll (e) {
      // 获取dom滚动距离 添加1px的偏移量
      const scrollTop = e.target.scrollTop + 1
      // 获取可视区的高度
      const offsetHeight = this.tableRef.offsetHeight
      // 获取滚动条总高度
      const scrollHeight = this.tableRef.scrollHeight

      if (scrollTop + offsetHeight >= scrollHeight) {
        // 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
        if (this.queryTimes) {
          clearTimeout(this.queryTimes)
        }
        this.queryTimes = setTimeout(() => {
          this.queryForm.current++
          this.query()
        }, 500)
      }
    },
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
      if (this.lazy) {
        this.dataList = this.dataList.concat(list)
      } else {
        this.dataList = list
      }
      this.queryForm.total = total
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
