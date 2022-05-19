<template>
  <div class="edit-wrap bg-c-fff">
    <!-- header -->
    <div class="edit-wrap-header">
      <div>
        <i
          class="el-icon-arrow-left h-c-p m-r-8"
          @click="checkExit"
        />
        <span>{{ dataInfo.displayName || '未命名' }}</span>
      </div>
      <div class="edit-wrap-header-r">
        <el-button
          type="primary"
          :loading="saveBtnLoading"
          :disabled="toggleContent"
          @click="showSaveDialog()"
        >保存</el-button>
      </div>
    </div>

    <!-- main -->
    <div>
      <div
        v-show="toggleContent"
        class="d-f p-16-16 f-b-s bg-c-f8f8f8 h-40"
      >
        <div class="d-f">
          <div>
            <svg-icon
              icon-class="sql"
              style="margin-right: 8px;width:20px;height:32px;"
            />
          </div>
          <div>
            <el-input
              v-model="editDataInfo.displayName"
              style="width: 300px;"
              :class="{'error-input': isErrorName}"
              max-length="50"
              placeholder="未命名SQL"
              @input="checkDisplayName"
            />
            <el-tooltip
              class="m-l-8"
              content="字段名称只能由中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号组成，不超过50个字符"
              placement="bottom-start"
              effect="light"
            >
              <i class="el-icon-warning-outline" />
            </el-tooltip>
            <div
              :class="{'error-input-text': isErrorName}"
              style="display: none;"
            >
              <b-tooltip
                :content="errorInputText"
                width="300px"
                placement="bottom-start"
              />
            </div>
          </div>
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
            @click="showParamsSetDrawer"
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
            @click="handlerToggleContent"
          ><i class="el-icon-close" /></el-button>
        </div>
      </div>

      <div class="d-f">
        <div
          v-resize-width="{max: 500, min: 0}"
          :class="[{'full-height': !toggleContent, 'hide': isShrinkLeft}, 'side-bar']"
        >
          <div class="side-top">
            <div v-show="toggleContent">
              <div class="side-top-label"><span>选择数据源</span></div>
              <el-select
                v-model="editDataInfo.dataSourceId"
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
            <div v-show="!toggleContent">
              <div class="side-top-label"><span>当前数据源</span></div>
              <div><span class="side-top-text">{{ dataInfo.dataSourceName }}</span></div>
            </div>
          </div>
          <!-- 收缩按钮 -->
          <div
            class="left-shrink-btn bg-c-fff"
            @click="isShrinkLeft = !isShrinkLeft"
          >
            <i :class="{'el-icon-arrow-right': isShrinkLeft, 'el-icon-arrow-left': !isShrinkLeft}" />
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
              :toggle-content="toggleContent"
            />
          </div>
        </div>

        <div class="main-panel">
          <!-- SQL编辑器 -->
          <div :class="[{'full-height': !toggleContent}, 'main-edit']">
            <EditSql
              v-if="toggleContent"
              ref="sqlEdit"
              :tables="hintOptions"
              edit-height="calc(100vh - 110px)"
              :value="editDataInfo.sql.sql"
              @changeTextarea="sqlStatementChange($event)"
            />
            <div
              v-else
              class="p-16-16 h-100p"
              @dblclick.stop="gotoEdit"
            >
              <span>{{ dataInfo.sql.sql }}</span>
              <div class="edit-sql-btn">
                <el-button
                  type="text"
                  icon="el-icon-edit-outline"
                  @click.stop="gotoEdit"
                >编辑</el-button>
              </div>
            </div>
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
              ref="runner"
              v-loading="resultPreviewLoading"
              :result-data="resultData"
              :history-log-table-data="historyLogTableData"
            />
            <!-- 数据预览 -->
            <resetter
              v-show="!toggleContent"
              ref="resetter"
              :fields="dataInfo.fields"
              :sql="dataInfo.sql"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { format } from 'sql-formatter'
