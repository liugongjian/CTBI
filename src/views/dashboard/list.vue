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
              @click="createDashboard"
            >新建仪表板</el-button>
            <el-button @click="createFolder">新建文件夹</el-button>
          </div>
          <div class="data-set-header-r">
            <el-input
              v-model="serachName"
              placeholder="请输入名称"
              style="margin-right: 12px"
            />
            <el-button type="primary" @click="query">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>

        <div
          v-show="multipleSelection && multipleSelection.length > 0"
          class="data-set-multiple"
        >
          <span>已选{{ multipleSelection.length }}项</span>
          <el-button type="text" @click="moveTo()">移动到</el-button>
          <el-button type="text" @click="clearSelection()">取消选择 </el-button>
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
            :load="loadDataSet"
            :tree-props="{ children: 'children', hasChildren: 'directory' }"
            @select="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="名称" min-width="200">
              <template slot-scope="scope">
                <svg-icon
                  :icon-class="scope.row.directory ? 'floder' : 'board'"
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
                  <el-button type="text" @click="handleCellClick(scope.row)">{{
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
              min-width="120"
              show-overflow-tooltip
            >
              <template v-if="!scope.row.directory" slot-scope="scope">
                {{ scope.row.publishStatus === 1 ? "已发布" : scope.row.publishStatus === 2 ? "未发布" : "已下线" }}
              </template>
            </el-table-column>
            <el-table-column prop="ownerName" label="创建者" min-width="120" />
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div
                  class="data-set-main-table-options"
                  :class="{ 'no-allowed': batchSelection }"
                >
                  <span @click="edit(scope.row)">编辑</span>
                  <el-divider v-if="scope.row.directory" direction="vertical" />
                  <span v-if="scope.row.directory" @click="deleteData(scope.row)">删除</span>
                  <el-divider v-if="!scope.row.directory" direction="vertical" />
                  <span v-if="!scope.row.directory" @click="editDashboardAttribute(scope.row)">属性</span>
                  <el-divider v-if="!scope.row.directory" direction="vertical" />
                  <el-dropdown v-if="!scope.row.directory" class="data-more">
                    <span>更多</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-if="scope.row.publishStatus === 1"
                        @click.native="shareDashboard(scope.row)"
                      >公开</el-dropdown-item>
                      <el-dropdown-item
                        @click.native="moveTo(scope.row)"
                      >移动到</el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.publishStatus === 1"
                        @click.native="cancelPublish(scope.row)"
                      >下线</el-dropdown-item>
                      <el-dropdown-item
                        @click.native="deleteData(scope.row)"
                      >删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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

        <!-- 各种 弹窗 & 抽屉 -->

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
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDataSetVisible = false">取 消</el-button>
            <el-button
              style="background-color: #fa8334; color: #fff"
              @click="hanleEditFile"
            >确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="删除提示"
          :visible.sync="deleteDataVisible"
          width="480px"
        >
          <div class="data-set-didlog-del">
            <svg-icon icon-class="warning" style="margin-right: 16px" />
            <span>确定删除该{{ cureentData && cureentData.directory ? '文件夹' : '仪表板' }}吗？</span>
          </div>
          <div slot="footer" class="dialog-footer">
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
          width="480px"
        >
          <div class="data-set-didlog-del">
            <svg-icon icon-class="warning" style="margin-right: 16px" />
            <span>下线后该报表不可被查看</span>
          </div>
          <div slot="footer" class="dialog-footer">
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
        >
          <div class="data-set-didlog-main">
            <el-form :model="dashboardAttr" style="padding: 0px">
              <el-form-item label="名称" label-width="80px">
                <el-input
                  v-model="dashboardAttr.name"
                  autocomplete="off"
                  style="width: 360px"
                />
              </el-form-item>
              <el-form-item label="所有者" label-width="80px">
                <el-select v-model="dashboardAttr.ownerId" placeholder="请选择" style="width: 360px">
                  <el-option
                    v-for="item in users"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="描述" label-width="80px">
                <el-input
                  v-model="dashboardAttr.description"
                  type="textarea"
                  style="width: 360px"
                />
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button
              @click="dashboardAttributeVisible = false"
            >取 消</el-button>
            <el-button
              type="primary"
              @click="hanledashboardAttribute"
            >确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="公开链接分享"
          :visible.sync="shareDashboardVisible"
          width="480px"
        >
          <div v-if="!currentShareInfo">
            <el-button
              type="primary"
              @click="() => executeShare()"
            >公开分享</el-button>
          </div>
          <div v-else class="shareWrap">
            <div>
              <span class="shareTip">所有用户可以通过一下链接查看报表备份</span>
              <el-button
                @click="cancelShareDashboard"
              >不再公开</el-button>
            </div>
            <div class="shareCopy">
              <el-input v-model="currentShareInfo.shareUrl" readonly>
                <el-button slot="append" @click="copyShareUrl">复制</el-button>
              </el-input>
            </div>
            <div class="shareDate">
              <el-form :model="currentShareInfo" style="padding: 0px">
                <el-form-item label="截止日期">
                  <el-date-picker
                    v-model="currentShareInfo.shareEndTime"
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                    @change="shareDateChange"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-dialog>
      </div>
      <FolderEdit
        :visible="folderDialogVisible"
        :data="editFolder"
        @handleAction="handleFolderEdit"
      />
      <FolderTree
        :visible="treeVisible"
        :data="moveDashboardIds"
        @handleAction="handleMoveDashboard"
      />
    </div>
  </page-view>
</template>

<script>
// import qs from 'qs'
import { batchDeleteResources, batchCancelPublishDashboards, updateFolderOrDashboardProperties, shareDashboard, cancelShareDashboard } from '@/api/dashboard'
import {
  updateFolderName,
  updateDataSet,
  getDataSetsFolders
} from '@/api/dataSet'
import { getList } from '@/api/userManage'
// import { getDateTime } from '@/utils/optionUtils'
import FolderEdit from './FolderEdit'
import FolderTree from './FolderTree'
import moment from 'moment'
export default {
  name: 'DataSet',
  components: {
    FolderEdit,
    FolderTree
  },
  data() {
    return {
      serachName: '',
      updateDataSetName: '',
      // 数据集表格数据
      tableData: [],
      dataLoading: true,
      multipleSelection: [],
      editDataSetVisible: false,
      deleteDataVisible: false,
      dashboardAttributeVisible: false,
      dashboardAttr: {
        name: '',
        ownerId: '',
        description: ''
      },
      editFloderName: '',
      currentFloder: null,
      cureentData: null,
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
      },
      // 仪表板相关
      folderDialogVisible: false,
      cancelPublishVisible: false,
      shareDashboardVisible: false,
      editFolder: null,
      users: [],
      currentShareInfo: null,
      treeVisible: false,
      moveDashboardIds: []
    }
  },
  computed: {
    batchSelection: function () {
      return this.multipleSelection.filter((item) => !item.isFolder).length > 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // element lazy数据会被缓存，需要清理
      this.$set(this.$refs.multipleTable.store.states, 'lazyTreeNodeMap', {})
      // 先清空数据，否则对拥有子层级的列表无法刷新data
      this.currentFloder = null
      this.cureentData = null
      this.multipleSelection = []
      this.serachName = ''
      this.tableData = []
      this.isAllDataShow = true
      this.getTableData()
    },
    // 获取 tableData
    async getTableData() {
      this.dataLoading = true
      try {
        // const data = await getDashboardList()
        const temp = {
          'code': 200,
          'data': {
            'result': [
              {
                '_id': 'Tl596HpUtrITQ',
                'status': 1,
                'publishStatus': 2,
                'childNode': [
                  {
                    '_id': 'I7U01G5miLrr0',
                    'status': 1,
                    'publishStatus': -1,
                    'name': '测试子文件',
                    'isRoot': false,
                    'directory': false,
                    'createdTime': '2022-04-22T11:45:53.726Z',
                    'lastUpdatedTime': '2022-04-22T11:45:53.726Z',
                    'owner': 'CN8SeyWsSqqM0',
                    'ownerName': 'wlm'
                  }
                ],
                'name': '测试文件夹',
                'isRoot': true,
                'directory': true,
                'createdTime': '2022-04-22T11:45:08.342Z',
                'lastUpdatedTime': '2022-04-22T11:45:08.342Z',
                'owner': 'CN8SeyWsSqqM0',
                'ownerName': 'wlm2'
              },
              {
                '_id': '4KRtCYKCMDGG7',
                'status': 1,
                'publishStatus': 1,
                'childNode': [],
                'name': '测试',
                'createdTime': '2022-04-19T09:35:42.321Z',
                'lastUpdatedTime': '2022-04-22T11:27:22.126Z',
                'isRoot': true,
                'directory': false,
                'owner': 'CN8SeyWsSqqM0',
                'ownerName': 'wlm'
              }
            ]
          }
        }
        this.tableData = temp.data.result
      } catch (error) {
        console.log(error)
      }
      this.dataLoading = false
    },
    // 查询
    async query() {
      if (!this.serachName) {
        this.isAllDataShow = true
        return this.$message({
          message: '请输入正确的数据集名称',
          type: 'warning'
        })
      }
      this.isAllDataShow = false
      const searchkey = this.serachName
      this.dataLoading = true
      try {
        const data = await getDataSetsFolders({ searchkey })
        this.dataSetData = data.filter((item) => !item.isFolder)
      } catch (error) {
        console.log(error)
      }
      this.dataLoading = false
    },
    // 新建文件夹
    createFolder() {
      this.folderDialogVisible = true
    },

    // 新建数据集
    createDashboard() {
      this.$router.push({
        path: '/dashboard'
      })
    },
    // 重置
    reset() {
      this.init()
    },
    // 多选
    handleSelectionChange(val) {
      console.log(val, '多选')
      this.multipleSelection = val
    },
    // 取消选择
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
      this.multipleSelection = []
    },
    // table options
    edit(val) {
      if (this.batchSelection) return false
      this.cureentData = val
      if (val.directory) {
        this.folderDialogVisible = true
        this.editFolder = val
      }
    },
    async hanleEditFile() {
      console.log(this.cureentData)
      const id = this.cureentData._id
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
    createDashboard1() {
      if (this.batchSelection) return false
    },
    async editDashboardAttribute(val) {
      if (this.batchSelection) return false
      const users = await getList()
      this.users = users.list.map(item => { return { id: item._id, name: item.userName } })
      this.cureentData = val
      this.dashboardAttributeVisible = true
      this.dashboardAttr.name = val.name
      this.dashboardAttr.ownerId = val.owner
      this.dashboardAttr.description = val.description
    },
    async hanledashboardAttribute() {
      const id = this.cureentData._id
      const params = {
        id,
        type: 'dashboard',
        ownerName: this.cureentData.name,
        ...this.dashboardAttr
      }
      try {
        const data = await updateFolderOrDashboardProperties(params)
        console.log(data)
        this.dashboardAttributeVisible = false
        this.cureentData = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    showMore() {
      if (this.batchSelection) return false
      this.moreToolTipDisabled = false
    },
    async hanleRenameFloder() {
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
    deleteData(val) {
      if (this.batchSelection) return false
      this.cureentData = val
      this.deleteDataVisible = true
    },
    async hanledeleteData() {
      const id = this.cureentData._id
      const params = {
        resources: [{
          id,
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
    async moveTo(val) {
      const ids = []
      if (val) {
        ids.push(val._id)
      } else {
        this.multipleSelection.forEach((item) => {
          if (typeof item.isFolder !== 'undefined' && !item.isFolder) {
            ids.push(item._id)
          }
        })
      }
      this.treeVisible = true
      this.moveDashboardIds = ids
      // this.$dialog.show('MoveDatasetDrawer', { ids }, () => {
      //   this.init()
      // })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleUpdateDataSetName() {
      this.editDataSetVisible = false
    },
    handleCellClick(row) {
      const query = row
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
    },
    async loadDataSet(tree, treeNode, resolve) {
      const folderId = tree._id
      try {
        const data = await getDataSetsFolders({ folderId })
        console.log(data)
        resolve(data)
      } catch (error) {
        console.log(error)
      }
    },
    handleFolderEdit(action) {
      this.editFolder = null
      if (action === 'cancel') {
        this.folderDialogVisible = false
      }
      if (action === 'createSuccess') {
        this.folderDialogVisible = false
      }
    },
    async shareDashboard(data) {
      this.cureentData = data
      // this.currentShareInfo = {
      //   'shareUrl': 'http://0.0.0.0/dashboard/publish/hLhqzBlr2xxBA7R',
      //   'shareEndTime': '2022-06-21',
      //   'isPublic': true
      // }
      this.shareDashboardVisible = true
      // try {
      //   const info = await getShareInfo(data._id)
      //   this.cureentData = data
      //   this.currentShareInfo = info
      //   this.shareDashboardVisible = true
      // } catch (error) {
      //   console.log(error)
      // }
    },
    async executeShare (endDate) {
      try {
        const shareEndTime = endDate || moment().add(2, 'days').format('YYYY-MM-DD')
        const params = {
          _id: this.cureentData._id,
          shareEndTime
        }
        this.currentShareInfo = {
          shareUrl: 'http://0.0.0.0/dashboard/publish/hLhqzBlr2xxBA7R' + endDate,
          shareEndTime
        }
        const info = await shareDashboard(params)
        this.currentShareInfo = info
      } catch (error) {
        console.log(error)
      }
    },
    cancelPublish(data) {
      console.log(data)
      this.cureentData = data
      this.cancelPublishVisible = true
    },
    async handleCancelPublish() {
      const id = this.cureentData._id
      const params = {
        ids: [id]
      }
      try {
        const data = await batchCancelPublishDashboards(params)
        this.$message.success(data)
        this.cancelPublishVisible = false
        this.cureentData = null
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    copyShareUrl() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.currentShareInfo.shareUrl)
      }
    },
    shareDateChange(e) {
      console.log(e)
      console.log(moment(e).format('YYYY-MM-DD'))
      this.executeShare(moment(e).format('YYYY-MM-DD'))
    },
    async cancelShareDashboard() {
      try {
        await cancelShareDashboard(this.cureentData._id)
        this.cureentData = null
        this.currentShareInfo = null
        this.shareDashboardVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    handleMoveDashboard (action) {
      console.log(action)
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
.dialog-footer{
  padding-bottom: 10px;
  margin-right: 20px;
}
.shareWrap{
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  line-height: 20px;
  .shareCopy{
    margin-top: 24px;
  }
  .shareDate{
    margin-top: 24px;
  }
}
</style>
