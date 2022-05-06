<template>
  <page-view>
    <div class="data-set-wrap">
      <div class="data-set-wrap-content">
        <!-- header -->
        <div class="data-set-header">
          <div class="data-set-header-l">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="createFolder"
            >新建文件夹</el-button>
            <el-button @click="createDataSet">新建数据集</el-button>
          </div>
          <div class="data-set-header-r">
            <el-input
              v-model="serachName"
              placeholder="请输入文件/数据集名称"
              style="margin-right: 12px"
            />
            <el-button
              type="primary"
              @click="query"
            >查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>

        <div
          v-show="multipleSelection && multipleSelection.length > 0"
          class="data-set-multiple"
        >
          <span>已选{{ multipleSelection.length }}项</span>
          <el-button
            type="text"
            @click="moveTo()"
          >移动到</el-button>
          <el-button
            type="text"
            @click="clearSelection()"
          >取消选择
          </el-button>
        </div>

        <!-- main -->
        <div
          v-if="isAllDataShow"
          class="data-set-main"
        >
          <el-table
            ref="multipleTable"
            v-loading="dataSetLoading"
            lazy
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            row-key="_id"
            :load="loadDataSet"
            :tree-props="{children: 'children', hasChildren: 'isFolder'}"
            @select="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="名称"
              min-width="200"
            >
              <template slot-scope="scope">
                <svg-icon
                  :icon-class="scope.row.isFolder? 'floder': 'sql'"
                  style="margin-right: 8px"
                />
                <el-popover
                  v-if="!scope.row.isFolder"
                  placement="top-start"
                  title="点击编辑数据集"
                  style="color: rgba(0, 0, 0, 0.3);line-height: 20px;"
                  trigger="hover"
                >
                  <el-button
                    slot="reference"
                    type="text"
                    @click="handleCellClick(scope.row)"
                  >{{ scope.row.name || scope.row.displayName }}</el-button>
                </el-popover>
                <span v-else>{{ scope.row.name || scope.row.displayName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="creatorName"
              label="创建者"
              min-width="120"
            />
            <el-table-column
              prop="lastUpdatedTime"
              label="修改时间"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.lastUpdatedTime | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dataSourceName"
              label="数据源"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              label="操作"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div
                  v-if="!scope.row.isFolder"
                  class="data-set-main-table-options"
                  :class="{'no-allowed': batchSelection}"
                >
                  <span @click="edit(scope.row)">编辑</span>
                  <el-divider direction="vertical" />
                  <span @click="createDashboard(scope.row)">新建仪表盘</span>
                  <el-divider direction="vertical" />
                  <span @click="showAttribute(scope.row)">属性</span>
                  <el-divider direction="vertical" />
                  <el-dropdown trigger="click">
                    <el-button type="text">更多</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="moveTo(scope.row)">移动到</el-dropdown-item>
                      <el-dropdown-item @click.native="deleteDataSet(scope.row)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div
                  v-else
                  class="data-set-main-table-options"
                  :class="{'no-allowed': batchSelection}"
                >
                  <span @click="rename(scope.row)">重命名</span>
                  <el-divider direction="vertical" />
                  <span @click="deleteFloder(scope.row)">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="text-align: right; margin-top: 16px"
          :total="pagination.total">
        </el-pagination> -->
        </div>

        <div
          v-else
          class="data-set-main"
        >
          <el-table
            ref="multipleTable"
            v-loading="dataSetLoading"
            :data="dataSetData"
            tooltip-effect="dark"
            style="width: 100%"
            row-key="_id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="名称"
              min-width="200"
            >
              <template slot-scope="scope">
                <svg-icon
                  icon-class="sql"
                  style="margin-right: 8px"
                />
                <el-button
                  slot="reference"
                  type="text"
                  @click="handleCellClick(scope.row)"
                >{{ scope.row.name || scope.row.displayName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="root"
              label="文件路径"
              min-width="100"
            />
            <el-table-column
              prop="creatorName"
              label="创建者"
              min-width="120"
            />
            <el-table-column
              prop="lastUpdatedTime"
              label="修改时间"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.lastUpdatedTime | dateFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dataSourceName"
              label="数据源"
              min-width="120"
            />
            <el-table-column
              label="操作"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div
                  class="data-set-main-table-options"
                  :class="{'no-allowed': batchSelection}"
                >
                  <span @click="edit(scope.row)">编辑</span>
                  <el-divider direction="vertical" />
                  <span @click="createDashboard(scope.row)">新建仪表盘</span>
                  <el-divider direction="vertical" />
                  <span @click="showAttribute(scope.row)">属性</span>
                  <el-divider direction="vertical" />
                  <el-dropdown trigger="click">
                    <el-button type="text">更多</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="moveTo(scope.row)">移动到</el-dropdown-item>
                      <el-dropdown-item @click.native="deleteDataSet(scope.row)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dataSetPagination.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="dataSetPagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="text-align: right; margin-top: 16px"
          :total="dataSetPagination.total">
        </el-pagination> -->
        </div>

        <!-- 各种 弹窗 & 抽屉 -->
        <el-dialog
          title="新建文件夹"
          :visible.sync="createFloderVisible"
          width="30%"
        >
          <div class="create-floder">
            <div style="line-height: 32px; width: 70px"><span>文件名称</span></div>
            <el-input
              v-model="newFloderName"
              placeholder="请输入文件名称"
              style="margin-left: 12px;height: 32px"
            />
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="createFloderVisible = false; newFloderName = ''">取 消</el-button>
            <el-button
              style="background-color: #FA8334;color: #fff;"
              @click="hanleCreateFloder"
            >确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="文件夹重命名"
          :visible.sync="renameFolderVisible"
          width="480px"
        >
          <div class="data-set-didlog-main">
            <span>文件夹名称</span>
            <el-input
              v-model="editFloderName"
              placeholder="请输入文件夹名称"
              class="data-set-didlog-main-input"
            />
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="renameFolderVisible = false">取 消</el-button>
            <el-button
              style="background-color: #FA8334;color: #fff;"
              @click="hanleRenameFloder"
            >确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="编辑数据集"
          :visible.sync="editDataSetVisible"
          width="480px"
        >
          <div class="data-set-didlog-main">
            <span>数据集名称</span>
            <el-input
              v-model="updateDataSetName"
              placeholder="请输入文件夹名称"
              class="data-set-didlog-main-input"
            />
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="editDataSetVisible = false">取 消</el-button>
            <el-button
              style="background-color: #FA8334;color: #fff;"
              @click="hanleEditFile"
            >确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="删除提示"
          :visible.sync="deleteFolderVisible"
          width="480px"
        >
          <div class="data-set-didlog-del">
            <svg-icon
              icon-class="warning"
              style="margin-right: 16px"
            />
            <span>确定删除文件夹吗？</span>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="deleteFolderVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="hanleDeleteFolder"
            >确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="删除提示"
          :visible.sync="deleteDataSetVisible"
          width="480px"
        >
          <div class="data-set-didlog-del">
            <svg-icon
              icon-class="warning"
              style="margin-right: 16px"
            />
            <span>确定删除数据集吗？</span>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="deleteDataSetVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="hanleDeleteDataSet"
            >确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="属性"
          :visible.sync="dataSetAttributeVisible"
          width="480px"
        >
          <div class="data-set-didlog-main">
            <el-form
              :model="dataSetAttr"
              style="padding: 0px"
            >
              <el-form-item
                label="名称"
                label-width="80px"
              >
                <el-input
                  v-model="dataSetAttr.name"
                  autocomplete="off"
                  style="width: 360px"
                />
              </el-form-item>
              <el-form-item
                label="描述"
                label-width="80px"
              >
                <el-input
                  v-model="dataSetAttr.desc"
                  type="textarea"
                  style="width: 360px"
                />
              </el-form-item>
            </el-form>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dataSetAttributeVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="hanleDataSetAttribute"
            >确 定</el-button>
          </span>
        </el-dialog>

      </div>
    </div>
  </page-view>
</template>

<script>
// import qs from 'qs'
import { createFloders, updateFolderName, delFolders, updateDataSet, delDataSet, getDataSetsFolders } from '@/api/dataSet'
import { getDateTime } from '@/utils/optionUtils'
export default {
  name: 'DataSet',
  data () {
    return {
      serachName: '',
      updateDataSetName: '',
      // 数据集表格数据
      tableData: [],
      dataSetLoading: true,
      multipleSelection: [],
      createFloderVisible: false,
      newFloderName: '',
      editDataSetVisible: false,
      deleteFolderVisible: false,
      deleteDataSetVisible: false,
      dataSetAttributeVisible: false,
      dataSetAttr: {
        name: '',
        desc: ''
      },
      editFloderName: '',
      renameFolderVisible: false,
      currentFloder: null,
      cureentDataSet: null,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 55
      },
      // 数据集数据
      dataSetData: [],
      moreToolTipDisabled: true,
      isAllDataShow: true,
      dataSetPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 55
      }
    }
  },
  computed: {
    batchSelection: function () {
      return this.multipleSelection.filter(item => !item.isFolder).length > 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // element lazy数据会被缓存，需要清理
      this.$set(this.$refs.multipleTable.store.states, 'lazyTreeNodeMap', {})
      // 先清空数据，否则对拥有子层级的列表无法刷新data
      this.currentFloder = null
      this.cureentDataSet = null
      this.multipleSelection = []
      this.serachName = ''
      this.tableData = []
      this.isAllDataShow = true
      this.getTableData()
    },
    // 获取 tableData
    async getTableData () {
      this.dataSetLoading = true
      try {
        const data = await getDataSetsFolders()
        this.tableData = data
      } catch (error) {
        console.log(error)
      }
      this.dataSetLoading = false
    },
    // 查询
    async query () {
      if (!this.serachName) {
        this.isAllDataShow = true
        return this.$message({
          message: '请输入正确的数据集名称',
          type: 'warning'
        })
      }
      this.isAllDataShow = false
      const searchkey = this.serachName
      this.dataSetLoading = true
      try {
        const data = await getDataSetsFolders({ searchkey })
        this.dataSetData = data.filter(item => !item.isFolder)
      } catch (error) {
        console.log(error)
      }
      this.dataSetLoading = false
    },
    // 新建文件夹
    createFolder () {
      this.createFloderVisible = true
    },
    async hanleCreateFloder () {
      const body = {
        type: 'dataSet',
        name: this.newFloderName
      }
      try {
        const data = await createFloders(body)
        console.log('createFloders data', data)
        this.createFloderVisible = false
        this.newFloderName = ''
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    // 新建数据集
    createDataSet () {
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
        dataSourceId: '',
        dataSourceName: '',
        creatorName: '',
        createdTime: currentTime
      }
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
    },
    // 重置
    reset () {
      this.init()
    },
    // 多选
    handleSelectionChange (val) {
      console.log(val, '多选')
      this.multipleSelection = val
    },
    // 取消选择
    clearSelection () {
      this.$refs.multipleTable.clearSelection()
      this.multipleSelection = []
    },
    // table options
    edit (val) {
      if (this.batchSelection) return false
      this.cureentDataSet = val
      this.editDataSetVisible = true
      this.updateDataSetName = val.displayName
    },
    async hanleEditFile () {
      console.log(this.cureentDataSet)
      const id = this.cureentDataSet._id
      const params = {
        displayName: this.updateDataSetName
      }
      try {
        const data = await updateDataSet(id, params)
        console.log(data)
        this.editDataSetVisible = false
        this.currentFloder = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    createDashboard () {
      if (this.batchSelection) return false
    },
    showAttribute (val) {
      if (this.batchSelection) return false
      this.cureentDataSet = val
      this.dataSetAttributeVisible = true
      this.dataSetAttr.name = val.displayName
      this.dataSetAttr.desc = val.comment
    },
    async hanleDataSetAttribute () {
      const id = this.cureentDataSet._id
      const params = {
        displayName: this.dataSetAttr.name,
        comment: this.dataSetAttr.desc
      }
      try {
        const data = await updateDataSet(id, params)
        console.log(data)
        this.dataSetAttributeVisible = false
        this.cureentDataSet = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    showMore () {
      if (this.batchSelection) return false
      this.moreToolTipDisabled = false
    },
    rename (val) {
      if (this.batchSelection) return false
      this.currentFloder = val
      this.renameFolderVisible = true
      this.editFloderName = val.name
    },
    async hanleRenameFloder () {
      const id = this.currentFloder._id
      const body = {
        name: this.editFloderName
      }
      try {
        const data = await updateFolderName(id, body)
        this.$message.success(data)
        this.editFloderName = ''
        this.currentFloder = null
        this.init()
      } catch (error) {
        console.log(error)
      }
      this.renameFolderVisible = false
    },
    deleteFloder (val) {
      if (this.batchSelection) return false
      this.currentFloder = val
      this.deleteFolderVisible = true
    },
    async hanleDeleteFolder () {
      const id = this.currentFloder._id
      try {
        const data = await delFolders(id)
        this.$message.success(data)
        this.deleteFolderVisible = false
        this.currentFloder = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    deleteDataSet (val) {
      if (this.batchSelection) return false
      this.cureentDataSet = val
      this.deleteDataSetVisible = true
    },
    async hanleDeleteDataSet () {
      const id = this.cureentDataSet._id
      try {
        const data = await delDataSet(id)
        this.$message.success(data)
        this.deleteDataSetVisible = false
        this.cureentDataSet = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    async moveTo (val) {
      const ids = []
      if (val) {
        ids.push(val._id)
      } else {
        this.multipleSelection.forEach(item => {
          if (typeof item.isFolder !== 'undefined' && !item.isFolder) {
            ids.push(item._id)
          }
        })
      }
      this.$dialog.show('MoveDatasetDrawer', { ids }, () => {
        this.init()
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    handleUpdateDataSetName () {
      this.editDataSetVisible = false
    },
    handleCellClick (row) {
      const query = row
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
    },
    async loadDataSet (tree, treeNode, resolve) {
      const folderId = tree._id
      try {
        const data = await getDataSetsFolders({ folderId })
        console.log(data)
        resolve(data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.data-set-wrap {
  height: 100%;
  width: 100%;

  &-content {
    background: #fff;
    padding: 16px;
    margin-top: 16px;
    height: calc(100vh - 50px);
  }
}

.data-set-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-l {
    display: flex;
  }

  &-r {
    display: flex;
  }
}

.data-set-multiple {
  height: 40px;
  background: #fef6e7;
  border: 1px solid rgba(252, 214, 138, 1);
  margin-top: 16px;
  margin-bottom: 8px;
  line-height: 40px;
  padding: 0 16px;
  font-size: 12px;
  color: #fa8334;
  font-weight: 400;
}

.data-set-multiple > span {
  margin-right: 24px;
  cursor: pointer;
}

.data-set-main {
  &-table {
    &-options {
      color: #fa8334;
      text-align: left;
      font-weight: 400;
    }
    &-options > span {
      cursor: pointer;
    }
  }
}

.no-allowed > span {
  cursor: not-allowed;
}

.data-set-didlog {
  &-main {
    display: flex;
    justify-content: center;
    align-items: center;
    &-input {
      width: 340px;
      margin-left: 16px;
    }
    ::v-deep .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }

  &-del {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
  }
}

.dialog-footer {
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

::v-deep .el-dialog__footer {
  padding: 0px;
}

.create-floder {
  display: flex;
  ::v-deep .el-input__inner {
    height: 32px;
  }
}
</style>
