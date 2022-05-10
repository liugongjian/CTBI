<template>
  <div>
    <!-- Header -->
    <div class="d-f p-16-16 f-b-s bg-c-f8f8f8">
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
          @click="confirmEdit"
        ><i class="el-icon-close" /></el-button>
      </div>
    </div>

    <!-- main -->
    <div class="d-f">
      <div class="side-bar">
        <div class="side-top">
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
        <div class="side-content">
          <div class="side-content-title">
            <span>数据表</span>
          </div>
          <table-list
            v-loading="dataTableLoading"
            :table-list="dataTableList"
            :type="dataInfo.dataSourceType"
            :data-source-id="dataInfo.dataSourceId"
          />
        </div>
      </div>

      <!-- 运行记录 -->
      <div class="main-bar">
        <div class="h-100p">
          <EditSql
            ref="sqlEdit"
            :tables="hintOptions"
            :value="currentSqlStatement"
            @changeTextarea="sqlStatementChange($event)"
          />
        </div>
        <div
          v-loading="resultPreviewLoading"
          :class="[{'isHide': isShrink},'main-preview', 'bg-c-fff']"
        >
          <!-- 收缩按钮 -->
          <div
            class="shrink-btn bg-c-fff"
            @click="isShrink = !isShrink"
          >
            <i class="el-icon-arrow-up" />
          </div>
          <!-- 运行结果 & 历史记录 -->
          <div class="m-tab">
            <div
              :class="[{'active': activeTagName === 1}, 'tab-block']"
              @click="activeTagName = 1"
            >
              运行结果
            </div>
            <div
              :class="[{'active': activeTagName === 2}, 'tab-block']"
              @click="activeTagName = 2"
            >
              历史记录
            </div>
          </div>
          <div v-show="activeTagName === 1">
            <!-- 成功为table -->
            <template v-if="resultData.success">
              <!-- 未查询出数据时展示效果 -->
              <template v-if="!resultData.data || resultData.data.length === 0">
                <div style="text-align: center;margin-top: 38px;">
                  <svg-icon
                    style="width: 371px; height: 200px;"
                    icon-class="sql-result-bg"
                  />
                  <div>
                    <span class="result-bg-tip">编辑完代码后，点击上方运行按钮即可查看运</span>
                  </div>
                </div>
              </template>
              <!-- 查询出数据时展示效果 -->
              <el-table
                v-else
                border
                header-row-class-name="m-table-header"
                row-class-name="m-table-row"
                :data="resultData.data"
                style="width: 100%"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  fixed
                  min-width="50"
                />
                <el-table-column
                  v-for="k in resultData.columns"
                  :key="`table-column-${k.name}`"
                  min-width="50"
                  show-overflow-tooltip
                  :prop="k.name"
                  :label="k.name"
                />
              </el-table>
            </template>
            <!-- 失败 -->
            <template v-else>
              <div>
                <div class="error-msg-block">
                  <div>报错详情</div>
                  <div>{{ resultData.msg }}</div>
                </div>
                <div style="text-align: center;margin-top: 38px;">
                  <svg-icon
                    style="width: 371px; height: 200px;"
                    icon-class="sql-result-err-bg"
                  />
                  <div>
                    <span class="result-bg-tip">运行失败，SQL存在错误，请先修改代码</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-show="activeTagName === 2">
            <el-table
              v-if="historyLogTableData && historyLogTableData.length > 0"
              :data="historyLogTableData"
              header-row-class-name="m-table-header"
              style="width: 100%"
            >
              <el-table-column
                prop="createdTime"
                label="开始时间"
                min-width="180"
              />
              <el-table-column
                prop="sqlText"
                label="SQL语句"
                min-width="300"
              />
              <el-table-column
                prop="costTime"
                label="耗时（ms）"
                min-width="80"
              />
              <el-table-column
                prop="result"
                label="运行结果"
                min-width="80"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.result == 'success'">
                    <span>成功</span>
                  </div>
                  <div v-else>
                    <span>失败</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="100"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="copyHistoryLog(scope.row, $event)"
                  >复制</el-button>
                </template>
              </el-table-column>
            </el-table>
            <template v-else>
              <div style="text-align: center;margin-top: 38px;">
                <svg-icon
                  style="width: 371px; height: 200px;"
                  icon-class="sql-result-bg"
                />
                <div>
                  <span class="result-bg-tip">未查询到历史记录</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataSourceData, dataFiles, getDataTable, runtimeForSql, getSqlVariables, confirmEditSql, getSqlRunningLogs } from '@/api/dataSet'
