<template>
  <div class="data-source">
    <div class="data-source__title">
      <span>数据源</span>
    </div>
    <div class="data-source__content">
      <div class="data-source__header">
        <div class="head-title">数据源</div>
        <div class="head-select">
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              +新建数据源
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="mysql">MySQL</el-dropdown-item>
              <el-dropdown-item command="mongoDB">MongoDB</el-dropdown-item>
              <el-dropdown-item command="localFile">本地文件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-dialog
        :title="status+fileType[form.type]"
        :visible.sync="dialogVisible"
        width="560px"
      >
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="显示名称" prop="displayName">
            <el-input
              v-model="form.displayName"
              placeholder="请输入数据源配置列表显示名称"
            />
          </el-form-item>
          <el-form-item label="数据库地址" prop="host">
            <el-input
              v-model="form.host"
              placeholder="请输入IP地址"
            />
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="form.port" />
          </el-form-item>
          <el-form-item label="数据库" prop="db">
            <el-input
              v-model="form.db"
              placeholder="数据库名称"
            />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="close">关闭</el-button>
          <el-button v-loading="isloading" @click="connect(form)">连接测试</el-button>
          <el-button type="primary" @click="submit(form)">确定</el-button>
        </span>
      </el-dialog>
      <div class="data-source__table">
        <div class="data-source__list">
          <el-table
            ref="singleTable"
            :data="dataSourceList.list"
            class="tableBox"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              label="我的数据源"
            >
              <template #header>
                <div class="table-title">
                  <span>我的数据源</span>
                  <el-input
                    v-model="search"
                    :placeholder="`共${dataSourceList.total}个文件`"
                    prefix-icon="el-icon-search"
                    class="input"
                    @keyup.enter.native="searchSource"
                  />
                </div>
              </template>
              <template slot-scope="scope">
                <div class="table-row">
                  <div class="table-row__image">
                    <svg-icon :icon-class="scope.row.type" />
                  </div>
                  <div class="table-row__text">
                    <div>{{ scope.row.displayName }}</div>
                    <div>所有者：{{ scope.row.creator && scope.row.creator.userName || '-' }}</div>
                  </div>
                  <div class="table-row__tools">
                    <span v-if="scope.row.type!=='file'" @click.prevent="editSource(scope.row)">
                      <svg-icon icon-class="pencil" />
                    </span>
                    <span v-if="scope.row.type!=='file'" @click="deleteSource(scope.row._id)">
                      <svg-icon icon-class="delete" />
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="data-file__list">
          <div class="research-file">
            <el-input
              v-model="searchFile"
              placeholder="请输入文件名称"
              prefix-icon="el-icon-search"
              class="input-file"
              @keyup.enter.native="searchFiles"
            />
            <span>
              <el-button plain class="create-data">SQL创建数据集</el-button>
            </span>
          </div>
          <common-table
            :table-columns="tableColums"
            :table-data="sourceFile"
            :page-num.sync="page"
            :page-size.sync="limit"
            :total="total"
            :is-show-toolbar="false"
            @refresh="refresh"
          >
            <template #name="{scope}">
              {{ scope.row.name }}
            </template>
            <template #comment="{scope}">
              {{ scope.row.name }}
            </template>
            <template #operation="{scope}">
              <div class="operate">
                <span @click="createData(scope.row)">创建数据集</span>
                <el-divider direction="vertical" />
                <span @click="detail(scope.row)">详情</span>
              </div>
            </template>
          </common-table>
          <el-dialog
            title="表详情"
            :visible.sync="detailVisible"
            width="560px"
          >
            <p>表名称：{{ tableName }}</p>
            <p>表描述：{{ comment }}</p>
            <el-table
              :data="detailColumns"
              height="250"
              style="width: 100%"
            >
              <el-table-column
                prop="columnName"
                label="字段名称"
                width="180" />
              <el-table-column
                prop="columnType"
                label="字段类型"
                width="180" />
              <el-table-column
                prop="columnComment"
                label="字段描述" />
            </el-table>
            <span slot="footer">
              <el-button type="primary" @click="detailVisible = false">关闭</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encryptAes } from '@/utils/encrypt'
