<template>
  <div class="data-set-edit-wrap">
    <!-- header -->
    <div class="data-set-edit-wrap-header">
      <div class="data-set-edit-wrap-header-l">
        <i class="el-icon-arrow-left" style="margin-right: 8px" @click="toDataSetPage" />
        <span>{{ dataSourceName ? dataSourceName : '未命名' }}</span>
      </div>
      <div class="data-set-edit-wrap-header-r">
        <div class="data-set-edit-wrap-header-r-btn" @click="onSave">保存</div>
      </div>
    </div>

    <!-- edit toptool -->
    <div v-show="isEdit" class="data-set-edit-wrap-toptool">
      <div class="data-set-edit-wrap-toptool-l">
        <div>
          <svg-icon icon-class="sql" style="margin-right: 8px" />
        </div>
        <el-input v-model="sqlName" placeholder="未命名SQL" />
      </div>
      <div class="data-set-edit-wrap-toptool-r">
        <el-button @click="formatSqlData">格式化</el-button>
        <el-button @click="settingParam">参数配置</el-button>
        <el-button type="primary" @click="runSql">运行</el-button>
        <el-button type="primary" @click="confirmEdit">确认编辑</el-button>
        <div style="margin-left: 8px" @click="isEdit=false"><i class="el-icon-close" /></div>
      </div>
    </div>

    <!-- main -->
    <div class="data-set-edit-wrap-main">

      <!-- side -->
      <div class="data-set-edit-wrap-main-side" :class="{ 'data-set-edit-wrap-main-side-shrinked': isShrink }">
        <div class="data-set-edit-wrap-main-side-btn" @click="isShrink = !isShrink">
          <i v-if="isShrink" class="el-icon-arrow-right" style="color: #B2B2B2" />
          <i v-else class="el-icon-arrow-left" style="color: #B2B2B2" />
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
              <el-select v-model="currentDataSourceId" placeholder="请选择">
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
            <el-tab-pane label="数据表" name="first">
              <div v-for="(table, i) in dataSourceList" :key="i" class="side-bottom-main">
                <div style="display: flex;justify-content: space-between;align-items: center;" class="side-bottom-main-list">
                  <div>
                    <svg-icon icon-class="table" style="margin-right: 8px" />
                    <span>{{ table.displayName }}</span>
                  </div>
                  <div>
                    <el-tooltip content="复制" placement="top" effect="light">
                      <i class="el-icon-document" style="color: #B2B2B2;margin-right: 8px;cursor: pointer;" @click="handleCopy(table, $event)" />
                    </el-tooltip>
                    <i class="el-icon-info" style="color: #B2B2B2;margin-right: 8px;cursor: pointer;" />
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
        <div class="sql-edit" @dblclick="isEdit = true">
          <span v-if="!isEdit">{{ sqlStatement }}</span>
          <EditSql
            v-else
            ref="sqlEdit"
            :sql-statement="sqlStatement"
            @sqlStatementChange="sqlStatementChange"
          />
        </div>

        <!-- bottom -->
        <div class="result-preview">
          <ResultPreview :run-result-data="runResultData" :is-edit="isEdit" />
        </div>
      </div>
    </div>

    <!-- 各种弹窗 & 抽屉 -->
    <el-drawer
      title="参数配置"
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
                <el-select v-model="scope.row.dataType" placeholder="请选择">
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
                  <el-select v-model="scope.row.useInGlobal" placeholder="请选择">
                    <el-option
                      v-for="item in queryDefaultOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-input v-model="scope.row.defaultValue" placeholder="请输入内容" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="80"
            >
              <template slot-scope="scope">
                <svg-icon icon-class="delete" @click="deleteSqlVariable(scope.row)" />
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
  </div>
</template>

<script>
import EditSql from './components/editSql/index.vue'
import { runtimeForSql, getDataSourceData, createUpdateSql, createDataSets } from '@/api/dataSet'
import ResultPreview from './components/resultPreview/index.vue'
import Clipboard from '@/utils/clipboard.js'
export default {
  name: 'DataSetEdit',
  components: {
    EditSql,
    ResultPreview
  },
  data () {
    return {
      isEdit: false,
      isShrink: false,
      dataSourceOptions: [],
      activedTag: 'first',
      sqlName: '',
      dataSourceList: [
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' },
        { displayName: 'cmswing_action' }
      ],
      runResultData: {
        tableData: [],
        columns: []
      },
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
      sqlVariablesTableData: [],
      sqlVariables: [],
      dataSourceName: '',
      creatorName: '',
      currentSqlStatement: '',
      sqlStatement: 'select * from users where telephone = ${telephone}',
      currentDataSourceId: '',
      current_id: ''
    }
  },
  mounted () {
    const data = this.$route.query
    console.log(data, 'data')
    this.dataSourceName = data.dataSourceName || ''
    this.creatorName = data.creatorName
    this.currentDataSourceId = data.dataSourceId || ''
    this.current_id = data._id || ''
  },
  methods: {
    init () {
      this.getDataSourceList()
    },
    // 格式化 sql 编辑器
    formatSqlData () {
      this.$refs.sqlEdit.formaterSql()
    },
    // 参数设置
    async settingParam () {
      this.settingParamVisiable = true
      // const body = {}
      // const keys = ['type', 'name', 'dataType', 'useInGlobal', 'defaultValue']
      try {
        // const data = await getSqlVariables(body)
        const data = [
          {
            type: 'placeholder',
            name: 'tel'
          },
          {
            type: 'param',
            name: 'n'
          }
        ]
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
      body.sqlVariables = this.sqlVariables
      this.current_id && (body._id = this.current_id)
      if (this.sqlVariables && this.sqlVariables.length > 0) {
        body.sqlVariables = this.sqlVariables
      }
      console.log('run sql body', body)
      try {
        const data = await runtimeForSql(body)
        this.runResultData = data
        if (this.current_id !== data._id) {
          this.current_id = data._id
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
        body.sqlVariables = this.sqlVariables
        this.current_id && (body._id = this.current_id)
        if (this.sqlVariables && this.sqlVariables.length > 0) {
          body.sqlVariables = this.sqlVariables
        }
        const data = createUpdateSql(body)
        if (this.current_id !== data._id) {
          this.current_id = data._id
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 删除
    deleteSqlVariable () {},
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
    toDataSetPage () {
      this.$router.push({
        path: '/dataSet'
      })
    },
    // 保存数据
    async onSave () {
      try {
        const body = {}

        const data = await createDataSets(body)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
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
</style>
