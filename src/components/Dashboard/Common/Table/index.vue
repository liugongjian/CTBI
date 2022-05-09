<template>
  <div id="screentable" v-loading="loading" class="common-table">

    <el-table
      ref="table"
      class="table"
      :stripe="stripe"
      :border="border"
      :show-header="!header"
      :data="tableData"
      v-bind="$attrs"
      :row-style="rowStyle"
      v-on="$listeners"
    >
      <el-table-column
        v-if="sequence"
        type="index"
        :index="indexMethod"
        :label="sequenceName"
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
    <Pagination
      v-if="isShowPagination"
      class="pagination"
      v-bind="$attrs"
      v-on="$listeners"
      @pagination="handlePageChange"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
// import ColumnSetting from './components/ColumnSetting'

export default {
  name: 'CommonTable',
  components: {
    Pagination
  },
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
    sequenceName: {
      type: String,
      default: '序号'
    },
    rowStyle: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      cloneTableColumns: []
    }
  },
  watch: {
    tableColumns: {
      handler () {
        this.reset()
      },
      immediate: false
    }
  },
  created () {
    this.reset()
  },
  mounted () {
  },
  methods: {
    reset () {
      this.cloneTableColumns = this.tableColumns.map((item) => {
        item.fixed = item.fixed ? item.fixed : false
        item.isShow = item.isShow === false ? item.isShow : true
        item.class = item.class ? item.class : ''
        return item
      })
    },
    handlePageChange (page) {
      this.$emit('refresh', page)
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
.common-table {
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
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    background: #fff;
    .toolbar-title {
      flex: 1 1;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      opacity: 0.85;
    }
    .toolbar-option {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-basis: 100%;
      .default-option {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .default-option-item {
          margin: 0 8px;
          &:last-child {
            margin-right: 0;
          }
          .item {
            font-size: 12px;
            color: #333;
          }
          ::v-deep .dropdown-link,
          ::v-deep .svg-icon {
            cursor: pointer;
          }
        }
      }
    }
  }
  .table-alert {
    padding: 0 24px 0 14px;
    border-radius: 2px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    .alert-info {
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin: 0;
      color: rgba(0, 0, 0, 0.85);
      font-size: 12px;
      line-height: 1.5715;
      list-style: none;
      word-wrap: break-word;
      .icon {
        color: #409eff;
      }
      .alert-info-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1 1;
        .alert-info-message {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .alert-info-message-item {
            margin-right: 5px;
          }
        }
      }
    }
  }
  ::v-deep .el-table {
    font-size: 12px;
  }
  .table-alert-top {
    padding: 0;
    .alert-info {
      padding: 0 25px;
    }
  }
  .table.el-table {
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
    ::v-deep th {
      // color: $mainTextColor-dark2;
      font-weight: 500;
      background: #fafafa;
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
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
  }
  .them-color{
    // color: $mainColor;
  }
}
.el-table{
    ::v-deep table{
        border-collapse: collapse;
    }
}
</style>
