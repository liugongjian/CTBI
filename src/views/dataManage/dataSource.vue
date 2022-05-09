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
                    <div class="table-row__text-part1" :title="scope.row.displayName">{{ scope.row.displayName }}</div>
                    <div class="table-row__text-part1" :title="scope.row.creator && scope.row.creator.userName || '-'">所有者：{{ scope.row.creator && scope.row.creator.userName || '-' }}</div>
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
        <dataFiles v-if="isShowDataFiles" ref="dataFiles" class="data-file__list" />
        <div v-else class="data-file__list">
          <div class="research-file">
            <el-input
              v-model="searchFile"
              placeholder="请输入文件名称"
              prefix-icon="el-icon-search"
              class="input-file"
              @keyup.enter.native="searchFiles"
            />
            <span>
              <el-button plain class="create-data" @click="toCreateDataSet">SQL创建数据集</el-button>
            </span>
          </div>
          <common-table
            :table-columns="tableColums"
            :table-data="sourceFile"
            :page-num.sync="page"
            :page-size.sync="limit"
            :total="total"
            :is-show-toolbar="false"
            @sort-change="handleSortChange"
            @refresh="refresh"
          >
            <template #name="{scope}">
              {{ scope.row.name }}
            </template>
            <template #comment="{scope}">
              <el-tooltip class="item" effect="dark" :content="scope.row.comment" placement="top">
                <span class="description">{{ scope.row.comment }} </span>
              </el-tooltip>
            </template>
            <template #operation="{scope}">
              <div class="operate">
                <span @click="() => toCreateDataSet(currentRow)">创建数据集</span>
                <el-divider direction="vertical" />
                <span @click="detail(scope.row)">详情</span>
              </div>
            </template>
          </common-table>
          <el-dialog
            title="表详情"
            :visible.sync="detailVisible"
          >
            <p class="part"><span class="table-title-name">表名称：</span>{{ tableName }}</p>
            <p class="part"><span class="table-title-name">表备注：</span>{{ detailComment }}</p>
            <common-table
              :table-columns="comments"
              :table-data="detailColumns"
              :is-show-toolbar="false"
              :is-show-pagination="false"
            >
              <template #columnName />
              <template #columnType />
              <template #comment />
            </common-table>
            <span slot="footer">
              <el-button @click="detailVisible = false">关闭</el-button>
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
import { getDateTime } from '@/utils/optionUtils'
import dataFiles from './dataFiles.vue'
export default {
  name: 'DataSource',
  components: {
    CommonTable,
    dataFiles
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
      detailComment: '',
      detailColumns: [],
      detailInfo: {},
      ids: '',
      detailVisible: false,
      isPaging: 1,
      page: 1,
      limit: 20,
      sortBy: 'name',
      sortOrder: 'asc',
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
      comments: [
        {
          prop: 'columnName',
          label: '字段名称',
          fixed: false
        },
        {
          prop: 'columnType',
          label: '字段类型',
          fixed: false
        },
        {
          prop: 'comment',
          label: '字段描述',
          fixed: false
        }
      ],
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
          slot: 'comment',
          fixed: false,
          ellipsis: true
        },
        {
          prop: 'operation',
          label: '操作',
          slot: 'operation',
          fixed: 'right'
        }
      ],
      isShowDataFiles: false
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
    toCreateDataSet(dataSource) {
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
        dataSourceId: dataSource && dataSource._id || '',
        dataSourceName: dataSource && dataSource.displayName || '',
        creatorName: '',
        createdTime: currentTime
      }
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
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
        this.detailComment = this.detailTable.comment
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
        this.sourceFile = []
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
        if (val.type === 'file') {
          this.isShowDataFiles = true
          this.$nextTick(() => {
            this.$refs.dataFiles.getDataFiles()
          })
        } else {
          this.isShowDataFiles = false
          const ids = val._id
          await this.getSourceFile(ids)
        }
      } catch (error) {
        console.log(error)
      }
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
        const [firstRow] = res.list
        if (firstRow.type === 'file') {
          this.isShowDataFiles = true
        } else {
          this.isShowDataFiles = false
        }
        this.$refs.singleTable.setCurrentRow(firstRow)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteSource(id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteSources(id)
        await this.init()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
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
      if (command === 'mysql') {
        this.form.type = 'mysql'
        this.dialogVisible = true
        this.notEdit = true
      }
      if (command === 'mongoDB') {
        this.form.type = 'mongodb'
        this.dialogVisible = true
        this.notEdit = true
      }
      if (command === 'localFile') {
        this.fileType = '添加本地数据源'
        this.$dialog.show('UploadFileDialog', {}, () => {
          if (this.isShowDataFiles) {
            this.$refs.dataFiles.getDataFiles()
          }
        })
      }
    },
    handleSortChange({ prop, order }) {
      this.sortBy = prop
      if (order) {
        this.sortOrder = order === 'ascending' ? 'asc' : 'desc'
      } else {
        this.sortOrder = 'desc'
      }
      this.getSourceFile(this.currentRow._id)
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
        const testForm = {
          displayName: form.displayName,
          username: form.username,
          db: form.db,
          host: form.host,
          password: encryptAes(form.password),
          port: form.port,
          type: form.type
        }
        const result = await this.connect(form)
        if (result === true) {
          this.dialogVisible = false
          if (this.notEdit) {
            await postDataSourceList(testForm)
          } else {
            await editSources(this.currentId, testForm)
          }
          this.init()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.part {
  margin-bottom: 1em;
}
.table-title-name {
  width: 48px;
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0,0,0,0.90);
  font-weight: 400;
}
.operate {
  color: #FA8334;
  span {
    cursor: pointer;
  }
}
.table-row {
  display: flex;
  align-items: center;
  height: 50px;
  margin-right:10px;
  &__image {
    width:32px;
    margin-right: 15px;
    font-size: 32px;
  }
  &__text {
    flex: 1;
    text-align: left;
    overflow:hidden;
  }
  &__tools {
    width:65px;
    text-align: right;
    span{
      cursor:pointer;
      &:not(:last-of-type) {
        margin-right: 20px;
      }
    }
  }
  &__text-part1 {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  align-items: center;
  justify-content: space-between;
  height: 50px;
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
  margin:24px;
}
.create-data {
  margin: 0 0 0 12px;
}
::v-deep .el-table td {
  height: 42px;
  padding-left: 16px
}
::v-deep .el-table th {
  height: 42px;
  padding-left: 16px
}
.data-source {
  height: 100%;
  width: 100%;

  &__title {
    height: 20px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
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
    min-width:270px;
    overflow: auto;
  }
}
.data-file__list {
  flex: 2;
  padding: 24px;
  border-left: 1px solid #EBEEF5;
  height: calc(100vh - 168px);
  overflow: auto;
}
.head-select {
  margin: 24px;
  font-size: 12px;
}
.el-button {
  font-size: 12px;
}
.description {
  cursor: pointer;
}
</style>
