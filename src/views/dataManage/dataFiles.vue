<template>
  <CommonTable
    class="data-files"
    :table-columns="columns"
    :table-data="tableData"
    :page-num.sync="page"
    :page-size.sync="limit"
    :total="total"
    :loading="tableLoading"
    :is-show-default-option="false"
    @sort-change="handleSortChange"
    @pagination="getDataFiles"
  >
    <template #toolbar-option>
      <div class="search-bar">
        <el-input v-model="searchKey" class="search-input" prefix-icon="el-icon-search" size="small" placeholder="请输入文件名称" @keyup.enter.native="handleSearch" />
        <el-button size="small" class="btn" @click="createDataSet">SQL创建数据集</el-button>
      </div>
    </template>
    <template #size="{scope}">
      <span>{{ scope.row.size | bytesFilter }}</span>
    </template>
    <template #operation="{scope}">
      <el-button type="text" size="small" @click.stop="createDataSet(scope.row)">创建数据集</el-button>
      <el-divider direction="vertical" />
      <el-button type="text" size="small" @click.stop="handleDelete(scope.row)">删除</el-button>
    </template>
  </CommonTable>
</template>

<script>
import { getDataFiles, deleteDataFile } from '@/api/dataSource'
import CommonTable from '@/components/CommonTable'
import { getDateTime } from '@/utils/optionUtils'
export default {
  name: 'DataFiles',
  components: { CommonTable },
  data() {
    return {
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      tableLoading: false,
      searchKey: '',
      sortOrder: '',
      sortBy: 'desc',
      columns: Object.freeze([
        {
          prop: 'name',
          label: '名称',
          sortable: true
        },
        {
          prop: 'size',
          label: '大小',
          slot: 'size',
          sortable: true
        },
        {
          prop: 'operation',
          width: 160,
          label: '操作',
          slot: 'operation',
          fixed: 'right'
        }
      ])
    }
  },
  created() {
    this.getDataFiles()
  },
  methods: {
    async getDataFiles(params) {
      try {
        this.tableLoading = true
        params = params ?? {
          page: this.page,
          limit: this.limit,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          isPaging: 1
        }
        const { list, page, total, limit } = await getDataFiles(params)
        this.tableData = list
        this.page = page
        this.total = total
        this.limit = limit
        this.tableLoading = false
      } catch (error) {
        console.log(error)
        this.tableLoading = false
        this.tableData = []
      }
    },
    async handleSortChange({ column, prop, order }) {
      if (order) {
        this.sortOrder = order === 'ascending' ? 'asc' : 'desc'
        this.sortBy = prop
      } else {
        this.sortOrder = 'desc'
      }
      const params = {
        page: 1,
        limit: this.limit,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        isPaging: 1
      }
      this.getDataFiles(params)
    },
    handleDelete({ _id, displayName }) {
      this.$confirm('确认删除本地文件？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            this.tableLoading = true
            await deleteDataFile(_id)
            this.tableLoading = false
            this.$message.success('删除成功！')
            this.getDataFiles()
          } catch (error) {
            this.tableLoading = false
            console.log(error)
          }
        })
    },
    createDataSet(dataSource) {
      const currentTime = getDateTime()
      const query = {
        _id: '',
        displayName: '',
        comment: '',
        sqlId: '',
        fields: [],
        folderId: null,
        isFolder: false,
        creatorId: '',
        dataSourceId: dataSource?._id ?? '',
        dataSourceName: dataSource?.displayName ?? '',
        creatorName: '',
        createdTime: currentTime
      }
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
    },
    async handleSearch() {
      const params = {
        page: 1,
        limit: this.limit,
        sortBy: '',
        sortOrder: 'desc',
        isPaging: 1,
        searchkey: this.searchKey
      }
      this.getDataFiles(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.data-files {
  margin-right: 24px;
  ::v-deep .toolbar {
    padding: 15px 0 19px;
  }
  .search-bar {
    display: flex;
    justify-content: flex-end;
    .btn {
      margin-left: 12px;
      color: #FA8334;
    }
  }
}
</style>
