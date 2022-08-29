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
        <el-button type="text" @click.stop="handleEdit(scope.row)">属性</el-button>
        <el-button type="text" @click.stop="handleEditTemplate(scope.row._id)">编辑</el-button>
        <el-button type="text" @click.stop="handleDelete(scope.row._id)">删除</el-button>
      </template>
    </common-table>

    <el-dialog title="属性" :visible.sync="templateAttributeVisible" width="480px" @close="hiddenTemplateAttribute">
      <div class="data-set-dialog-main">
        <el-form ref="attrForm" style="padding: 0px" :model="templateAttr" :rules="attrRules" label-width="40px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="templateAttr.name" placeholder="请输入模板名称" style="width: 360px" />
          </el-form-item>
          <el-form-item label="描述" prop="description" style="margin-top: 30px">
            <el-input v-model="templateAttr.description" type="textarea" placeholder="请输入描述" style="width: 360px" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hiddenTemplateAttribute">取 消</el-button>
        <el-button type="primary" @click="handleTemplateAttribute">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/index.vue'
import { getTemplateList, deleteTemplate, updateTemplateAttribute } from '@/api/template'
import _ from 'lodash'

export default {
  name: 'Template',
  components: {
    CommonTable
  },
  data() {
    const validateName = (rule, value, callback) => {
      const name = value.trim()
      if (name === '') {
        callback(new Error('请输入模板名称'))
      } else {
        const reg = /^[\u4e00-\u9fa5\w]{1,50}$/
        if (!reg.test(name)) {
          callback(new Error('仅支持中英文和数字,长度不超过50'))
        } else {
          callback()
        }
      }
    }
    const validateDescription = (rule, value, callback) => {
      const description = value.trim()
      if (description === '') {
        callback(new Error('请输入模板描述'))
      } else {
        const reg = /^[\u4e00-\u9fa5\w]{1,100}$/
        if (!reg.test(description)) {
          callback(new Error('仅支持中英文和数字,长度不超过100'))
        } else {
          callback()
        }
      }
    }
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
      tableLoading: false,
      templateAttributeVisible: false,
      templateAttr: {
        name: null,
        description: null
      },
      attrRules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        description: [
          { validator: validateDescription, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getTemplateList()
  },
  methods: {
    handleEdit(row) {
      this.templateAttributeVisible = true
      this.$nextTick(() => {
        this.templateAttr = _.pick(row, ['_id', 'name', 'description'])
      })
    },
    handleTemplateAttribute () {
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {
          this.updateTemplateAttribute()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async updateTemplateAttribute() {
      const id = this.templateAttr._id
      const params = {
        id,
        name: this.templateAttr.name.trim(),
        description: this.templateAttr.description ? this.templateAttr.description.trim() : ''
      }
      try {
        const data = await updateTemplateAttribute(params)
        this.$message.success(data)
        this.templateAttributeVisible = false
        this.resetForm()
        this.getTemplateList()
      } catch (error) {
        console.log(error)
      }
    },
    resetForm () {
      this.$refs['attrForm'].resetFields()
    },
    hiddenTemplateAttribute () {
      this.templateAttributeVisible = false
      this.resetForm()
    },
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
    handleEditTemplate(id) {
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
