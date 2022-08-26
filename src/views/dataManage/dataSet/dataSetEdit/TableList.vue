<template>
  <di>
    <div
      v-if="tableList.length > 0"
      v-infinite-scroll="load"
      :class="[{'full-height': !toggleContent}, 'list-wrapper']"
    >
      <div
        v-for="(table, i) in tableList"
        :key="`table-list-${i}`"
        style="display: flex;justify-content: space-between;align-items: center;"
        class="main-list"
      >
        <svg-icon
          icon-class="table"
          style="margin-right: 8px; height: 32px; width: 20px;"
        />
        <b-tooltip
          :title="`${table.name}<br><span style='line-height: 20px; color: rgba(0, 0, 0, 0.3);'>${table.comment || ''}</span>`"
          :content="`${table.name}<span style='margin-left: 8px; color: rgba(0, 0, 0, 0.3);'>${table.comment || ''}</span>`"
          class="h-c-p table-name"
        />
        <span class="table-btn">
          <el-tooltip
            content="复制"
            placement="top"
            effect="light"
            class="m-r-6"
          >
            <svg-icon
              :id="`copy-icon-${i}`"
              icon-class="copy"
              style="cursor: pointer;"
              @click="handleCopy(table.name, $event)"
            />
          </el-tooltip>
          <el-popover
            placement="right"
            width="360"
            trigger="click"
          >
            <div class="prop-title">
              <div>
                {{ table.name }}({{ currentTableInfo.columns? currentTableInfo.columns.length : 0 }})
              </div>
            </div>
            <el-divider />
            <div
              v-loading="tableInfoLoading"
              element-loading-text="加载字段中"
              style="min-height: 150px;"
            >
              <ColumnsList :columns="currentTableInfo.columns" />
            </div>
            <svg-icon
              slot="reference"
              icon-class="point"
              class="h-c-p"
              @click="handleTableInfo(table.name)"
            />
          </el-popover>
        </span>
      </div>
      <div
        class="w-100"
        style="text-align: center;"
      >
        <transition>
          <span
            v-show="loading"
            class="table-list-tips"
          >加载中...</span>
        </transition>
        <transition>
          <span
            v-show="end"
            class="table-list-tips"
          >没有更多数据</span>
        </transition>
      </div>
    </div>
    <el-empty
      v-else
      description="无数据"
    />
  </di>
</template>

<script>
import ColumnsList from '@/views/dataManage/dataSet/dataSetEdit/ColumnsList'
import Clipboard from '@/utils/clipboard.js'
import { getFileTableInfo, getTableInfo } from '@/api/dataSet'

export default {
  name: 'TableList',
  components: { ColumnsList },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    stopScroller: {
      type: Boolean,
      default: false
    },
    end: {
      type: Boolean,
      default: false
    },
    tableList: {
      type: Array,
      default: () => []
    },
    toggleContent: {
      type: Boolean,
      default: true
    },
    dataSourceId: {
      type: String,
      default: ''
    },
    // 数据源类型，只有本地文件有值 file
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableInfoLoading: false,
      currentTableInfo: {}
    }
  },
  methods: {
    // 复制数据源列表
    handleCopy (val, event) {
      Clipboard(val, event, () => {
        this.$message({
          message: '该表名已复制到剪切板',
          type: 'success',
          duration: 1500
        })
      })
    },
    load () {
      if (!this.stopScroller) {
        this.$emit('reloadTableList')
      }
    },
    async handleTableInfo (tableName) {
      const id = this.dataSourceId
      this.currentTableInfo = {}
      try {
        this.tableInfoLoading = true
        let result = null
        if (this.type === 'file') {
          result = await getFileTableInfo(tableName)
        } else {
          result = await getTableInfo(id, tableName)
        }
        this.currentTableInfo = result
      } catch (error) {
        console.log(error)
      }
      this.tableInfoLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.list-wrapper {
  padding: 20px 12px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 315px);

  &.full-height {
    height: calc(100vh - 250px);
  }

  .main-list {
    padding: 0px 8px 0px 0px;
    .table-btn {
      display: none;
    }
    .table-name {
      flex: 1;

      .table-comment {
        font-weight: 400;
        color: rgba(0, 0, 0, 0.3);
        line-height: 20px;
      }
    }

    &:hover {
      background-color: #fef5ee;
      .table-name {
        width: 150px;
      }
      .table-btn {
        display: block;
      }
    }

    .table-list-tips {
      margin-left: 8px;
      opacity: 0.85;
    }
  }
}
</style>
