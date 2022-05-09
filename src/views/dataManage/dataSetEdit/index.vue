<template>
  <div class="data-set-edit-wrap">
    <!-- header -->
    <div class="data-set-edit-wrap-header">
      <div class="data-set-edit-wrap-header-l">
        <i
          class="el-icon-arrow-left"
          style="margin-right: 8px; cursor: pointer"
          @click="noSaveLeaveDialogVisible = true"
        />
        <span>{{ dataSourceName ? dataSourceName : '未命名' }}</span>
      </div>
      <div class="data-set-edit-wrap-header-r">
        <div
          class="data-set-edit-wrap-header-r-btn"
          @click="saveDataSetDialogVisible = true"
        >保存</div>
      </div>
    </div>

    <!-- edit toptool -->
    <div
      v-show="isEdit"
      class="data-set-edit-wrap-toptool"
    >
      <div class="data-set-edit-wrap-toptool-l">
        <div>
          <svg-icon
            icon-class="sql"
            style="margin-right: 8px;width:20px;height:20px;"
          />
        </div>
        <el-input
          v-model="dataSetDisplayName"
          placeholder="未命名SQL"
        />
      </div>
      <div class="data-set-edit-wrap-toptool-r">
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
        <div
          style="margin-left: 8px"
          class="h-c-p"
          @click="checkLeaveEdit"
        ><i class="el-icon-close" /></div>
      </div>
    </div>

    <!-- main -->
    <div class="data-set-edit-wrap-main">

      <!-- side -->
      <div
        class="data-set-edit-wrap-main-side"
        :class="{ 'data-set-edit-wrap-main-side-shrinked': isShrink }"
      >
        <div
          class="data-set-edit-wrap-main-side-btn"
          @click="isShrink = !isShrink"
        >
          <i
            v-if="isShrink"
            class="el-icon-arrow-right"
            style="color: #B2B2B2"
          />
          <i
            v-else
            class="el-icon-arrow-left"
            style="color: #B2B2B2"
          />
        </div>

        <!-- top -->
        <div class="side-top">
          <div
            v-if="!isEdit"
            class="side-top-main"
          >
            <div><span>当前数据源</span></div>
            <div>
              <span style="font-size: 12px;font-weight: 500;color: rgba(0, 0, 0, 0.9);">{{ dataSourceName }}</span>
            </div>
          </div>
          <div
            v-else
            class="side-top-main"
          >
            <div><span>选择数据源</span></div>
            <div>
              <el-select
                v-model="currentDataSourceId"
                placeholder="请选择"
                @change="handleChangeDataSource"
              >
                <el-option
                  v-for="item in dataSourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>

        <!-- bottom -->
        <div class="side-bottom">
          <el-tabs v-model="activedTag">
            <el-tab-pane
              label="数据表"
              name="first"
            >
              <div
                v-loading="dataTableLoading"
                element-loading-text="拼命加载中"
                class="side-bottom-main"
              >
                <div
                  v-for="(table, i) in dataTableList"
                  :key="i"
                  style="display: flex;justify-content: space-between;align-items: center;"
                  class="side-bottom-main-list"
                >
                  <svg-icon
                    icon-class="table"
                    style="margin-right: 8px; height: 32px; width: 20px;"
                  />
                  <b-tooltip
                    :content="table.name"
                    style="cursor: pointer;"
                  />
                  <el-tooltip
                    content="复制"
                    placement="top"
                    effect="light"
                  >
                    <svg-icon
                      :id="`copy-icon-${i}`"
                      icon-class="copy"
                      style="cursor: pointer;"
                      @click="handleCopy(table.name, $event)"
                    />
                  </el-tooltip>
                  <el-popover
                    placement="right"
                    width="360"
                    trigger="click"
                  >
                    <div class="prop-title">
                      <div>
                        {{ table.name }}({{ currentTableInfo.columns? currentTableInfo.columns.length : 0 }})
                      </div>
                      <!-- 关闭不知道咋弄，先放着 -->
                      <!-- <div class="title-right-content">
                        <svg-icon icon-class="close" />
                      </div> -->
                    </div>
                    <el-divider />
                    <div
                      v-loading="tableInfoLoading"
                      element-loading-text="加载字段中"
                      style="min-height: 150px;"
                    >
                      <ColumnsList :columns="currentTableInfo.columns" />
                    </div>
                    <svg-icon
                      slot="reference"
                      icon-class="point"
                      class="h-c-p"
                      @click="handleTableInfo(table.name)"
                    />
                  </el-popover>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- content -->
      <div class="data-set-edit-wrap-main-content">
        <!-- top -->
        <div
          class="sql-edit"
          @dblclick="isEdit = true"
        >
          <span v-if="!isEdit">{{ sqlStatement }}</span>
          <EditSql
            v-else
            ref="sqlEdit"
            :tables="editTables"
            :value="currentSqlStatement"
            @changeTextarea="sqlStatementChange($event)"
          />
        </div>

        <!-- bottom -->
        <div class="result-preview">
          <ResultPreview
            ref="ResultPreview"
            v-loading="resultPreviewLoading"
            element-loading-text="拼命加载中"
            :run-result-data="runResultData"
            :is-edit="isEdit"
            :fields="currentFields"
            :sql-id="currentSqlId"
            :sql-params="currentSqlData"
            @dataSetFieldsChange="dataSetFieldsChange"
          />
        </div>
      </div>
    </div>

    <!-- 各种弹窗 & 抽屉 -->
    <el-drawer
      title="参数配置"
      :before-close="handleCloseSettingParam"
      :visible.sync="settingParamVisiable"
    >
      <div class="set-param-drawer">
        <div class="set-param-drawer-main">
          <el-table
            :data="sqlVariablesTableData"
            style="width: 100%"
          >
            <el-table-column
              prop="type"
              label="类型"
              min-width="120"
            />
            <el-table-column
              prop="name"
              label="变量名"
              min-width="120"
            />
            <el-table-column
              label="变量类型"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.dataType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in variableTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="查询默认值"
              min-width="360"
            >
              <template slot-scope="scope">
                <div style="display: flex">
                  <el-select
                    v-model="scope.row.useInGlobal"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in queryDefaultOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-input
                    v-model="scope.row.defaultValue"
                    placeholder="请输入内容"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="80"
            >
              <template slot-scope="scope">
                <svg-icon
                  icon-class="delete"
                  @click="deleteSqlVariable(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="set-param-drawer-footer">
          <el-button @click="settingParamVisiable = false; sqlVariables = []; sqlVariablesTableData = [] ">取 消
          </el-button>
          <el-button
            style="background-color: #FA8334;color: #fff;"
            @click="settingParamVisiable = false; sqlVariables = sqlVariablesTableData.slice(); sqlVariablesTableData = [] "
          >确 定</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 未保存 离开的弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="noSaveLeaveDialogVisible"
      width="480px"
    >
      <div>
        <svg-icon
          icon-class="tip"
          style="margin-right: 8px"
        />
        <span>您还未对此次代码的编辑进行确认，若此时返回，本次编辑内 容将不被保存，请问您是否确认返回？</span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="noSaveLeaveDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleNoSaveLeave"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 保存 -->
    <el-dialog
      title="保存数据集"
      :visible.sync="saveDataSetDialogVisible"
      width="480px"
    >
      <div class="on-save-content">
        <div style="display: flex; align-items: flex-start;">
          <div
            class="on-save-content-label"
            style="margin-top: 9px"
          ><span>数据集</span></div>
          <div
            class="on-save-content-main"
            style="width: 320px"
          >
            <el-input
              v-model="dataSetDisplayName"
              placeholder="请输入数据集名称"
            />
            <div style="margin-top:8px;font-size: 12px;color: rgba(0, 0, 0, 0.45);">
              <span>名称只能由中英文、数字及下划线(_)、斜线(/)、反斜线(\)、竖线(I)、 小括号(())、中括号([])组成，不超过50个字符。</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-top: 24px">
          <div class="on-save-content-label"><span>位置</span></div>
          <div class="on-save-content-main">
            <el-select
              v-model="currentFloderId"
              placeholder="请选择"
              style="width: 320px"
            >
              <el-option
                v-for="item in floderList"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              />
            </el-select>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="saveDataSetDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { format } from 'sql-formatter'
