<template>
  <div class="data-set-edit-wrap">
    <!-- header -->
    <div class="data-set-edit-wrap-header">
      <div class="data-set-edit-wrap-header-l">
        <i class="el-icon-arrow-left" @click="noSaveLeaveDialogVisible = true" style="margin-right: 8px; cursor: pointer"></i>
        <span>{{ dataSourceName ? dataSourceName : '未命名' }}</span>
      </div>
      <div class="data-set-edit-wrap-header-r">
        <div class="data-set-edit-wrap-header-r-btn" @click="saveDataSetDialogVisible = true">保存</div>
      </div>
    </div>

    <!-- edit toptool -->
    <div class="data-set-edit-wrap-toptool" v-show="isEdit">
      <div class="data-set-edit-wrap-toptool-l">
        <div>
          <svg-icon iconClass="sql" style="margin-right: 8px"/>
        </div>
        <el-input v-model="dataSetDisplayName"  placeholder="未命名SQL"></el-input>
      </div>
      <div class="data-set-edit-wrap-toptool-r">
        <el-button @click="formatSqlData">格式化</el-button>
        <el-button @click="settingParam">参数配置</el-button>
        <el-button @click="runSql" type="primary">运行</el-button>
        <el-button @click="confirmEdit" type="primary">确认编辑</el-button>
        <div style="margin-left: 8px" @click="leaveDialogVisible=true"><i class="el-icon-close"></i></div>
      </div>
    </div>

    <!-- main -->
    <div class="data-set-edit-wrap-main">

      <!-- side -->
      <div class="data-set-edit-wrap-main-side" :class="{ 'data-set-edit-wrap-main-side-shrinked': isShrink }">
        <div class="data-set-edit-wrap-main-side-btn" @click="isShrink = !isShrink">
          <i class="el-icon-arrow-right" style="color: #B2B2B2" v-if="isShrink"></i>
          <i class="el-icon-arrow-left" style="color: #B2B2B2" v-else></i>
        </div>

        <!-- top -->
        <div class="side-top">
          <div v-if="!isEdit" class="side-top-main">
            <div><span>当前数据源</span></div>
            <div><span>{{ dataSourceName }}</span></div>
          </div>
          <div v-else class="side-top-main">
            <div><span>选择数据源</span></div>
            <div>
              <el-select v-model="currentDataSourceId" placeholder="请选择" >
                <el-option
                  v-for="item in dataSourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- bottom -->
        <div class="side-bottom">
          <el-tabs v-model="activedTag">
            <el-tab-pane label="数据表" name="first">
              <div v-for="(table, i) in dataSourceList" :key="i" class="side-bottom-main">
                <div style="display: flex;justify-content: space-between;align-items: center;" class="side-bottom-main-list">
                  <div>
                    <svg-icon iconClass="table" style="margin-right: 8px"/>
                    <span>{{ table.displayName }}</span>
                  </div>
                  <div>
                    <el-tooltip content="复制" placement="top" effect="light">
                      <i class="el-icon-document" style="color: #B2B2B2;margin-right: 8px;cursor: pointer;" @click="handleCopy(table, $event)"></i>
                    </el-tooltip>
                    <i class="el-icon-info" style="color: #B2B2B2;margin-right: 8px;cursor: pointer;" ></i>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- content -->
      <div class="data-set-edit-wrap-main-content">
        <!-- top -->
        <div class="sql-edit" v-on:dblclick="isEdit = true">
          <span v-if="!isEdit">{{ sqlStatement }}</span>
          <EditSql
            ref="sqlEdit"
            :sqlStatement="sqlStatement"
            @sqlStatementChange="sqlStatementChange"
            v-else
          />
        </div>

        <!-- bottom -->
        <div class="result-preview">
          <ResultPreview :runResultData='runResultData' :isEdit="isEdit" :fields="currentFields" :sqlId="currentSqlId" :sqlParams="currentSqlData" @dataSetFieldsChange="dataSetFieldsChange"/>
        </div>
      </div>
    </div>

    <!-- 各种弹窗 & 抽屉 -->
    <el-drawer
      title="参数配置"
      :before-close="handleCloseSettingParam"
      :visible.sync="settingParamVisiable">
      <div class="set-param-drawer">
        <div class="set-param-drawer-main">
          <el-table
            :data="sqlVariablesTableData"
            style="width: 100%">
            <el-table-column
              prop="type"
              label="类型"
              min-width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="变量名"
              min-width="120">
            </el-table-column>
            <el-table-column
              label="变量类型"
              min-width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.dataType" placeholder="请选择">
                  <el-option
                    v-for="item in variableTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="查询默认值"
              min-width="360">
              <template slot-scope="scope">
                <div style="display: flex">
                  <el-select v-model="scope.row.useInGlobal" placeholder="请选择">
                    <el-option
                      v-for="item in queryDefaultOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input v-model="scope.row.defaultValue" placeholder="请输入内容"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="80">
              <template slot-scope="scope">
                <svg-icon iconClass="delete" @click="deleteSqlVariable(scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="set-param-drawer-footer">
          <el-button @click="settingParamVisiable = false; sqlVariables = []; sqlVariablesTableData = [] ">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="settingParamVisiable = false; sqlVariables = sqlVariablesTableData.slice(); sqlVariablesTableData = [] ">确 定</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 未确认编辑 离开的弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="leaveDialogVisible"
      width="480px">
      <div>
        <svg-icon iconClass="tip" style="margin-right: 8px"/>
        <span>您还未对此次代码的编辑进行确认，若此时返回，本次编辑内 容将不被保存，请问您是否确认返回？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="leaveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleLeave">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 未保存 离开的弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="noSaveLeaveDialogVisible"
      width="480px">
      <div>
        <svg-icon iconClass="tip" style="margin-right: 8px"/>
        <span>您还未对此次代码的编辑进行确认，若此时返回，本次编辑内 容将不被保存，请问您是否确认返回？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noSaveLeaveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNoSaveLeave">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 保存 -->
    <el-dialog
      title="保存数据集"
      :visible.sync="saveDataSetDialogVisible"
      width="480px">
      <div class="on-save-content">
        <div style="display: flex; align-items: flex-start;">
          <div class="on-save-content-label" style="margin-top: 9px"><span>数据集</span></div>
          <div class="on-save-content-main" style="width: 320px">
            <el-input v-model="dataSetDisplayName" placeholder="请输入数据集名称"></el-input>
            <div style="margin-top:8px;font-size: 12px;color: rgba(0, 0, 0, 0.45);">
              <span>名称只能由中英文、数字及下划线(_)、斜线(/)、反斜线(\)、竖线(I)、 小括号(())、中括号([])组成，不超过50个字符。</span>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-top: 24px">
          <div class="on-save-content-label"><span>位置</span></div>
          <div class="on-save-content-main">
              <el-select v-model="currentFloderId" placeholder="请选择" style="width: 320px">
                <el-option
                  v-for="item in floderList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveDataSetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EditSql from './components/editSql/index.vue'