import regex from '@/constants/regex'
import Runner from '@/views/dataManage/dataSet/dataSetEdit/Runner'
import Resetter from '@/views/dataManage/dataSet/dataSetEdit/Resetter'
import TableList from '@/views/dataManage/dataSet/dataSetEdit/TableList'
import EditSql from '@/components/SqlEditor/index.vue'
import { getDataSetsInfo, runtimeForSql, getSqlRunningLogs, confirmEditSql, getDataSourceData, dataFiles, getDataTable, updateDataSet, existsDataSet } from '@/api/dataSet'
import { deepClone } from '@/utils/optionUtils'

export default {
  components: { Runner, Resetter, TableList, EditSql },
  data () {
    return {
      regex: regex,
      // 数据集名称是否错误
      isErrorName: false,
      errorInputText: '',
      // 回显&提交的数据
      dataInfo: {
        _id: '',
        // 脚本集名称
        displayName: '',
        // 数据源id
        dataSourceId: '',
        // 数据源名称
        dataSourceName: '',
        // 目录地址
        folderId: null,
        // 数据源类型
        dataSourceType: '',
        // 脚本集SQL信息
        sql: { _id: '', sql: '' }
      },
      // 编辑中的数据
      editDataInfo: {
        // 脚本集名称
        displayName: '',
        // 数据源id
        dataSourceId: '',
        // 数据源名称
        dataSourceName: '',
        // 脚本集SQL信息
        sql: { _id: '', sql: '' }
      },
      saveBtnLoading: false,
      // sql 编辑器提示语合集
      hintOptions: {},
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
      // 左侧栏收缩
      isShrinkLeft: false,
      draggableContainerHeight: { height: '400px' },
      // 运行结果集
      resultData: { success: true },
      resultPreviewLoading: false,
      // 历史记录集
      historyLogTableData: []
    }
  },
  async created () {
    await this.getDataSourceList()
    const queryDataSourceId = this.$route.query.dataSourceId
    if (queryDataSourceId) {
      this.dataInfo.dataSourceId = queryDataSourceId
      this.handleChangeDataSource(queryDataSourceId)
    }
    const data = this.$route.query
    // 存在id，获取数据集详情
    if (data._id) {
      this.getDetail()
      this.toggleContent = false
    }
  },
  methods: {
    checkDisplayName () {
      if (this.editDataInfo.displayName === '') {
        this.errorInputText = '数据集名称不能为空'
        return '数据集名称不能为空'
      } else {
        this.isErrorName = !regex.DATASET_NAME_REGEX.test(this.editDataInfo.displayName)
        if (this.isErrorName) {
          this.errorInputText = '字段名称只能由中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号组成，不超过50个字符'
          return '数据集名称不符合规范'
        }
      }
      return null
    },
    // 获取数据集详情
    async getDetail () {
      const result = await getDataSetsInfo(this.$route.query._id)
      this.dataInfo = deepClone(result)
      this.editDataInfo = deepClone(result)
      this.historyLogTableData = this.dataInfo.sql.history
      await this.getDataSourceList()
      this.handleChangeDataSource(this.editDataInfo.dataSourceId)
      // 存在详情，需要回显数据源名称
      this.dataInfo.dataSourceName = deepClone(this.editDataInfo.dataSourceName)
    },
    // 打开保存窗口
    showSaveDialog () {
      // 更新数据集无需弹窗提示，直接保存
      if (this.dataInfo._id) {
        if (regex.DATASET_NAME_REGEX.test(this.dataInfo.displayName)) {
          // 校验数据集名称是否符合
          const body = {
            _id: this.dataInfo._id,
            displayName: this.dataInfo.displayName,
            sql: this.dataInfo.sql,
            fields: this.dataInfo.fields,
            comment: this.dataInfo.comment,
            folderId: this.dataInfo.folderId
          }
          this.saveBtnLoading = true
          updateDataSet(body._id, body).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.go(-1)
          }).finally(e => {
            this.saveBtnLoading = false
          })
        } else {
          this.$message.error('字段名称只能由中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号组成，不超过50个字符')
        }
      } else {
        this.$dialog.show('SaveDataSetDialog', { dataInfo: this.dataInfo }, () => {
          this.$router.go(-1)
        })
      }
    },
    // 格式化 sql 编辑器
    formatSqlData () {
      const formatSql = format(this.editDataInfo.sql.sql).replaceAll('$ ', '$').replaceAll('{ ', '{').replaceAll(' }', '}')
      this.$refs.sqlEdit?.editor.setValue(formatSql)
    },
    // 参数设置
    showParamsSetDrawer () {
      const sqlVariablesTableData = deepClone(this.editDataInfo.sql.sqlVariables)
      this.$dialog.show('DatasetParamsDrawer', { sql: this.editDataInfo.sql.sql, sqlVariablesTableData }, (variable) => {
        this.editDataInfo.sql.sqlVariables = variable
      })
    },
    // 获取改变的sql语句
    sqlStatementChange (sql) {
      this.editDataInfo.sql.sql = sql
    },
    // 运行
    async runSql () {
      // dataSourceId & sql语句  必须
      const body = {
        sql: this.editDataInfo.sql.sql,
        dataSourceId: this.editDataInfo.dataSourceId,
        type: this.editDataInfo.dataSourceType,
        _id: this.editDataInfo.sql._id,
        sqlVariables: this.editDataInfo.sql.sqlVariables
      }
      try {
        this.resultPreviewLoading = true
        const data = await runtimeForSql(body)
        this.resultData = Object.assign({ success: true }, data.result)
        if (this.editDataInfo.sql._id !== data._id) {
          this.editDataInfo.sql._id = data._id
        }
        this.getHistory()
      } catch (error) {
        this.resultData = Object.assign({ success: false }, error)
      }
      this.resultPreviewLoading = false
    },
    // 获取历史记录
    async getHistory () {
      if (this.dataInfo.sql._id) {
        try {
          const data = await getSqlRunningLogs(this.editDataInfo.sql._id)
          this.historyLogTableData = data.slice()
        } catch (error) {
          console.log(error)
        }
      }
    },
    gotoEdit () {
      this.toggleContent = !this.toggleContent
      this.editDataInfo = deepClone(this.dataInfo)
    },
    // 确认编辑
    async confirmEdit () {
      // 判断数据集名称
      const checkDisplayName = this.checkDisplayName()

      if (checkDisplayName) {
        this.$message.error(checkDisplayName)
        return
      } else {
        const flag = await this.existDataSet()
        if (flag) {
          return
        }
      }
      // 判断sql是否为空
      if (this.editDataInfo.sql.sql === '' || regex.EMPTY_REGEX.test(this.editDataInfo.sql.sql)) {
        this.$message.error('SQL脚本不能为空')
        return
      }

      try {
        const body = {
          _id: this.editDataInfo.sql._id,
          sql: this.editDataInfo.sql.sql,
          dataSourceId: this.editDataInfo.dataSourceId,
          sqlVariables: this.editDataInfo.sql.sqlVariables
        }
        const data = await confirmEditSql(body)
        Object.assign(this.dataInfo, this.editDataInfo)
        Object.assign(this.dataInfo.sql, data.sql)
        this.dataInfo.fields = data.fields
        this.$message({
          message: '恭喜你，确认编辑成功',
          type: 'success'
        })
        this.toggleContent = false
      } catch (error) {
        console.error(error)
      }
    },
    checkExit () {
      this.$dialog.show('TipDialog', { content: '您还未对此次代码的编辑进行确认，若此时返回，本次编辑内容将不被保存，请问您是否确认返回？' }, () => {
        this.$router.go(-1)
      })
    },
    handlerToggleContent () {
      // 判断数据是否发生变更
      // 这边仅针对数据集名称、SQL脚本、数据源ID
      let flag = false
      if (this.dataInfo.dataSourceId !== this.editDataInfo.dataSourceId ||
        this.dataInfo.displayName !== this.editDataInfo.displayName ||
        this.dataInfo.sql._id !== this.editDataInfo.sql._id ||
        this.dataInfo.sql.sql !== this.editDataInfo.sql.sql) {
        flag = true
      }
      if (flag) {
        this.$dialog.show('TipDialog', { content: '您还未对此次代码的编辑进行确认，若此时返回，本次编辑内容将不被保存，请问您是否确认返回？' }, () => {
          this.toggleContent = !this.toggleContent
        })
      } else {
        this.toggleContent = !this.toggleContent
        // 这里是编码上的坑，如果把编辑页与详情页分开就不需要刷新数据源列表
        if (this.dataInfo.dataSourceId !== this.editDataInfo.dataSourceId) {
          this.handleChangeDataSource(this.dataInfo.dataSourceId)
        }
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
        this.editDataInfo.dataSourceId = val
        this.editDataInfo.sql.dataSourceId = val
        this.editDataInfo.dataSourceName = currentDataSource?.displayName
        this.editDataInfo.dataSourceType = type

        if (type === 'file') {
          const result = await dataFiles()
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
      const height = window.innerHeight - 200
      this.draggableContainerHeight.height = this.isShrink ? '0px' : height + 'px'
      this.$refs.runner.setTableHeight(this.draggableContainerHeight.height)
      this.$refs.resetter.setTableHeight(this.draggableContainerHeight.height)
    },
    drag (e) {
      const clientHeight = document.body.clientHeight
      if (e.clientY > (clientHeight) || e.clientY < 200) {
        return
      }
      // 设定箭头方向
      this.isShrink = (e.clientY > (clientHeight / 2))
      this.draggableContainerHeight.height = (clientHeight - e.clientY) + 'px'
    },
    dragend (e) {
      const clientHeight = document.body.clientHeight
      if (e.clientY < 200) {
        const height = window.innerHeight - 200
        this.draggableContainerHeight.height = height + 'px'
        return
      }
      if (e.clientY > (clientHeight)) {
        return
      }
      this.isShrink = (e.clientY > (clientHeight / 2))
      this.draggableContainerHeight.height = (clientHeight - e.clientY) + 'px'
      this.$refs.runner.setTableHeight(this.draggableContainerHeight.height)
      this.$refs.resetter.setTableHeight(this.draggableContainerHeight.height)
    },
    async existDataSet (rule, value, callback) {
      const isExist = await existsDataSet({ excludeId: this.editDataInfo._id, displayName: this.editDataInfo.displayName })
      if (isExist) {
        this.$message.error('数据集名称已存在！')
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .error-input > .el-input__inner {
  border: 1px solid #ff4949;
}
.error-input-text {
  color: #ff4949;
  display: block !important;
}
.edit-wrap {
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

// @keyframes turn-out {
//   from {
//     width: 200px;
//   }
//   to {
//     width: 0px;
//   }
// }
// @keyframes turn-in {
//   from {
//     width: 0px;
//   }
//   to {
//     width: 200px;
//   }
// }
.side-bar {
  display: inline-block;
  background-color: #fff;
  border-right: 1px solid #dddddd;
  height: calc(100vh - 167px);
  width: 250px;
  position: relative;

  &.hide {
    width: 0px !important;
    // animation-name: turn-out;
    // animation-duration: 0.3s;
    .side-top {
      padding: 0px;
    }
  }

  &.full-height {
    height: calc(100vh - 50px);
  }

  .side-top {
    padding: 20px 12px;
    border-bottom: 1px solid #e8e8e8;
    position: relative;

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

  .left-shrink-btn {
    position: absolute;
    right: -15px;
    top: 50px;
    cursor: pointer;
    height: 80px;
    width: 15px;
    line-height: 80px;
    z-index: 99;
    box-shadow: 0px 2px 8px 0px rgb(200 201 204 / 50%);
    border-radius: 0px 50px 50px 0px/0px 50px 50px 0px;
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
      height: calc(100vh - 50px);
    }
  }

  .draggable-container {
    width: 100%;
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
.edit-sql-btn {
  position: absolute;
  right: 0px;
  width: 64px;
  height: 32px;
  background: #ffffff;
  box-shadow: 0px 12px 48px 16px rgb(0 0 0 / 3%),
    0px 9px 28px 0px rgb(0 0 0 / 5%), 4px 6px 16px -8px #f1ae82;
  border-radius: 16px 0px 0px 16px;
  text-align: center;
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
::v-deep .CodeMirror-scroll {
  background-color: #f2f2f2;
}
</style>