import { getDataSourceList, getSourceFile, deleteSources, connectTest, postDataSourceList, editSources, detailSource } from '@/api/dataSource'
import CommonTable from '@/components/CommonTable/index.vue'
export default {
  name: 'DataSource',
  components: {
    CommonTable
  },
  data() {
    return {
      detailTable: {
        tableName: '',
        comment: '',
        columns: [
          {}
        ]
      },
      tableName: '',
      comment: '',
      detailColumns: [],
      detailInfo: {},
      ids: '',
      detailVisible: false,
      isPaging: 1,
      page: 1,
      limit: 20,
      sortBy: '',
      sortOrder: '',
      searchkey: '',
      isloading: false,
      notEdit: true,
      editform: {},
      currentRow: 0,
      dialogVisible: false,
      fileType: {
        'mysql': 'mySql数据源',
        'mongodb': 'MongoDB数据源',
        'file': '本地数据源'
      },
      status: '',
      search: '',
      searchFile: '',
      dataSourceList: {},
      sourceFile: [],
      total: 0,
      form: {
        type: '',
        displayName: '',
        host: '',
        port: '',
        db: '',
        username: '',
        password: ''
      },
      rules: {
        displayName: [{ required: true, message: '请输入数据源配置列表显示名称', trigger: 'blur' }],
        host: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        db: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      tableColums: [
        {
          prop: 'name',
          label: '名称',
          fixed: false,
          sortable: true
        },
        {
          prop: 'comment',
          label: '备注',
          fixed: false
        },
        {
          prop: 'operation',
          label: '操作',
          slot: 'operation',
          fixed: 'right'
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    close() {
      this.$refs['form'].clearValidate()
      this.dialogVisible = false
    },
    async detailSources() {
      try {
        this.tableName = this.detailInfo.name
        const params = {
          id: this.currentRow._id,
          tableName: this.detailInfo.name
        }
        this.detailTable = await detailSource(params)
        this.detailColumns = this.detailTable.columns
        this.tableName = this.detailTable.tableName
        this.comment = this.detailTable.comment
        this.detailColumns.forEach(function (value) { value.columnType = value.columnType.toUpperCase() })
      } catch (error) {
        console.log(error)
      }
    },
    async editSource(row) {
      try {
        this.notEdit = false
        this.status = '编辑'
        this.form.type = row.type
        console.log('form.type', this.form.type)
        this.form.displayName = row.displayName
        this.form.host = row.host
        this.form.port = row.port
        this.form.db = row.db
        this.form.username = row.username
        this.form.password = ''
        this.currentId = row._id
        this.dialogVisible = true
      } catch (error) {
        console.log(error)
      }
    },
    async getSourceFile(ids) {
      try {
        const params = {
          isPaging: this.isPaging,
          page: this.page,
          limit: this.limit,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          searchkey: this.searchkey
        }
        const file = await getSourceFile(ids, params)
        this.sourceFile = file.list
        this.total = file.total
        this.page = file.page
        this.limit = file.limit
      } catch (error) {
        console.log(error)
      }
    },
    searchSource() {
      this.init()
    },
    searchFiles() {
      this.searchkey = this.searchFile
      this.refresh()
    },
    refresh() {
      this.handleCurrentChange(this.currentRow)
    },
    async handleCurrentChange(val) {
      try {
        this.currentRow = val
        const ids = val._id
        await this.getSourceFile(ids)
      } catch (error) {
        console.log(error)
      }
    },
    createData(val) {
      console.log(val)
    },
    detail(val) {
      this.detailVisible = true
      this.detailInfo = val
      this.detailSources()
    },
    async init() {
      try {
        this.form = {
          type: '',
          displayName: '',
          host: '',
          port: '',
          db: '',
          username: '',
          password: ''
        }
        const res = await getDataSourceList({ searchkey: this.search })
        this.dataSourceList = res
        this.$refs.singleTable.setCurrentRow(this.dataSourceList.list[0])
      } catch (error) {
        console.log(error)
      }
    },
    async deleteSource(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        deleteSources(id)
        this.init()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCommand(command) {
      this.status = '添加'
      this.notEdit = true
      this.form = {
        type: '',
        displayName: '',
        host: '',
        port: '',
        db: '',
        username: '',
        password: ''
      }
      this.dialogVisible = true
      if (command === 'mysql') {
        this.form.type = 'mysql'
      }
      if (command === 'mongoDB') {
        this.form.type = 'mongodb'
      }
      if (command === 'localFile') {
        this.form.type = 'file'
      }
    },
    async connect(form) {
      this.isloading = true
      const testForm = {
        username: form.username,
        db: form.db,
        host: form.host,
        password: encryptAes(form.password),
        port: form.port,
        type: form.type
      }
      try {
        const result = await connectTest(testForm)
        if (!result) {
          this.$message.error('连接数据库失败！')
        } else {
          this.$message.success('连接数据库成功！')
        }
        this.isloading = false
        return result
      } catch (error) {
        this.isloading = false
        console.log(error)
      }
    },
    async submit(form) {
      const valid = await this.$refs.form.validate()
      if (!valid) {
        return
      }
      try {
        form.password = encryptAes(form.password)
        const result = await connectTest(form)
        if (result === true) {
          this.dialogVisible = false
          if (this.notEdit) {
            await postDataSourceList(form)
          } else {
            await editSources(this.currentId, this.form)
          }
          this.init()
        } else {
          this.$message.error('连接数据库失败！')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.operate {
  color: #FA8334;
  span {
    cursor: pointer;
  }
}
.table-row {
  display: flex;
  height: 50px;
  line-height: 25px;
  &__image {
    flex: 1;
    font-size: 32px;
    line-height: 50px;
  }
  &__text {
    flex: 1
  }
  &__tools {
    flex: 2;
    text-align: right;
    line-height: 68px;
    span {
      margin-right: 20px;
      cursor:pointer;
    }
  }
}
.input {
  width: 249px;
}
.input-file {
  width: 183px;
}
.table-title {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: rgba(0,0,0,0.90);
  text-align: left;
  font-weight: 500;
}
.research-file {
  display: flex;
  justify-content: flex-end;
  line-height: 68px;
}
.head-title {
  margin: 1.7%;
}
.create-data {
  margin: 0 16px 0 12px;
}
::v-deep .el-table td {
  height: 42px
}
::v-deep .el-table th {
  height: 42px
}
.data-source {
  height: 100%;
  width: 100%;

  &__title {
    height: 20px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 20px;
    font-weight: 500;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    height: 68px;
    border-bottom: 1px solid #EBEEF5;
  }

  &__content {
    position: relative;
    background: #fff;
    margin-top: 16px;
    height: calc(100vh - 50px);
    font-size: 12px;
  }

  &__table {
    display: flex;
  }

  &__list {
    flex: 1;
    height: calc(100vh - 168px);
    overflow: auto
  }
}
.data-file__list {
  flex: 2;
  border-left: 1px solid #EBEEF5;
  height: calc(100vh - 168px);
  overflow: auto
}
.head-select {
  margin: 1.7%;
  font-size: 12px;
}
.el-button {
  font-size: 12px;
}
</style>