import { runtimeForSql, getDataSourceData, confirmEditSql, createDataSets, getSqlAllData, getSqlVariables, getFolderLists } from '@/api/dataSet'
import ResultPreview from './components/resultPreview/index.vue'
import Clipboard from '@/utils/clipboard.js'
export default {
  name: 'DataSetEdit',
  components: {
    EditSql,
    ResultPreview
  },
  mounted () {
    this.getFolderList()
    const data = this.$route.query
    console.log(data, 'data')
    // 如果都为空则表示新建的数据集，直接进入编辑状态
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
    this.dataSetDisplayName = this.currentDataSet.displayName || ''
  },
  computed: {
    dataSourceName: function() {
      return this.currentDataSet.dataSourceName || ''
    },
    sqlStatement: function() {
      return this.currentSqlData.sql || ''
    }
  },
  data () {
    return {
      isEdit: false,
      isShrink: false,
      dataSourceOptions: [],
      activedTag: 'first',
      dataSourceList: [
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' }
      ],
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
      leaveDialogVisible: false,
      currentFields: [],
      currentSql: {},
      noSaveLeaveDialogVisible: false,
      currentSqlId: '',
      floderList: [],
      currentFloderId: '',
      saveDataSetDialogVisible: false,
      dataSetDisplayName: ''
    }
  },
  methods: {
    init () {
      this.getDataSourceList()
      this.getFolderList()
    },
    // 格式化 sql 编辑器
    formatSqlData () {
      this.$refs.sqlEdit.formaterSql()
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
        const { data } = await getSqlVariables(body)
        this.sqlVariablesTableData = data.slice()
      } catch (error) {
        console.log(error)
      }
    },
    // 运行
    async runSql () {
      // dataSourceId & sql语句  必须
      const body = {}
      body.sql = this.currentSqlStatement
      body.dataSourceId = this.currentDataSourceId
      if (this.sqlVariables && this.sqlVariables.length > 0) {
        body.sqlVariables = this.sqlVariables
      }
      try {
        const { data } = await runtimeForSql(body)
        this.runResultData = data
        if (this.currentSqlId !== data._id) {
          this.currentSqlId = data._id
        }
      } catch (error) {
        console.log(error)
      }
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
        const { data } = confirmEditSql(body)
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
        const data = await getDataSourceData()
        this.dataSourceList = data.slice()
        const options = []
        data.foreEach(i => {
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
      const str = val.displayName
      Clipboard(str, event)
    },
    // 获取改变的sql语句
    sqlStatementChange (sql) {
      console.log('获取改变的sql语句', sql)
      this.currentSqlStatement = sql
    },
    // 未保存 离开
    handleNoSaveLeave () {
      this.noSaveLeaveDialogVisible = false
      this.$router.push({
        path: '/dataSet'
      })
    },
    // 保存数据
    async handleSave() {
      try {
        const body = {}
        // sql = currentSqlData fields folderId displayName
        body.fields = this.currentFields
        body.folderId = this.currentFloderId
        body.sql = this.currentSqlData
        body.displayName = this.dataSetDisplayName
        console.log(body, 'body')
        const { data } = await createDataSets(body)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 离开 编辑状态 但不保存数据
    handleLeave() {
      this.isEdit = false
      this.leaveDialogVisible = false
    },
    // 根据sqlId 获取sql相关的所有数据
    async getSqlData(sqlId) {
      try {
        const { data } = await getSqlAllData(sqlId)
        console.log('currentSqlData', data)
        this.currentSqlData = data
        this.currentSqlStatement = data.sql
      } catch (error) {
        console.log(error)
      }
    },
    handleCloseSettingParam(done) {
      this.$confirm('确认关闭？选择离开本次编辑将不会保存')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 获取 folderList
    async getFolderList() {
      try {
        const { data } = await getFolderLists()
        this.floderList = data.result
      } catch (error) {
        console.log(error)
      }
    },
    // 子级更改更新父级的fields
    dataSetFieldsChange(val) {
      console.log(val, 'dataSetFieldsChange')
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
        background: #FA8334;
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
        background: #FFFFFF;
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
    background: #F8F8F8;
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
  height: 100px;
  padding: 20px 12px;
  &-main > div:nth-child(1) {
    margin-bottom: 8px;
  }
}

.side-bottom {
  &-main {
    padding: 0 20px;
    &-list:hover {
      background: #FEF5EE;
      margin: 0 -20px;
      padding: 0 20px;
      margin-bottom: 8px;
    }
  }

  ::v-deep .el-tabs__nav-scroll {
    margin-left: 12px;
  }

  &-main > div {
    margin-bottom: 8px;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
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
  border-top: 1px #F1F1F1 solid;
  height: calc(100vh - 75px);
  &-main {
    flex: 1;
  }
  &-footer {
    height: 50px;
    background: #F5F5F5;
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

.on-save-content {
  &-label {
    width: 80px;
  }
}
</style>
