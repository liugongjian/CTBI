<template>
  <div id="container" class="container">
    <div id="screentable" v-loading="loading" class="table-chart">
      <el-table
        ref="table"
        class="table"
        :stripe="stripe"
        :border="border"
        :show-header="!header"
        :data="tableData"
        v-bind="$attrs"
        :row-style="rowStyle"
        :header-row-style="headerRowStyle"
        :cell-style="cellStyle"
        :span-method="arraySpanMethod"
        v-on="$listeners"
      >
        <el-table-column
          v-if="sequence"
          type="index"
          :index="indexMethod"
          :label="sequenceName"
          width="100"
        />
        <template v-for="(item, index) in cloneTableColumns">
          <el-table-column
            v-if="item.isShow"
            :key="index + item.prop"
            :type="item.type && item.type !== 'selection' ? item.type : ''"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :sortable="item.sortable"
            :show-overflow-tooltip="item.ellipsis"
            :fixed="item.fixed"
            :align="item.align"
            :class-name="item.scroll ? `scroll-x ${item.class}` : item.class"
            v-bind="item.props"
          >
            <template slot="header" slot-scope="scope">
              <slot v-if="item.headerSlot" :name="item.headerSlot" :scope="scope" />
              <span v-else>{{ item.label }}</span>
            </template>
            <template slot-scope="scope">
              <span v-if="item.type === 'index'">{{ scope.$index + 1 }}</span>
              <span v-else-if="item.type === 'date'">
                {{ scope.row[item.prop] | dateFilter }}
              </span>
              <slot v-else-if="item.slot" :name="item.slot" :scope="scope" />
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        v-if="isShowPagination"
        class="pagination"
        background
        :current-page.sync="currentPage"
        :page-size="limit"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </div>

  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils/classUtils'
export default {
  name: 'CommonTable',
  props: {
    tableColumns: {
      required: true,
      type: Array
    },
    tableData: {
      required: true,
      type: Array
    },
    isShowPagination: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    header: {
      type: Boolean,
      default: false
    },
    sequence: {
      type: Boolean,
      default: false
    },
    pageNum: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    sequenceName: {
      type: String,
      default: '序号'
    },
    rowStyle: {
      type: Object,
      default: null
    },
    headerRowStyle: {
      type: Object,
      default: null
    },
    cellStyle: {
      type: Object,
      default: null
    },
    isMergeRow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      cloneTableColumns: [],
      pageSizes: [10, 20, 30, 50, 80, 100],
      paginationLayout: 'total, prev, pager, next, sizes, jumper',
      tableHeight: null
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.pageNum
      },
      set (val) {
        this.$emit('update:pageNum', val)
      }
    },
    limit: {
      get () {
        return this.pageSize
      },
      set (val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  watch: {
    tableColumns: {
      handler () {
        this.reset()
      },
      immediate: false
    },
    header: {
      handler(val) {
        if (val) {
          const bodyWrapper = document.getElementsByClassName('el-table__body-wrapper')[0]
          addClass(bodyWrapper, 'noHeader')
        } else {
          const bodyWrapper = document.getElementsByClassName('el-table__body-wrapper')[0]
          removeClass(bodyWrapper, 'noHeader')
        }
      }
    }

  },
  created () {
    this.reset()
  },
  mounted () {
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log('jjj', this.isMergeRow, row, column, rowIndex)
      if (this.isMergeRow && (columnIndex === 0 || columnIndex === 1)) {
        const _row = this.filterData(this.tableData, columnIndex).one[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    filterData(arr, colIndex) {
      const spanOneArr = []
      let concatOne = 0
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1)
        } else {
          // class 和classify 分别表示表格数据第一列和第二列对应的参数字段，根据实际参数修改
          if (colIndex === 0) {
            if (item.class === arr[index - 1].class) {
              spanOneArr[concatOne] += 1
              spanOneArr.push(0)
            } else {
              spanOneArr.push(1)
              concatOne = index
            }
          } else {
            if (item.classify === arr[index - 1].classify) {
              spanOneArr[concatOne] += 1
              spanOneArr.push(0)
            } else {
              spanOneArr.push(1)
              concatOne = index
            }
          }
        }
      })
      return {
        one: spanOneArr
      }
    },
    reset () {
      this.cloneTableColumns = this.tableColumns.map((item) => {
        item.fixed = item.fixed ? item.fixed : false
        item.isShow = item.isShow === false ? item.isShow : true
        item.class = item.class ? item.class : ''
        return item
      })
    },
    handleCurrentChange(val) {
      this.$emit('refresh', { pageNum: val, pageSize: this.pageSize })
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.$emit('refresh', { pageNum: 1, pageSize: val })
    },
    indexMethod(index) {
      const page = this.pageNum // 当前页码
      const pagesize = this.pageSize // 每页条数
      return index + 1 + (page - 1) * pagesize
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  .table-chart {
    margin-top: 10px;
    height: 100%;
    &:not(:root):-ms-full-screen {
      min-height: 100vh;
      padding: 20px;
      overflow: auto;
      background: #f0f2f5;
    }
    &:not(:root):-moz-full-screen {
      min-height: 100vh;
      padding: 20px;
      overflow: auto;
      background: #f0f2f5;
    }
    &:not(:root):-webkit-full-screen {
      min-height: 100vh;
      padding: 20px;
      overflow: auto;
      background: #f0f2f5;
    }
    &:not(:root):fullscreen {
      min-height: 100vh;
      padding: 20px;
      overflow: auto;
      background: #f0f2f5;
    }
    ::v-deep .el-table {
      font-size: 12px;
      height: calc(100% - 70px);
    }
    .el-table {
      ::v-deep td,
      ::v-deep th {
        padding: 6px 8px;
        .cell {
          padding: 0;
          color: #000;
        }
        &:first-child {
          padding-left: 24px;
        }
      }
      ::v-deep th.el-table__cell{
        background-color: transparent;
      }
      ::v-deep th {
        font-weight: 500;
      }
      ::v-deep .scroll-x .cell {
        position: relative;
        overflow-x: auto;
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          scrollbar-arrow-color: gray;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
          scrollbar-arrow-color: gray;
        }
        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  .el-table{
    ::v-deep table{
      border-collapse: collapse;
    }
    ::v-deep .el-table__body-wrapper{
      height: calc(100% - 36px);// 显示列表头
      // height: calc(100% - 0px);// 不显示列表头
      overflow-y: auto;
    }
    ::v-deep .el-table__body-wrapper.noHeader{
      height: calc(100% - 0px);// 不显示列表头
    }
  }
  .el-pagination{
    float: right;
    margin: 10px 0;
    max-width: 100%;
    overflow-x: auto;
  }
}

</style>
