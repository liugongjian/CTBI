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
        width="560px">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="显示名称" prop="displayName">
            <el-input
              v-model="form.displayName"
              placeholder="请输入数据源配置列表显示名称" />
          </el-form-item>
          <el-form-item label="数据库地址" prop="host">
            <el-input
              v-model="form.host"
              placeholder="请输入IP地址" />
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="form.port" />
          </el-form-item>
          <el-form-item label="数据库" prop="db">
            <el-input
              v-model="form.db"
              placeholder="数据库名称" />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit(form)">确定</el-button>
            <el-button type="primary" @click="dialog = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div class="data-source__table">
        <div class="data-source__list">
          <div class="table-title">
            <span>我的数据源</span>
            <el-input
              v-model="search"
              placeholder="共文件"
              prefix-icon="el-icon-search"
              class="input"
            />
          </div>
          <el-table>
            <div>hah</div>
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
              <el-button plain class="create-data">SQL创建数据集</el-button>
            </span>
          </div>
          <el-table>
            <div>hah</div>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataSourceList, getDataFileList, postDataSourceList } from '@/api/dataSource'
export default {
  name: 'DataSource',
  data() {
    return {
      dialog: false,
      fileType: '',
      search: '',
      searchFile: '',
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
  mounted() {
    this.getDataSourceL()
    this.getDataFileL()
  },
  methods: {
    async getDataSourceL() {
      await getDataSourceList()
    },
    async getDataFileL() {
      await getDataFileList()
    },
    handleCommand(command) {
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
    async submit(form) {
      this.dialog = false
      await postDataSourceList(form)
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 249px;
}
.input-file {
  width: 183px;
}
.table-title {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  line-height: 68px;
  border: 1px solid #EBEEF5;
}
.research-file {
  display: flex;
  justify-content: flex-end;
  line-height: 68px;
}
.head-title {
  padding: 16px;
}
.create-data {
  margin: 0 16px 0 12px;
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
    justify-content: space-between
  }

  &__content {
    position: relative;
    background: #fff;
    margin-top: 16px;
    height: calc(100vh - 50px);
    font-size: 12px;
  }

  &__table {
    display: flex
  }

  &__list {
    flex: 1
  }
}
.data-file__list {
  flex: 2;
  border: 1px solid #EBEEF5;
}
.head-select {
  font-size: 12px;
}
.el-button {
  font-size: 12px;
}
</style>