import { format } from 'sql-formatter'
import TableList from '@/views/dataManage/dataSet/dataSetEdit/TableList'
import EditSql from '@/components/SqlEditor/index.vue'

export default {
  components: { TableList, EditSql },
  data () {
    return {
      // 数据源下拉框选值
      dataSourceOptions: [],
      // 表格数据组
      dataTableList: [],
      // 左侧表格查询loading
      dataTableLoading: false,
      // sql 编辑器提示语合集
      hintOptions: {},
      // 收缩
      isShrink: false,
      activeTagName: 1,
      // 运行结果集
      resultData: { success: true },
      // 运行结果loading
      resultPreviewLoading: false,
      // 历史记录集
      historyLogTableData: [],
      // sql脚本
      currentSqlStatement: '',
      // 回显数据
      dataInfo: {
        displayName: '',
        dataSourceId: '',
        dataSourceType: '',
        sql: {
          _id: '',
          sql: ''
        }
      }
    }
  },
  computed: {},
  watch: {},
  async created () {
    await this.getDataSourceList()
  },
  methods: {
    setDataInfo (data) {
      this.dataInfo = data
      this.handleChangeDataSource(this.dataInfo.dataSourceId)
      this.historyLogTableData = this.dataInfo.sql.history
      this.currentSqlStatement = this.dataInfo.sql.sql
      this.formatSqlData()
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
    // 获取改变的sql语句
    sqlStatementChange (sql) {
      console.log(sql)
      this.currentSqlStatement = sql
      this.dataInfo.sql.sql = sql
    },
    // 格式化 sql 编辑器
    formatSqlData () {
      this.dataInfo.sql.sql = this.currentSqlStatement
      console.log(this.dataInfo.sql.sql)
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
    // 确认编辑
    async confirmEdit () {
      try {
        const body = {}
        body.sql = this.dataInfo.sql.sql
        body.dataSourceId = this.currentDataSourceId
        this.currentSqlId && (body._id = this.currentSqlId)
        if (this.sqlVariables && this.sqlVariables.length > 0) {
          body.sqlVariables = this.sqlVariables
        }
        const data = await confirmEditSql(body)
        this.currentFields = data.fields
        this.currentSqlData = data.sql
        this.currentSqlId = data.sql._id
        this.$message({
          message: '恭喜你，确认编辑成功',
          type: 'success'
        })
        this.isEdit = false
      } catch (error) {
        console.log(error)
      }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.side-bar {
  background-color: #fff;
  height: calc(100vh - 167px);
  width: 250px;

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
  }
}

.main-bar {
  width: 100%;
  height: calc(100vh - 166px);
  position: relative;
  display: flex;
  flex-direction: column;

  .main-preview {
    position: relative;
    height: 200%;
    padding: 16px;

    &.isHide {
      height: 0px;
      padding: 0px;
    }

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
    .m-tab {
      border-bottom: 1px solid #dddddd;
      display: flex;
      margin-bottom: 16px;

      .tab-block {
        line-height: 20px;
        background-color: #f4f5f6;
        padding: 10px 22px;
        border: 1px solid #ddd;
        position: relative;
        top: 1px;
        border-bottom-width: 1px;
        color: rgba(0, 0, 0, 0.65);
        border-radius: 2px 2px 0px 0px;
        cursor: pointer;

        &:first-of-type {
          border-right-width: 0px;
        }

        &.active {
          background-color: #fff;
          border-bottom-color: #fff;
          color: #fa8334;
        }
      }
    }
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

.error-msg-block {
  border: 1px solid #ffa4a3;
  background-color: #ffecec;
  min-height: 60px;
  line-height: 20px;
  padding: 10px 16px 24px 16px;
}

// 为了实现UI设计同时支持表头resize，这里设置边框为0，但是要在table加上边框属性
::v-deep .m-table-header > th {
  background-color: #fafafa !important;
  color: rgba(0, 0, 0, 0.9);
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}
::v-deep .m-table-row > td {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}
::v-deep .el-table--border {
  border-width: 0px;
}
</style>
