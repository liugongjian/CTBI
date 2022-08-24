<template>
  <div class="data-source">
    <!-- <div class="data-source__title">
      <span>数据源</span>
    </div> -->
    <div class="data-source__content">
      <div class="data-source__header">
        <div class="head-title">数据源</div>
        <div class="head-select">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" icon="el-icon-plus" class="new-button">
              <span class="newFile">新建数据源</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="mysql">MySQL</el-dropdown-item>
              <!-- <el-dropdown-item command="mongoDB">MongoDB</el-dropdown-item> -->
              <el-dropdown-item command="localFile">本地文件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-dialog
        :title="status+fileType[form.type]"
        :visible.sync="dialogVisible"
        width="560px"
        class="dialog-new"
      >
        <el-form ref="form" :rules="rules" :model="form" label-width="90px">
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
              placeholder="请输入数据库名称"
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
          <el-button v-loading="connectLoading" @click="connect(form)">连接测试</el-button>
          <el-button type="primary" @click="submit(form)">确定</el-button>
        </span>
      </el-dialog>
      <div class="data-source__table">
        <div class="data-source__list">
          <el-table
            ref="singleTable"
            v-loading="dataSourceLoading"
            :data="filterdDatasources"
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
                    <div class="table-row__text-part2" :title="scope.row.creator && scope.row.creator.userName || '-'">所有者：{{ scope.row.creator && scope.row.creator.userName || '-' }}</div>
                  </div>
                  <div class="table-row__tools">
                    <span v-if="scope.row.type!=='file'" @click.stop="editSource(scope.row)">
                      <svg-icon icon-class="pencil" />
                    </span>
                    <span v-if="scope.row.type!=='file'" @click="deleteSource(scope.row)">
                      <svg-icon icon-class="delete" />
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <dataFiles v-if="isShowDataFiles" ref="dataFiles" class="data-files__lists" :current-row="currentRow" />
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
              <el-button class="create-data" @click="toCreateDataSet(currentRow)">SQL创建数据集</el-button>
            </span>
          </div>
          <common-table
            v-loading="tableListLoading"
            :table-columns="tableColums"
            :table-data="sourceFile"
            :page-num.sync="page"
            :page-size.sync="limit"
            :total="total"
            :is-show-toolbar="false"
            @refresh="refresh"
          >
            <!-- @sort-change="handleSortChange" -->
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
            width="1000px"
            height="481px"
          >
            <p class="part"><span class="table-title-name">表名称：</span><span class="table-content">{{ tableName }}</span></p>
            <p class="part"><span class="table-title-name">表备注：</span><span class="table-content">{{ detailComment }}</span></p>
            <common-table
              :table-columns="comments"
              :table-data="detailColumns"
              :is-show-toolbar="false"
              :is-show-pagination="false"
              class="table-detail"
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
import dataFiles from './dataFiles.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'DataSource',
  components: {
    CommonTable,
    dataFiles
  },
  data() {
    return {
      tableListLoading: false,
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
      // sortBy: 'name',
      // sortOrder: 'asc',
      searchkey: '',
      connectLoading: false,
      dataSourceLoading: false,
      notEdit: true,
      editform: {},
      currentRow: '',
      dialogVisible: false,
      fileType: {
        'mysql': 'MySQL数据源',
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
          fixed: false,
          ellipsis: true
        }
      ],
      tableColums: [
        {
          prop: 'name',
          label: '名称',
          fixed: false
          // sortable: true
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
          width: 220,
          fixed: 'right'
        }
      ],
      isShowDataFiles: false
    }
  },
  computed: {
    filterdDatasources() {
      return this.dataSourceList?.list?.filter(item => {
        return this.search ? item.displayName.indexOf(this.search) >= 0 : true
      }) || []
    },
    ...mapGetters([
      'role'
    ])
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
      const query = {
        dataSourceId: dataSource && dataSource._id || ''
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
        this.tableListLoading = true
        const params = {
          isPaging: this.isPaging,
          page: this.page,
          limit: this.limit,
          // sortBy: this.sortBy,
          // sortOrder: this.sortOrder,
          searchkey: this.searchkey
        }
        const file = await getSourceFile(ids, params)
        this.sourceFile = file.list
        this.total = file.total
        this.page = file.page
        this.limit = file.limit
        this.tableListLoading = false
      } catch (error) {
        console.log(error)
        this.sourceFile = []
        this.tableListLoading = false
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
        if (!val) {
          return
        }
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
    async getDatasource() {
      this.dataSourceLoading = true
      const res = await getDataSourceList({ searchkey: this.search })
      this.dataSourceList = res
      this.dataSourceLoading = false
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
        await this.getDatasource()
        const [firstRow] = this.dataSourceList.list
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
    async deleteSource(column) {
      try {
        const id = column._id
        const name = column.displayName
        await this.$confirm('确定删除' + name + '数据源?', '提示', {
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
        console.log(err)
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
        // this.form.type = 'mysql'
        this.$set(this.form, 'type', 'mysql')
        this.$set(this.form, 'port', '3306')
        this.dialogVisible = true
        this.notEdit = true
      }
      if (command === 'mongoDB') {
        this.$set(this.form, 'type', 'mongodb')
        this.$set(this.form, 'port', '27017')
        this.dialogVisible = true
        this.notEdit = true
      }
      if (command === 'localFile') {
        this.$dialog.show('UploadFileDialog', {}, () => {
          const currentRow = this.filterdDatasources.find(item => item.type === 'file')
          this.$refs.singleTable.setCurrentRow(currentRow)
          this.isShowDataFiles = true
          this.$nextTick(() => {
            this.$refs.dataFiles.getDataFiles()
          })
        })
      }
    },
    // handleSortChange({ prop, order }) {
    //   this.sortBy = prop
    //   if (order) {
    //     this.sortOrder = order === 'ascending' ? 'asc' : 'desc'
    //   } else {
    //     this.sortOrder = 'desc'
    //   }
    //   this.getSourceFile(this.currentRow._id)
    // },
    async connect(form) {
      try {
        const valid = await this.$refs.form.validate()
        if (!valid) {
          return
        }
        this.connectLoading = true
        const testForm = {
          username: form.username,
          db: form.db,
          host: form.host,
          password: encryptAes(form.password),
          port: form.port,
          type: form.type
        }
        const result = await connectTest(testForm)
        if (!result) {
          this.$message.error('连接数据库失败！')
        } else {
          this.$message.success('连接数据库成功！')
        }
        this.connectLoading = false
        return result
      } catch (error) {
        this.connectLoading = false
        console.log(error)
      }
    },
    async submit(form) {
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
            const newForm = await postDataSourceList(testForm)
            await this.getDatasource()
            const currentRow = this.filterdDatasources.find(item => item._id === newForm._id)
            this.$refs.singleTable.setCurrentRow(currentRow)
          } else {
            await editSources(this.currentId, testForm)
            await this.getDatasource()
            const currentRow = this.filterdDatasources.find(item => item._id === this.currentId)
            this.$refs.singleTable.setCurrentRow(currentRow)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .common-table .table.el-table th .cell {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: rgba(0,0,0,0.90);
  text-align: left;
  height: 32px;
  line-height: 32px;
  font-weight: 500;
}
::v-deep .common-table .table.el-table td .cell {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  text-align: left;
  height: 32px;
  line-height: 32px;
  font-weight: 400;
}
.table-detail {
  width: 950px;
  height: 300px;
  overflow: auto;
}
.new-button {
  width: 124px;
  height: 32px;
  background: #FA8334;
  border-radius: 2px;
}
::v-deep .el-dropdown {
  height: 48px;
}
.newFile {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #FFFFFF;
  text-align: left;
  font-weight: 400;
}
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
.table-content {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0,0,0,0.65);
  line-height: 20px;
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
  margin-right: 10px;
  &__image {
    width:32px;
    margin-right: 15px;
    font-size: 32px;
  }
  &__text {
    flex: 1;
    text-align: left;
    overflow: hidden;
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
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: rgba(0,0,0,0.90);
    font-weight: 500;
  }
   &__text-part2 {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    font-weight: 400;
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
  line-height: 66px;
}
.head-title {
  position: absolute;
  left: 24px;
  line-height: 68px;
}
.create-data {
  color: #FA8334;
  margin: 0 0 0 12px;
}
::v-deep .el-table td {
  height: 42px;
  padding-left: 14px
}
::v-deep .el-table th {
  height: 42px;
  padding-left: 14px
}
::v-deep .el-dialog__title {
  width: 155px;
  height: 22px;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(0,0,0,0.90);
  font-weight: 500;
}

::v-deep label.el-form-item__label {
  height: 32px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0,0,0,0.90);
  line-height: 32px;
  font-weight: 400;
}
::v-deep .dialog-new .el-dialog__body {
  padding: 24px 24px 0 24px
}
::v-deep .dialog-new .el-input__inner {
  width: 423px;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid rgba(221,221,221,1);
  border-radius: 2px;
}
::v-deep .dialog-new .el-input__inner::-webkit-input-placeholder {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0,0,0,0.30);
  line-height: 32px;
  font-weight: 400;
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
    position: relative;
    height: 68px;
    border-bottom: 1px solid #EBEEF5;
  }

  &__content {
    position: relative;
    background: #fff;
    height: calc(100vh - 100px);
    font-size: 12px;
  }

  &__table {
    display: flex;
  }

  &__list {
    flex: 1;
    height: calc(100vh - 250px);
    min-width:270px;
    overflow: auto;
  }
}
.data-files__lists {
  flex: 2;
  padding-left: 10px;
  border-left: 1px solid #EBEEF5;
  height: calc(100vh - 250px);
  overflow: auto;

}
.data-file__list {
  flex: 2;
  padding: 0 24px 10px 15px;
  border-left: 1px solid #EBEEF5;
  height: calc(100vh - 250px);
  overflow: auto;
}
.data_file {
  padding: 0
}
.head-select {
  position: absolute;
  right: 24px;
  font-size: 12px;
  line-height: 68px;
}
.el-button {
  font-size: 12px;
}
.description {
  cursor: pointer;
}
</style>
<style lang="scss">
.el-message-box__message p {
  word-wrap: break-word;
}
</style>
