/* eslint-disable vue/no-parsing-error */
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
            :load="loadDashboard"
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
                  <el-button type="text" @click="edit(scope.row)">{{
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
              <template slot-scope="scope">
                <div v-if="!scope.row.directory" class="publish-status">
                  <div class="status-tip" :class="`status-tip${scope.row.publishStatus}`" />
                  <p>{{ scope.row.publishStatus === 1 ? "已发布" : scope.row.publishStatus === 2 ? "未发布" : "已下线" }}</p>
                </div>
                <div v-else>-</div>
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
        </div>

        <!-- 各种 弹窗 & 抽屉 -->

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
          <div v-if="!currentShareInfo || !currentShareInfo.shareUrl" class="shareEmpty">
            <img
              style="width: 371px; height: 200px"
              :src="require('../../assets/Image/dashboard/shareEmpty.png')"
            >
            <p>开启后，所有获得分享链接的人都可以查看内容</p>
            <el-button
              style="margin-top: 14px;"
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
        ref="treeFolder"
        :visible="treeVisible"
        :ids="moveDashboardIds"
        @handleAction="handleMoveDashboard"
      />
    </div>
  </page-view>
</template>

<script>
// import qs from 'qs'
import {
  getDashboardList,
  batchDeleteResources,
  batchCancelPublishDashboards,
  updateFolderOrDashboardProperties,
  getShareInfo,
  shareDashboard,
  cancelShareDashboard,
  saveDashboard
} from '@/api/dashboard'
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
      // 表格数据
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
    async getTableData(searchkey = '') {
      this.dataLoading = true
      try {
        const data = await getDashboardList('isPaging=0' + searchkey)
        this.tableData = data.result
      } catch (error) {
        console.log(error)
      }
      this.dataLoading = false
    },
    // 查询
    async query() {
      const searchkey = this.serachName ? `&searchkey=${this.serachName}` : ''
      this.getTableData(searchkey)
    },
    // 新建文件夹
    createFolder() {
      this.folderDialogVisible = true
    },

    // 新建数据集
    async createDashboard() {
      const setting = {
        name: 'setting'
      }
      const params = {
        name: '看板' + Math.round(Math.random() * 40),
        setting: JSON.stringify(setting),
        isPublish: Math.round(Math.random() * 40) % 2 === 0
      }
      await saveDashboard(params)
      this.init()
      // this.$router.push({
      //   path: '/dashboard'
      // })
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
    loadDashboard(tree, treeNode, resolve) {
      resolve(tree.childNode)
    },
    async editDashboardAttribute(val) {
      if (this.batchSelection) return false
      const users = await getList()
      this.users = users.list.map(item => { return { id: item._id, name: item.userName } })
      this.cureentData = val
      this.dashboardAttributeVisible = true
      this.dashboardAttr.name = val.name
      this.dashboardAttr.ownerId = val.owner
      this.dashboardAttr.description = val.desc
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
    moveTo(val) {
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
    handleFolderEdit(action) {
      this.editFolder = null
      this.folderDialogVisible = false
      if (action !== 'cancel') {
        this.$message.success(action)
        this.cureentData = null
        this.init()
      }
    },
    async shareDashboard(data) {
      try {
        const info = await getShareInfo(data._id)
        this.cureentData = data
        this.currentShareInfo = info
        this.shareDashboardVisible = true
      } catch (error) {
        console.log(error)
      }
    },
    async executeShare (endDate) {
      try {
        const shareEndTime = endDate || moment().add(2, 'days').format('YYYY-MM-DD')
        const params = {
          _id: this.cureentData._id,
          shareEndTime
        }
        const info = await shareDashboard(params)
        this.currentShareInfo = { ...info, shareEndTime }
      } catch (error) {
        console.log(error)
      }
    },
    copyShareUrl() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.currentShareInfo.shareUrl)
        this.$message.success('复制成功')
      }
    },
    shareDateChange(e) {
      this.executeShare(moment(e).format('YYYY-MM-DD'))
    },
    async cancelShareDashboard() {
      try {
        const result = await cancelShareDashboard(this.cureentData._id)
        this.$message.success(result)
        this.cureentData = null
        this.currentShareInfo = null
        this.shareDashboardVisible = false
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
    handleMoveDashboard (action) {
      this.treeVisible = false
      if (action !== 'cancel') {
        this.cureentData = null
        this.init()
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
.shareEmpty{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
}
.publish-status {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .status-tip{
    width: 8px;
    height: 8px;
    background: #AEAEAE;
    border-radius: 4px;
    margin-right: 8px;
    &1{
        background: #52C41A;
    }
    &2{
        background: #1890FF;
    }
  }
}
</style>
