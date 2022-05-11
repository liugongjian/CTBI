<template>
  <div class="edit-wrap bg-c-fff">
    <!-- header -->
    <div class="edit-wrap-header">
      <div>
        <i
          class="el-icon-arrow-left h-c-p m-r-8"
          @click="$router.go(-1)"
        />
        <span>{{ dataInfo.displayName || '未命名' }}</span>
      </div>
      <div class="edit-wrap-header-r">
        <el-button
          type="primary"
          @click="showSaveDialog"
        >保存</el-button>
      </div>
    </div>

    <!-- main -->
    <div>
      <div
        v-show="toggleContent"
        class="d-f p-16-16 f-b-s bg-c-f8f8f8"
      >
        <div class="d-f">
          <div>
            <svg-icon
              icon-class="sql"
              style="margin-right: 8px;width:20px;height:32px;"
            />
          </div>
          <el-input
            v-model="dataInfo.displayName"
            placeholder="未命名SQL"
          />
        </div>
        <div>
          <el-button
            icon="el-icon-disk"
            plain
            @click="formatSqlData"
          >格式化</el-button>
          <el-button
            plain
            icon="el-icon-volume"
            @click="settingParam"
          >参数配置</el-button>
          <el-button
            type="primary"
            icon="el-icon-video-play"
            @click="runSql"
          >运行</el-button>
          <el-button
            type="primary"
            @click="confirmEdit"
          >确认编辑</el-button>
          <el-button
            type="text"
            @click="checkExit"
          ><i class="el-icon-close" /></el-button>
        </div>
      </div>

      <div class="d-f">
        <div :class="[{'full-height': !toggleContent}, 'side-bar']">
          <div class="side-top">
            <div v-if="toggleContent">
              <div class="side-top-label"><span>选择数据源</span></div>
              <el-select
                v-model="dataInfo.dataSourceId"
                placeholder="请选择"
                @change="handleChangeDataSource"
              >
                <el-option
                  v-for="item in dataSourceOptions"
                  :key="item._id"
                  :label="item.displayName"
                  :value="item._id"
                />
              </el-select>
            </div>
            <div v-else>
              <div class="side-top-label"><span>当前数据源</span></div>
              <div><span class="side-top-text">{{ dataInfo.dataSourceName }}</span></div>
            </div>
          </div>
          <div class="side-content">
            <div class="side-content-title">
              <span>数据表</span>
            </div>
            <table-list
              v-loading="dataTableLoading"
              :table-list="dataTableList"
              :toggle-content="toggleContent"
            />
          </div>
        </div>

        <div class="main-panel">
          <!-- SQL编辑器 -->
          <div :class="[{'full-height': !toggleContent}, 'main-edit']">
            <EditSql
              ref="sqlEdit"
              :tables="hintOptions"
              :value="currentSqlStatement"
              @changeTextarea="sqlStatementChange($event)"
            />
          </div>

          <!-- 执行结果 & 数据预览 -->
          <div
            class="draggable-container"
            :style="draggableContainerHeight"
          >
            <!-- 收缩按钮 -->
            <div
              class="shrink-btn bg-c-fff"
              @click="resizeContainer"
            >
              <i :class="{'el-icon-arrow-up': isShrink, 'el-icon-arrow-down': !isShrink}" />
            </div>
            <div
              class="drag-handler"
              draggable
              @drag.stop="drag"
              @dragend.stop="dragend"
            >
              <div class="drag-handler-inner" />
            </div>
            <!-- 运行记录 -->
            <runner
              v-show="toggleContent"
              v-loading="resultPreviewLoading"
              :result-data="resultData"
              :history-log-table-data="historyLogTableData"
            />
            <!-- 数据预览 -->
            <resetter
              v-show="!toggleContent"
              :fields="dataInfo.fields"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { format } from 'sql-formatter'
import Runner from '@/views/dataManage/dataSet/dataSetEdit/Runner'
import Resetter from '@/views/dataManage/dataSet/dataSetEdit/Resetter'
import TableList from '@/views/dataManage/dataSet/dataSetEdit/TableList'
import EditSql from '@/components/SqlEditor/index.vue'
import { getDataSetsInfo, runtimeForSql, getSqlVariables, getSqlRunningLogs, confirmEditSql, getDataSourceData, dataFiles, getDataTable } from '@/api/dataSet'

