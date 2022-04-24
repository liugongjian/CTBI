<template>
  <div v-loading="loading" class="common-table" id="screentable">
    <div v-if="isShowToolbar" class="toolbar">
      <slot name="toolbar-left-option"><div class="toolbar-title">{{ tableTitle }}</div></slot>
      <div class="toolbar-option">
        <div class="slot-option">
          <slot name="toolbar-option" />
        </div>
        <div v-if="isShowDefaultOption" class="default-option">
          <el-divider direction="vertical" />
          <template v-if="isShowRefresh">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <div class="default-option-item">
                <div class="item">
                  <svg-icon icon-class="reload" @click="refresh" />
                </div>
              </div>
            </el-tooltip>
          </template>
          <template v-if="isShowColumnSetting">
            <el-tooltip effect="dark" content="列设置" placement="top">
              <div class="default-option-item">
                <ColumnSetting v-if="tableColumns" class="item" :table-columns="cloneTableColumns" @reset="reset" />
              </div>
            </el-tooltip>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="selectedTotal !== 0 && isShowSelectionInfo"
      :class="isShowToolbar ? 'table-alert' : 'table-alert  table-alert-top'"
    >
      <div class="alert-info">
        <div style="marginRight: 10px">
          <i class="el-icon-info them-color" />
        </div>
        <div class="alert-info-content">
          <div class="alert-info-message">
            <span class="alert-info-message-item">
              已选择<span style="margin: 0 5px;color: #468FAF;">{{ selectedTotal }}</span>项
            </span>
            <slot name="alert-message" :scope="multipleSelection" />
          </div>
          <div class="alert-info-option">
            <el-button v-if="isShowFilter" type="text" size="medium" @click="filterSelected">
              {{ showSelect ? '查看全部': '查看已选' }}
            </el-button>
            <slot name="alert-option" :scope="multipleSelection" />
            <el-button type="text" @click="toggleSelection('clear')">清空</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-table
      ref="table"
      class="table"
      :data="tableData"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      v-on="$listeners"
    >
      <el-table-column
        v-if="isShowSelection"
        type="selection"
        fixed="left"
        :selectable="selectable"
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
// import Screenfull from '@/components/Screenfull/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import ColumnSetting from './components/ColumnSetting'

export default {
  name: 'CommonTable',
  components: {
    // Screenfull,
    Pagination,
    ColumnSetting
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
    isShowToolbar: {
      type: Boolean,
      default: true
    },
    // eslint-disable-next-line vue/require-prop-types
    tableTitle: {
      default: ''
    },
    isShowRefresh: {
      type: Boolean,
      default: true
    },
    isShowFullscreen: {
      type: Boolean,
      default: false
    },
    isShowColumnSetting: {
      type: Boolean,
      default: false
    },
    isShowSelection: {
      type: Boolean,
      default: false
    },
    isShowPagination: {
      type: Boolean,
      default: true
    },
    isShowSelectionInfo: {
      type: Boolean,
      default: true
    },
    isShowFilter: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    defaultSelection: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Function,
      default: () => true
    },
    isShowDefaultOption: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      cloneTableColumns: [],
      multipleSelection: [],
      selectedTotal: 0,
      showSelect: false
    }
  },
  watch: {
    defaultSelection: {
      handler (val) {
        this.toggleSelection()
        this.$nextTick(() => {
          if (val?.length) {
            this.toggleSelection(val)
          }
        })
      },
      immediate: false
    },
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
    this.toggleSelection(this.defaultSelection)
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
    refresh () {
      this.$emit('refresh')
    },
    handlePageChange (page) {
      this.$emit('refresh', page)
    },
    // 查看已选/全部
    filterSelected () {
      this.showSelect = !this.showSelect
      const selectRows = this.multipleSelection
      this.$emit('filterSelected', selectRows, this.showSelect)
      if (selectRows?.length > 0) {
        this.$nextTick(() => {
          this.tableData.forEach((item) => {
            selectRows.forEach((row) => {
              if (row.host === item.host) {
                this.$refs.table.toggleRowSelection(item, true)
              }
            })
          })
        })
      }
    },
    toggleSelection (rows) {
      if (rows && rows !== 'clear') {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row)
        })
      } else {
        let selection = []
        if (rows === 'clear') {
          selection = this.multipleSelection.filter((row) => !this.selectable(row))
          this.showSelect = false
          this.$emit('filterSelected', selection, false)
        }
        this.$refs.table.clearSelection()
        selection.forEach((item) => {
          this.$refs.table.toggleRowSelection(item, true)
        })
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.selectedTotal = this.multipleSelection.length
    },
    rowClick (row) {
      if (this.isShowSelection && this.selectable(row)) {
        this.$refs.table.toggleRowSelection(row)
      }
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
</style>
