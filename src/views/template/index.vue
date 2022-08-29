<template>
  <div class="dashboard-template">
    <common-table
      :table-columns="columns"
      :table-data="tableData"
      :page-num.sync="pageNum"
      :page-size.sync="pageSize"
      :total="total"
      :loading="tableLoading"
      :is-show-default-option="false"
      @refresh="refresh"
    >
      <template #operation="{scope}">
        <el-button type="text" @click.stop="handleDelete(scope.row._id)">删除</el-button>
        <el-button type="text" @click.stop="handleEdit(scope.row._id)">编辑</el-button>
      </template>
    </common-table>
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/index.vue'
import { getTemplateList, deleteTemplate } from '@/api/template'

export default {
  name: 'Template',
  components: {
    CommonTable
  },
  data() {
    this.columns = [
      {
        prop: 'name',
        label: '模板名称'
      },
      {
        prop: 'description',
        label: '描述'
      },
      {
        prop: 'operation',
        width: 220,
        label: '操作',
        slot: 'operation',
        fixed: 'right'
      }
    ]
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableLoading: false
    }
  },
  mounted () {
    this.getTemplateList()
  },
  methods: {
    async getTemplateList () {
      try {
        this.tableLoading = true
        const params = {
          isPaging: '1',
          page: this.pageNum,
          limit: this.pageSize
        }
        const data = await getTemplateList(params)
        this.tableData = data.result
        this.total = data.pageInfo.totalItems
      } catch (error) {
        console.log(error)
        this.tableData = []
      } finally {
        this.tableLoading = false
      }
    },
    async handleDelete (id) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('svg-icon', ('svg-icon', {
            attrs: { iconClass: 'warning', style: 'width:1.5em;height:1.5em;margin-right:10px;vertical-align: -0.35em;' }
          })),
          h('span', null, '该模板将被删除，确认删除？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false
      }).then(async () => {
        try {
          await deleteTemplate(id)
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.getTemplateList()
        } catch (error) {
          console.log(error)
        }
      })
    },
    handleEdit(id) {
      console.log(id)
      this.$router.push({
        path: '/dashboard',
        query: {
          id,
          from: 'template',
          operation: 'editTemplate'
        }
      })
    },
    refresh () {
      this.getTemplateList()
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-template {
  font-size: 12px;
  .common-table {
    padding: 0px 24px;
    background-color: #fff;
    .el-button--text {
      font-size: 12px;
      font-weight: 400;
    }
  }
  .message-warning {
    width: 1.5em !important;
    height: 1.5em;
    vertical-align: -0.4em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 10px;
  }
}
</style>
