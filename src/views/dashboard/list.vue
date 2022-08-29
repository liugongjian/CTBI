/* eslint-disable vue/no-parsing-error */
<template>
  <page-view>
    <div class="data-set-wrap">
      <div class="data-set-wrap-content">
        <!-- header -->
        <div class="data-set-header">
          <div class="data-set-header-l">
            <el-dropdown trigger="click">
              <el-button
                type="primary"
                icon="el-icon-plus"
              >新建仪表板</el-button>
              <el-dropdown-menu slot="dropdown" class="new-create-dropdown">
                <el-dropdown-item @click.native="createDashboard">自定义</el-dropdown-item>
                <el-dropdown-item @click.native="handleNewCreate">从模板新建</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button style="margin-left: 10px" @click="createFolder">新建文件夹</el-button>
          </div>
          <div class="data-set-header-r">
            <el-input
              v-model="searchName"
              placeholder="请输入名称"
              style="margin-right: 12px"
              @keyup.enter.native="query"
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
          >取消选择 </el-button>
        </div>

        <!-- main -->
        <div class="data-set-main">
          <el-table
            ref="multipleTable"
            v-loading="dataLoading"
            lazy
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            row-key="_id"
            :load="loadDashboard"
            :tree-props="{ children: 'children', hasChildren: 'directory' }"
            @select="handleSelectionChange"
            @select-all="handleSelectAll"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="row => !row.directory"
              :render-header="renderSelectHeader"
            />
            <el-table-column
              prop="name"
              label="名称"
              min-width="150"
            >
              <template slot-scope="scope">
                <svg-icon
                  :icon-class="scope.row.directory ? 'folder' : 'board'"
                  style="margin-right: 8px"
                />
                <el-tooltip
                  v-if="!scope.row.directory"
                  placement="top"
                  effect="light"
                >
                  <template slot="content">
                    <span class="tooltip-light-content">点击编辑仪表板</span>
                  </template>
                  <el-button
                    type="text"
                    @click="edit(scope.row)"
                  >{{
                    scope.row.name || scope.row.displayName
                  }}</el-button>
                </el-tooltip>
                <span v-else>{{
                  scope.row.name || scope.row.displayName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishStatus"
              label="发布状态"
              min-width="80"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div
                  v-if="!scope.row.directory"
                  class="publish-status"
                >
                  <div
                    class="status-tip"
                    :class="`status-tip${scope.row.publishStatus}`"
                  />
                  <p>{{ scope.row.publishStatus === 1 ? "已发布" : scope.row.publishStatus === 2 ? "未发布" : "已下线" }}</p>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="onSearched"
              prop="path"
              label="文件路径"
              min-width="120"
            >
              <template slot-scope="scope">
                <div style="color:#4393F4;">{{ scope.row.path }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="ownerName"
              label="创建者"
              min-width="60"
            />
            <el-table-column
              prop="lastUpdatedTime"
              label="修改时间"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ formatTime( scope.row ) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div
                  class="data-set-main-table-options"
                  :class="{ 'no-allowed': batchSelection }"
                >
                  <span @click="edit(scope.row)">编辑</span>
                  <el-divider
                    v-if="scope.row.directory"
                    direction="vertical"
                  />
                  <span
                    v-if="scope.row.directory"
                    @click="deleteData(scope.row)"
                  >删除</span>
                  <el-divider
                    v-if="!scope.row.directory"
                    direction="vertical"
                  />
                  <span
                    v-if="!scope.row.directory"
                    @click="editDashboardAttribute(scope.row)"
                  >属性</span>
                  <el-divider
                    v-if="!scope.row.directory"
                    direction="vertical"
                  />
                  <span
                    v-if="!scope.row.directory"
                    @click="preview(scope.row)"
                  >预览</span>
                  <el-divider
                    v-if="!scope.row.directory"
                    direction="vertical"
                  />
                  <el-dropdown
                    v-if="!scope.row.directory"
                    class="data-more"
                  >
                    <span>更多</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native="shareDashboard(scope.row)"
                      >发布</el-dropdown-item>
                      <el-dropdown-item @click.native="moveTo(scope.row)">移动到</el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.publishStatus === 1"
                        @click.native="cancelPublish(scope.row)"
                      >下线</el-dropdown-item>
                      <el-dropdown-item @click.native="deleteData(scope.row)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            class="pagination"
            :total="pageInfo.total"
            :page-num="pageInfo.pageNum"
            :page-size="pageInfo.pageSize"
            @pagination="handlePageChange"
          />
        </div>

        <!-- 各种 弹窗 & 抽屉 -->

        <el-dialog
          title="删除提示"
          :visible.sync="deleteDataVisible"
          :close-on-click-modal="false"
          width="480px"
        >
          <div class="data-set-didlog-del">
            <svg-icon
              icon-class="warning"
              style="margin-right: 16px"
            />
            <span
              v-if="cureentData && cureentData.directory && cureentData.childNode.length > 0"
            >该文件夹下面有仪表板，请移除后再删除</span>
            <span v-else>确定删除该{{ cureentData && cureentData.directory ? '文件夹' : '仪表板' }}吗？</span>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="deleteDataVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="hanledeleteData"
            >确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="下线提示"
          :visible.sync="cancelPublishVisible"
          :close-on-click-modal="false"
          width="480px"
        >
          <div class="data-set-didlog-del">
            <svg-icon
              icon-class="warning"
              style="margin-right: 16px"
            />
            <span>下线后该报表不可被查看</span>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="cancelPublishVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="handleCancelPublish"
            >确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="属性"
          :visible.sync="dashboardAttributeVisible"
          width="480px"
          :close-on-click-modal="false"
          @close="hiddenDashboardAttribute"
        >
          <div class="data-set-didlog-main">
            <el-form
              ref="attrForm"
              style="padding: 0px"
              :model="dashboardAttr"
              :rules="attrRules"
              label-width="40px"
            >
              <el-form-item
                label="名称"
                prop="name"
              >
                <el-input
                  v-model="dashboardAttr.name"
                  placeholder="请输入仪表板名称"
                  style="width: 360px"
                />
              </el-form-item>
              <el-form-item
                label="描述"
                prop="description"
                style="margin-top: 30px"
              >
                <el-input
                  v-model="dashboardAttr.description"
                  type="textarea"
                  placeholder="请输入描述，不超过200字"
                  style="width: 360px"
                />
              </el-form-item>
            </el-form>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="hiddenDashboardAttribute">取 消</el-button>
            <el-button
              type="primary"
              @click="handleDashboardAttribute"
            >确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <FolderEdit
        :visible="folderDialogVisible"
        :data="editFolder"
        @handleAction="handleFolderEdit"
      />
      <FolderTree
        ref="treeFolder"
        :visible="treeVisible"
        :ids="moveDashboardIds"
        @handleAction="handleMoveDashboard"
      />
      <ShareDialog ref="shareDialog" from="list" :data="cureentData" @handleAction="handleShareChange" />
      <NewCreateDialog :new-create-visible.sync="newCreateVisible" />
    </div>
  </page-view>
</template>

<script>
// import qs from 'qs'
import {
  getDashboardList,
  batchDeleteResources,
  cancelShareDashboard,
  updateFolderOrDashboardProperties
} from '@/api/dashboard'
import FolderEdit from './FolderEdit'
import FolderTree from './FolderTree'
import ShareDialog from './ShareDialog'
import NewCreateDialog from './NewCreateDialog'
import Pagination from '@/components/Pagination/index.vue'
import moment from 'moment'
export default {
  name: 'DataSet',
  components: {
    FolderEdit,
    FolderTree,
    Pagination,
    ShareDialog,
    NewCreateDialog
  },
  data () {
    const validateName = (rule, value, callback) => {
      const name = value.trim()
      if (name === '') {
        callback(new Error('请输入文件夹名称'))
      } else {
        const reg = /^[\u4e00-\u9fa5\w|\[\]\(\)\/\\]{1,50}$/
        if (!reg.test(name)) {
          callback(new Error('支持中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号, 长度不超过50'))
        } else {
          callback()
        }
      }
    }
    const validateDescription = (rule, value, callback) => {
      const name = value && value.trim()
      if (name && name.length > 200) {
        callback(new Error('描述长度不超过200'))
      } else {
        callback()
      }
    }
    return {
      searchName: '',
      // 表格数据
      tableData: [],
      dataLoading: true,
      multipleSelection: [],
      editDataSetVisible: false,
      deleteDataVisible: false,
      dashboardAttributeVisible: false,
      dashboardAttr: {
        name: '',
        description: ''
      },
      attrRules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        description: [
          { validator: validateDescription, trigger: 'blur' }
        ]
      },
      editFloderName: '',
      currentFloder: null,
      cureentData: null,
      // 仪表板相关
      folderDialogVisible: false,
      cancelPublishVisible: false,
      editFolder: null,
      users: [],
      treeVisible: false,
      moveDashboardIds: [],
      onSearched: false,
      newCreateVisible: false,
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    batchSelection: function () {
      return this.multipleSelection.filter((item) => !item.isFolder).length > 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 从模板新建
    handleNewCreate() {
      this.newCreateVisible = true
    },
    init () {
      // element lazy数据会被缓存，需要清理
      this.$set(this.$refs.multipleTable.store.states, 'lazyTreeNodeMap', {})
      // 先清空数据，否则对拥有子层级的列表无法刷新data
      this.currentFloder = null
      this.cureentData = null
      this.multipleSelection = []
      this.searchName = ''
      this.tableData = []
      this.isAllDataShow = true
      this.pageInfo = {
        total: 0,
        pageNum: 1,
        pageSize: this.pageInfo.pageSize
      }
      this.getTableData()
    },
    // 获取 tableData
    async getTableData() {
      this.dataLoading = true
      try {
        const searchkey = this.searchName
        const params = {
          isPaging: 0,
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize
        }
        if (searchkey) {
          params.searchkey = searchkey
        }
        const paramsStr = Object.entries(params).map(ar => `${ar[0]}=${ar[1]}`).join('&')
        const data = await getDashboardList(paramsStr)
        const { result, pageInfo } = data
        this.pageInfo = {
          total: pageInfo.totalItems,
          pageNum: pageInfo.page,
          pageSize: pageInfo.limit
        }
        this.tableData = result
        this.onSearched = !!searchkey
      } catch (error) {
        console.log(error)
      }
      this.dataLoading = false
    },
    // 查询
    async query () {
      // const searchkey = this.searchName ? `&searchkey=${this.searchName}` : ''
      this.getTableData()
    },
    // 新建文件夹
    createFolder () {
      this.folderDialogVisible = true
    },

    // 新建数据集
    async createDashboard () {
      this.$router.push({
        path: '/dashboard'
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
    handleSelectAll (val) {
      console.log(val, '多选')
      // this.multipleSelection = val
    },
    // 取消选择
    clearSelection () {
      this.$refs.multipleTable.clearSelection()
      this.multipleSelection = []
    },
    // table options
    edit (val) {
      if (this.batchSelection) return false
      if (val.directory) {
        this.cureentData = val
        this.folderDialogVisible = true
        this.editFolder = val
      } else {
        this.$router.push({
          path: '/dashboard',
          query: {
            id: val._id
          }
        })
      }
    },
    preview (val) {
      if (this.batchSelection) return false
      if (val.directory) {
        this.cureentData = val
        this.folderDialogVisible = true
        this.editFolder = val
      } else {
        this.$router.push({
          path: '/dashboard',
          query: {
            id: val._id,
            mode: 1
          }
        })
      }
    },
    loadDashboard (tree, treeNode, resolve) {
      resolve(tree.childNode)
    },
    editDashboardAttribute (val) {
      if (this.batchSelection) return false
      this.cureentData = val
      this.dashboardAttributeVisible = true
      this.dashboardAttr.name = val.name
      // this.dashboardAttr.ownerId = val.owner
      this.dashboardAttr.description = val.desc
    },
    handleDashboardAttribute () {
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {
          this.executeUpDashboardAttribute()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs['attrForm'].resetFields()
    },
    hiddenDashboardAttribute () {
      this.dashboardAttributeVisible = false
      this.cureentData = null
      this.resetForm()
    },
    async executeUpDashboardAttribute () {
      const id = this.cureentData._id
      const params = {
        id,
        type: 'dashboard',
        name: this.dashboardAttr.name.trim(),
        description: this.dashboardAttr.description ? this.dashboardAttr.description.trim() : ''
      }
      try {
        const data = await updateFolderOrDashboardProperties(params)
        this.$message.success(data)
        this.dashboardAttributeVisible = false
        this.cureentData = null
        this.resetForm()
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    showMore () {
      if (this.batchSelection) return false
      this.moreToolTipDisabled = false
    },
    deleteData (val) {
      if (this.batchSelection) return false
      this.cureentData = val
      this.deleteDataVisible = true
    },
    async hanledeleteData () {
      const { _id, directory, childNode } = this.cureentData
      if (directory && childNode.length > 0) {
        this.deleteDataVisible = false
        this.cureentData = null
        return
      }
      const params = {
        resources: [{
          id: _id,
          directory: !!this.cureentData.directory
        }]
      }
      try {
        const data = await batchDeleteResources(params)
        this.$message.success(data)
        this.deleteDataVisible = false
        this.cureentData = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    moveTo (val) {
      const ids = []
      if (val) {
        ids.push(val._id)
      } else {
        if (this.multipleSelection.some(item => item.directory)) {
          this.$message.warning('文件夹不能移动')
          return
        }
        this.multipleSelection.forEach((item) => {
          if (!item.directory) {
            ids.push(item._id)
          }
        })
      }
      if (ids.length === 0) {
        this.$message.warning('请选择仪表板')
        return
      }
      this.treeVisible = true
      this.moveDashboardIds = ids
      this.$refs.treeFolder.getFolders()
    },
    handleFolderEdit (action) {
      this.editFolder = null
      this.folderDialogVisible = false
      if (action !== 'cancel') {
        this.$message.success(action)
        this.cureentData = null
        this.init()
      }
    },
    async shareDashboard (data) {
      this.cureentData = data
      this.$refs['shareDialog'].showShare(data)
    },
    cancelPublish (data) {
      console.log(data)
      this.cureentData = data
      this.cancelPublishVisible = true
    },
    async handleCancelPublish () {
      const id = this.cureentData._id
      try {
        const data = await cancelShareDashboard(id)
        this.$message.success(data)
        this.cancelPublishVisible = false
        this.cureentData = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    handleMoveDashboard (action) {
      this.treeVisible = false
      if (action !== 'cancel') {
        this.cureentData = null
        this.init()
      }
    },
    renderSelectHeader (h) {
      return h('span', {}, [
        h('el-checkbox', { props: { disabled: true } })
      ])
    },
    formatTime (row) {
      return row.lastUpdatedTime ? moment.utc(row.lastUpdatedTime).local().format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    handlePageChange(data) {
      console.log(data)
      this.pageInfo = {
        ...this.pageInfo,
        ...data
      }
      this.getTableData()
    },
    handleShareChange(data) {
      const { id, ...rest } = data
      const newTableData = this.tableData.map(item => {
        let obj = { ...item }
        if (item._id === id) {
          obj = { ...item, ...rest }
        }
        return obj
      })
      this.tableData = newTableData
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
    padding-top: 0;
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

::v-deep .el-dialog__footer {
  padding: 0px;
}

.data-more {
  font-size: 12px;
  & > span {
    color: #fa8334;
    text-align: left;
    font-weight: 400;
    cursor: pointer;
  }
}
.dialog-footer {
  padding-top: 10px;
  margin-right: 20px;
}
.publish-status {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .status-tip {
    width: 8px;
    height: 8px;
    background: #aeaeae;
    border-radius: 4px;
    margin-right: 8px;
    &1 {
      background: #52c41a;
    }
    &2 {
      background: #1890ff;
    }
  }
}
.pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
  }
</style>
<style lang="scss">
.new-create-dropdown {
  top: 119px !important;
  left: 251px !important;
  li {
    width: 80px;
  }
  .popper__arrow {
    display: none !important;
  }
}
</style>
