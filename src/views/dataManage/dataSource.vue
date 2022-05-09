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
        :title="fileType"
        :visible.sync="dialog"
        width="560px"
      >
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="120px"
        >
          <el-form-item
            label="显示名称"
            prop="displayName"
          >
            <el-input
              v-model="form.displayName"
              placeholder="请输入数据源配置列表显示名称"
            />
          </el-form-item>
          <el-form-item
            label="数据库地址"
            prop="host"
          >
            <el-input
              v-model="form.host"
              placeholder="请输入IP地址"
            />
          </el-form-item>
          <el-form-item
            label="端口"
            prop="port"
          >
            <el-input v-model="form.port" />
          </el-form-item>
          <el-form-item
            label="数据库"
            prop="db"
          >
            <el-input
              v-model="form.db"
              placeholder="数据库名称"
            />
          </el-form-item>
          <el-form-item
            label="用户名"
            prop="username"
          >
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submit(form)"
            >确定</el-button>
            <el-button
              type="primary"
              @click="dialog = false"
            >关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div class="data-source__table">
        <div class="data-source__list">
          <el-table
            :data="dataSourceList.list"
            class="tableBox"
          >
            <el-table-column label="我的数据源">
              <template slot="header">
                <div class="table-title">
                  <span>我的数据源</span>
                  <el-input
                    v-model="search"
                    :placeholder="`共个文件`"
                    prefix-icon="el-icon-search"
                    class="input"
                  />
                </div>
              </template>
              <template slot-scope="scope">
                <div class="table-row">
                  <div class="table-row__image">
                    <svg-icon :icon-class="scope.row.type" />
                  </div>
                  <div class="table-row__text">
                    <div v-if="scope.row.type=='mongodb'">MongoDB数据库</div>
                    <div v-if="scope.row.type=='mysql'">MySQL数据库</div>
                    <div>所有者：开发者中心</div>
                  </div>
                  <div class="table-row__tools">
                    <span>
                      <svg-icon icon-class="pencil" />
                    </span>
                    <span @click="deleteSource(scope.row._id)">
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
            />
            <span>
              <el-button
                plain
                class="create-data"
              >SQL创建数据集</el-button>
            </span>
          </div>
          <el-table
            :default-sort="{prop: 'name', order: 'descending'}"
            :data="(sourceFile.list).slice((currentPage-1)*pageSize,currentPage*pageSize)"
          >
            <el-table-column
              sortable
              label="名称"
              prop="name"
            />
            <el-table-column
              label="备注"
              prop="name"
            />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="operate">
                  <span @click="createData(scope.row)">创建数据集</span>
                  <el-divider direction="vertical" />
                  <span @click="detail(scope.row)">详情</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="currentPage"
            :page-sizes="[10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="sourceFile.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encryptAes } from '@/utils/encrypt'
import { getDataSourceList, postDataSourceList, getSourceFile, deleteSources } from '@/api/dataSource'
export default {
  name: 'DataSource',
  data () {
    return {
      currentPage: 1,
      pageSize: 20,
      dialog: false,
      fileType: '',
      search: '',
      searchFile: '',
      dataSourceList: {},
      sourceFile: { list: [] },
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
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    createData (val) {
      console.log(val)
    },
    detail (val) {
      console.log(val)
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      console.log(`current page: ${val}`)
    },
    async init () {
      try {
        const res = await getDataSourceList()
        this.dataSourceList = res
        if ((res.list).length !== 0) {
          const result = res.list
          const ids = result[0]._id
          const file = await getSourceFile(ids)
          this.sourceFile = file
          console.log('file---', file)
        }
      } catch (error) {
        console.log(error)
      }
      this.form = {
        type: '',
        displayName: '',
        host: '',
        port: '',
        db: '',
        username: '',
        password: ''
      }
    },
    async deleteSource (id) {
      console.log(id)
      await deleteSources(id)
      this.init()
    },
    handleCommand (command) {
      this.dialog = true
      if (command === 'mysql') {
        this.fileType = '添加mySql数据源'
        this.form.type = 'mysql'
      }
      if (command === 'mongoDB') {
        this.fileType = '添加MongoDB数据源'
        this.form.type = 'mongodb'
      }
      if (command === 'localFile') {
        this.fileType = '添加本地数据源'
      }
    },
    async submit (form) {
      this.dialog = false
      form.password = encryptAes(form.password)
      try {
        await postDataSourceList(form)
        this.init()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.operate {
  color: #fa8334;
  span {
    cursor: pointer;
  }
}
.table-row {
  display: flex;
  height: 68px;
  line-height: 34px;
  &__image {
    flex: 1;
    font-size: 32px;
    line-height: 68px;
  }
  &__text {
    flex: 1;
  }
  &__tools {
    flex: 2;
    text-align: right;
    line-height: 68px;
    span {
      margin-right: 20px;
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
  line-height: 68px;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.9);
  text-align: left;
  line-height: 42px;
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
  height: 68px;
}
::v-deep .el-table th {
  height: 68px;
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
    border-bottom: 1px solid #ebeef5;
  }

  &__content {
    position: relative;
    background: #fff;
    margin-top: 16px;
    height: calc(100% - 50px);
    font-size: 12px;
  }

  &__table {
    display: flex;
  }

  &__list {
    flex: 1;
  }
}
.data-file__list {
  flex: 2;
  border-left: 1px solid #ebeef5;
}
.head-select {
  margin: 1.7%;
  font-size: 12px;
}
.el-button {
  font-size: 12px;
}
</style>