import EditSql from '@/components/SqlEditor/index.vue'
import { runtimeForSql, getDataSourceData, confirmEditSql, createDataSets, getSqlAllData, getSqlVariables, getFolderLists, getDataTable, getTableInfo } from '@/api/dataSet'
import ResultPreview from './components/resultPreview/index.vue'
import Clipboard from '@/utils/clipboard.js'
import ColumnsList from '@/views/dataManage/dataSetEdit/components/ColumnsList.vue'
export default {
  name: 'DataSetEdit',
  components: {
    EditSql,
    ResultPreview,
    ColumnsList
  },
  data () {
    return {
      isEdit: false,
      isShrink: false,
      dataSourceOptions: [],
      activedTag: 'first',
      // 数据表loading控制单元
      tableLoading: false,
      // 数据表
      dataTableList: [],
      // 传输给sql编辑器的表格提示词
      editTables: {},
      runResultData: {},
      settingParamVisiable: false,
      variableTypeOptions: [
        {
          value: 'number',
          label: '数字'
        },
        {
          value: 'text',
          label: '文本'
        },
        {
          value: 'date',
          label: '日期'
        }
      ],
      queryDefaultOptions: [
        {
          value: false,
          label: '仅编辑页'
        },
        {
          value: true,
          label: '全局生效'
        }
      ],
      currentDataSet: {},
      currentSqlData: {},
      sqlVariablesTableData: [],
      sqlVariables: [],
      creatorName: '',
      currentSqlStatement: '',
      currentDataSourceId: '',
      current_id: '',
      currentFields: [],
      currentSql: {},
      noSaveLeaveDialogVisible: false,
      currentSqlId: '',
      floderList: [],
      currentFloderId: '',
      saveDataSetDialogVisible: false,
      dataSetDisplayName: '',
      currentTableInfo: {},
      resultPreviewLoading: false,
      tableInfoLoading: false,
      dataTableLoading: false
    }
  },
  computed: {
    dataSourceName: function () {
      return this.currentDataSet.dataSourceName || ''
    },
    sqlStatement: function () {
      return this.currentSqlData.sql || ''
    }
  },
  created () {
    const data = this.$route.query
    // 如果都为空则表示新建的数据集，直接进入编辑状态
    // 需要在实例都挂载前完成数据的映射
    if (!data._id) {
      this.isEdit = true
    }
    this.currentDataSet = data
    if (data.sqlId) {
      this.currentSqlId = data.sqlId
      this.getSqlData(data.sqlId)
    }
    this.creatorName = data.creatorName
    this.currentDataSourceId = data.dataSourceId || ''
    this.current_id = data._id || ''
    this.currentFields = data.fields || []
  },
  mounted () {
    this.getDataSourceList()
    this.getFolderList()
    this.dataSetDisplayName = this.currentDataSet.displayName || ''
    if (this.currentDataSourceId) {
      this.handleChangeDataSource(this.currentDataSourceId)
    }
  },
  methods: {
    init () {
      this.getDataSourceList()
      this.getFolderList()
    },
    // 格式化 sql 编辑器
    formatSqlData () {
      const dom = this.$refs.sqlEdit
      dom.editor.setValue(format(this.currentSqlStatement))
    },
    // 参数设置
    async settingParam () {
      this.settingParamVisiable = true
      const sql = this.currentSqlStatement || this.currentSqlData.sql
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
        dataSourceId: this.currentDataSourceId,
        _id: this.currentSqlId ?? ''
      }
      if (this.sqlVariables && this.sqlVariables.length > 0) {
        body.sqlVariables = this.sqlVariables
      }
      try {
        this.resultPreviewLoading = true
        const data = await runtimeForSql(body)
        this.runResultData = Object.assign({ success: true }, data)
        if (this.currentSqlId !== data._id) {
          this.currentSqlId = data._id
        }
        this.$nextTick(() => {
          // 触发历史记录的查询事件
          this.$refs.ResultPreview.getHistory()
        })
      } catch (error) {
        this.runResultData = Object.assign({ success: false }, error)
      }
      this.resultPreviewLoading = false
    },
    // 确认编辑
    async confirmEdit () {
      try {
        const body = {}
        body.sql = this.currentSqlStatement
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
      } catch (error) {
        console.log(error)
      }
    },
    // 删除
    deleteSqlVariable (val) {
      if (!val) return false
      let _idx = 0
      const tmp = this.sqlVariablesTableData.slice()
      tmp.forEach((item, idx) => {
        if (val.type === item.type && val.name === item.name) {
          _idx = idx
        }
      })
      tmp.splice(_idx, 1)
      this.sqlVariablesTableData = tmp.slice()
    },
    // 获取数据源列表
    async getDataSourceList () {
      try {
        const { list } = await getDataSourceData()
        const options = []
        list.forEach(i => {
          const o = {}
          o.label = i.displayName
          o.value = i._id
          options.push(o)
        })
        this.dataSourceOptions = options.slice()
      } catch (error) {
        console.log(error)
      }
    },
    // 复制数据源列表
    handleCopy (val, event) {
      Clipboard(val, event, () => {
        this.$message({
          message: '该表名已复制到剪切板',
          type: 'success',
          duration: 1500
        })
      })
    },
    async handleTableInfo (tableName) {
      const id = this.currentDataSourceId
      this.currentTableInfo = {}
      try {
        this.tableInfoLoading = true
        const data = await getTableInfo(id, tableName)
        this.currentTableInfo = data
      } catch (error) {
        console.log(error)
      }
      this.tableInfoLoading = false
    },
    // 获取改变的sql语句
    sqlStatementChange (sql) {
      this.currentSqlStatement = sql
    },
    // 未保存 离开
    handleNoSaveLeave () {
      this.noSaveLeaveDialogVisible = false
      this.$router.go(-1)
    },
    // 保存数据
    async handleSave () {
      try {
        const body = {}
        // sql = currentSqlData fields folderId displayName
        body.fields = this.currentFields
        body.folderId = this.currentFloderId
        body.sql = this.currentSqlData
        body.displayName = this.dataSetDisplayName
        console.log(body, 'body')
        await createDataSets(body)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.saveDataSetDialogVisible = false
        this.$router.push({
          path: '/dataManage/dataSet'
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 离开 编辑状态 但不保存数据
    checkLeaveEdit () {
      this.$dialog.show('TipDialog', { content: '您还未对此次代码的编辑进行确认，若此时返回，本次编辑内 容将不被保存，请问您是否确认返回？' }, () => {
        this.isEdit = false
      })
    },
    // 根据sqlId 获取sql相关的所有数据
    async getSqlData (sqlId) {
      try {
        const data = await getSqlAllData(sqlId)
        this.currentSqlData = data
        this.currentSqlStatement = data.sql
      } catch (error) {
        console.log(error)
      }
    },
    handleCloseSettingParam (done) {
      this.$confirm('确认关闭？选择离开本次编辑将不会保存')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 获取 folderList
    async getFolderList () {
      try {
        const data = await getFolderLists()
        this.floderList = data.result
      } catch (error) {
        console.log(error)
      }
    },
    // 子级更改更新父级的fields
    dataSetFieldsChange (val) {
    },
    // 获取数据源中的表
    async handleChangeDataSource (val) {
      this.tableLoading = true
      try {
        this.currentDataSourceId = val
        const data = await getDataTable(val)
        this.dataTableList = data.list
        // 给sql编辑器传参
        const temp = {}
        data.list.forEach(item => {
          // 目前只返回表名称，未返回字段数据
          temp[item.name] = []
        })
        this.editTables = temp
      } catch (error) {
        console.log(error)
      }
      this.tableLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.data-set-edit-wrap {
  margin: -20px;
  &-header {
    height: 50px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 28px;
    &-r {
      &-btn {
        width: 60px;
        height: 32px;
        background: #fa8334;
        border-radius: 2px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        line-height: 32px;
        font-size: 12px;
      }
    }
    &-l {
      color: rgba(255, 255, 255, 0.9);
      height: 20px;
      line-height: 20px;
    }
  }
  &-main {
    display: flex;
    min-height: calc(100vh - 100px);
    box-sizing: border-box;
    background: #fff;
    &-side {
      width: 250px;
      border-right: 1px solid #ccc;
      position: relative;
      &-shrinked {
        left: -250px;
        width: 0;
      }
      &-btn {
        width: 15px;
        height: 74px;
        background: #ffffff;
        position: absolute;
        box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, 0.5);
        left: 251px;
        top: 100px;
        cursor: pointer;
        z-index: 99;
        line-height: 74px;
        text-align: center;
      }
    }
    &-content {
      flex: 1;
    }
  }
  &-toptool {
    height: 64px;
    background: #f8f8f8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    &-l {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-r {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 32px;
    }
  }
}

.side-top {
  padding: 20px 12px;
  &-main > div:nth-child(1) {
    margin-bottom: 8px;
  }
}

.side-bottom {
  &-main {
    padding: 0 20px;
    &-list {
      display: flex;
      height: 32px;
      line-height: 32px;

      &:hover {
        background: #fef5ee;
        margin: 0 -20px;
        padding: 0 20px;
        margin-bottom: 8px;
      }
    }
  }

  ::v-deep .el-tabs__nav-scroll {
    margin-left: 12px;
  }

  &-main > div {
    margin-bottom: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
}

.sql-edit {
  min-height: 300px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}

.result-preview {
  padding: 16px;
}

.set-param-drawer {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-top: 1px #f1f1f1 solid;
  height: calc(100vh - 75px);
  &-main {
    flex: 1;
  }
  &-footer {
    height: 50px;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    ::v-deep .el-button {
      line-height: 8px;
      height: 32px;
      border-radius: 2px;
    }
  }
}
::v-deep .el-tooltip__popper.is-light {
  border: 0px;
}
.on-save-content {
  &-label {
    width: 80px;
  }
}
.prop-title {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  line-height: 22px;
  font-size: 14px;
  padding: 17px 20px 0px 20px;
  display: flex;
  justify-content: space-between;
}
.create-folder {
  display: flex;
  ::v-deep .el-input__inner {
    height: 32px;
  }
}
.dialog-footer {
  height: 50px;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
// 自定义按钮图标
::v-deep .el-icon-volume {
  background: url('../../../assets/Image/datasource/volume.png') center
    no-repeat;
  background-size: cover;

  &:before {
    content: '替';
    visibility: hidden;
  }
}
::v-deep .el-icon-disk {
  background: url('../../../assets/Image/datasource/disk.png') center no-repeat;
  background-size: cover;

  &:before {
    content: '替';
    visibility: hidden;
  }
}
</style>