export default {
  components: { Runner, Resetter, TableList, EditSql },
  data () {
    return {
      dataInfo: {
        _id: '',
        // 脚本集名称
        displayName: '',
        // 数据源id
        dataSourceId: '',
        // 数据源名称
        dataSourceName: '',
        // 数据源类型
        dataSourceType: '',
        // 脚本集SQL信息
        sql: { _id: '', sql: '' }
      },
      // sql 编辑器提示语合集
      hintOptions: {},
      // sql脚本
      currentSqlStatement: '',
      // 展示预览 & 运行记录
      toggleContent: true,
      // 数据源下拉框选值
      dataSourceOptions: [],
      // 表格数据组
      dataTableList: [],
      // 左侧表格查询loading
      dataTableLoading: false,
      // 收缩
      isShrink: false,
      draggableContainerHeight: { height: '50%' },
      // 运行结果集
      resultData: { success: true },
      resultPreviewLoading: false,
      // 历史记录集
      historyLogTableData: []
    }
  },
  watch: {
    dataInfo: {
      handler (n, o) {
        console.log('dataInfo改变', n)
      }
    }
  },
  created () {
    const data = this.$route.query
    if (data._id) {
      this.getDetail()
    }
  },
  methods: {
    // 获取数据集详情
    async getDetail () {
      const result = await getDataSetsInfo(this.$route.query._id)
      Object.assign(this.dataInfo, result)
      // 映射sql
      this.currentSqlStatement = this.dataInfo.sql.sql
      this.formatSqlData()

      this.historyLogTableData = this.dataInfo.sql.history
      this.getDataSourceList()
      this.handleChangeDataSource(this.dataInfo.dataSourceId)
    },
    // 打开保存窗口
    showSaveDialog () {
      this.$dialog.show('SaveDataSetDialog', { dataInfo: this.dataInfo }, () => {
        this.$router.go(-1)
      })
    },
    // 格式化 sql 编辑器
    formatSqlData () {
      this.dataInfo.sql.sql = this.currentSqlStatement
      const formatSql = format(this.currentSqlStatement)
      this.$refs.sqlEdit.editor.setValue(formatSql)
    },
    // 参数设置
    async settingParam () {
      this.settingParamVisiable = true
      const sql = this.dataInfo.sql.sql || this.currentSqlData.sql
      if (!sql) {
        this.$message({
          message: '参数设置暂不支持空SQL语句',
          type: 'warning'
        })
      }
      const body = {
        sql
      }
      try {
        const data = await getSqlVariables(body)
        this.sqlVariablesTableData = data.slice()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取改变的sql语句
    sqlStatementChange (sql) {
      this.currentSqlStatement = sql
      this.dataInfo.sql.sql = sql
    },
    // 运行
    async runSql () {
      // dataSourceId & sql语句  必须
      const body = {
        sql: this.currentSqlStatement,
        dataSourceId: this.dataInfo.dataSourceId,
        type: this.dataInfo.dataSourceType,
        _id: this.dataInfo.sql._id
      }
      if (this.sqlVariables && this.sqlVariables.length > 0) {
        body.sqlVariables = this.sqlVariables
      }
      try {
        this.resultPreviewLoading = true
        const data = await runtimeForSql(body)
        this.resultData = Object.assign({ success: true }, data.result)
        if (this.dataInfo.sql._id !== data._id) {
          this.dataInfo.sql._id = data._id
        }
        this.$nextTick(() => {
          // 触发历史记录的查询事件
          this.getHistory()
        })
      } catch (error) {
        this.resultData = Object.assign({ success: false }, error)
      }
      this.resultPreviewLoading = false
    },
    // 获取历史记录
    async getHistory () {
      if (this.currentSqlId) {
        try {
          const data = await getSqlRunningLogs(this.currentSqlId)
          this.historyLogTableData = data.slice()
        } catch (error) {
          console.log(error)
        }
      }
    },
    // 确认编辑
    async confirmEdit () {
      try {
        const body = {
          _id: this.dataInfo.sql._id,
          sql: this.dataInfo.sql.sql,
          dataSourceId: this.dataInfo.dataSourceId
        }
        // if (this.sqlVariables && this.sqlVariables.length > 0) {
        //   body.sqlVariables = this.sqlVariables
        // }
        const data = await confirmEditSql(body)
        Object.assign(this.dataInfo.sql, data.sql)
        this.dataInfo.fields = data.fields
        this.$message({
          message: '恭喜你，确认编辑成功',
          type: 'success'
        })
        this.isEdit = false
      } catch (error) {
        console.log(error)
      }
    },
    checkExit () {
      if (this.dataInfo.sql._id && this.dataInfo.sql.sql) {
        this.$dialog.show('TipDialog', { content: '您还未对此次代码的编辑进行确认，若此时返回，本次编辑内容将不被保存，请问您是否确认返回？' }, () => {
          this.toggleContent = !this.toggleContent
        })
      } else {
        this.toggleContent = !this.toggleContent
      }
    },
    // 获取数据源列表
    async getDataSourceList () {
      try {
        const { list } = await getDataSourceData()
        this.dataSourceOptions = list
      } catch (error) {
        console.log(error)
      }
    },
    // 获取数据源中的表
    async handleChangeDataSource (val) {
      this.dataTableLoading = true
      try {
        const currentDataSource = this.dataSourceOptions.find(item => item._id === val)
        const type = currentDataSource?.type || ''
        this.dataInfo.dataSourceId = val
        this.dataInfo.dataSourceName = currentDataSource?.displayName
        this.dataInfo.dataSourceType = type

        if (type === 'file') {
          const params = { searchkey: currentDataSource.displayName }
          const result = await dataFiles(params)
          this.dataTableList = result.list
        } else {
          const result = await getDataTable(val)
          this.dataTableList = result.list
        }

        // 给sql编辑器传参
        const temp = {}
        this.dataTableList.forEach(item => {
          // 目前只返回表名称，未返回字段数据
          temp[item.name] = []
        })
        this.hintOptions = temp
      } catch (error) {
        console.log(error)
      }
      this.dataTableLoading = false
    },
    resizeContainer () {
      this.isShrink = !this.isShrink
      this.draggableContainerHeight.height = this.isShrink ? '0px' : 'calc(100% - 50px)'
    },
    drag (e) {
      const clientHeight = document.body.clientHeight
      if (e.clientY > (clientHeight) || e.clientY < 250) {
        return
      }
      // 设定箭头方向
      this.isShrink = (e.clientY > (clientHeight / 2))
      this.draggableContainerHeight.height = (clientHeight - e.clientY) + 'px'
    },
    dragend (e) {
      const clientHeight = document.body.clientHeight
      if (e.clientY > (clientHeight) || e.clientY < 250) {
        return
      }
      this.isShrink = (e.clientY > (clientHeight / 2))
      this.draggableContainerHeight.height = (clientHeight - e.clientY) + 'px'
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-wrap {
  margin: -20px;
  &-header {
    height: 50px;
    border-bottom: 1px solid #ccc;
    color: #fff;
    box-sizing: border-box;
    background: #2d303b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 28px;
  }
}

.side-bar {
  display: inline-block;
  float: left;
  background-color: #fff;
  height: calc(100vh - 167px);
  width: 250px;

  &.full-height {
    height: calc(100vh - 100px);
  }

  .side-top {
    padding: 20px 12px;
    border-bottom: 1px solid #e8e8e8;

    .side-top-label {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 20px;
      margin-bottom: 6px;
    }

    .side-top-text {
      font-size: 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      line-height: 20px;
    }
  }

  .side-content {
    .side-content-title {
      padding: 20px 12px;
      font-weight: 400;
      color: #fa8334;
      border-bottom: 1px solid #e8e8e8;
      position: relative;

      span:after {
        content: '  ';
        position: absolute;
        bottom: 0px;
        left: 12px;
        width: 35px;
        border-bottom: 2px solid #fa8334;
      }
    }
  }
}

.main-panel {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f2f2f2;
  height: 100%;
  overflow: hidden;

  .main-edit {
    height: calc(100vh - 166px);
    &.full-height {
      height: calc(100vh - 101px);
    }
  }

  .draggable-container {
    width: 100%;
    height: 50%;
    position: absolute;
    bottom: 0px;
    left: 0;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 3;

    .shrink-btn {
      position: absolute;
      z-index: 999;
      left: 45%;
      top: -15px;
      width: 119px;
      height: 15px;
      box-shadow: 0px 2px 8px 0px rgb(200 201 204 / 50%);
      border-radius: 50px 50px 0px 0px/20px 20px 0px 0px;
      text-align: center;
    }
    .drag-handler {
      padding: 5px 0;
      width: 100%;
      height: 13px;
      position: absolute;
      left: 0;
      top: -9px;
      z-index: 10;

      .drag-handler-inner {
        height: 7px;
        cursor: ns-resize;
      }
    }
  }
}

// 自定义按钮图标
::v-deep .el-icon-volume {
  background: url('../../../../assets/Image/datasource/volume.png') center
    no-repeat;
  background-size: cover;

  &:before {
    content: '替';
    visibility: hidden;
  }
}
::v-deep .el-icon-disk {
  background: url('../../../../assets/Image/datasource/disk.png') center
    no-repeat;
  background-size: cover;

  &:before {
    content: '替';
    visibility: hidden;
  }
}
</style>
