<template>
  <div class="data-set-wrap">
    <!-- header -->

    <div class="data-set-wrap-title">
      <span>数据集</span>
    </div>

    <div class="data-set-wrap-content">
      <!-- header -->
      <div class="data-set-header">
        <div class="data-set-header-l">
          <el-button class="data-set-header-btn" style="background: #fa8334; color: #fff" @click="createFolder"><i class="el-icon-plus" />新建文件夹</el-button>
          <el-button class="data-set-header-btn" style="color: rgba(0, 0, 0, 0.65)" @click="createDataSet">新建数据集</el-button>
        </div>
        <div class="data-set-header-r">
          <el-input v-model="serachName" placeholder="请输入文件/数据集名称" style="margin-right: 12px" />
          <el-button class="data-set-header-btn" style="background: #fa8334; color: #fff" @click="query">查询</el-button>
          <el-button class="data-set-header-btn" style="color: rgba(0, 0, 0, 0.65)" @click="reset">重置</el-button>
        </div>
      </div>

      <div v-show="multipleSelection && multipleSelection.length > 0" class="data-set-multiple">
        <span>已选{{ multipleSelection.length }}项</span>
        <span style="cursor: pointer;" @click="moveTo">移动到</span>
        <span @click="clearSelection">取消选择</span>
      </div>

      <!-- main -->
      <div class="data-set-main" v-if="isAllDataShow">
        <el-table
          ref="multipleTable"
          lazy
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="_id"
          @selection-change="handleSelectionChange"
          @expand-change="handleExpandChange"
          @cell-click="handleCellClick"
          :load="loadDataSet"
          :tree-props="{children: 'children', hasChildren: 'isFolder'}"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="名称" width="200">
            <template slot-scope="scope">
              <svg-icon v-if="!scope.row.isFolder" icon-class="sql" style="margin-right: 8px" />
              <svg-icon v-else icon-class="floder" style="margin-right: 8px" />
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creatorId" label="创建者" width="120"> </el-table-column>
          <el-table-column prop="lastUpdatedTime" label="修改时间" width="150">
            <template slot-scope="scope">
              {{ scope.row.lastUpdatedTime | dateFilter }}
            </template>
          </el-table-column>
          <el-table-column prop="dataSourceName" label="数据源" width="120"> </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="!scope.row.isFolder" class="data-set-main-table-options" :class="{'no-allowed': batchSelection}">
                <span @click="edit(scope.row)">编辑</span>
                <el-divider direction="vertical" />
                <span @click="createDashboard(scope.row)">新建仪表盘</span>
                <el-divider direction="vertical" />
                <span @click="showAttribute(scope.row)">属性</span>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip placement="bottom" effect="light" :disabled="moreToolTipDisabled">
                  <ul slot="content" class="data-set-menu">
                    <li @click="moveTo(scope.row)">移动到</li>
                    <li @click="deleteDataSet(scope.row)">删除</li>
                  </ul>
                  <span @click="showMore">更多</span>
                </el-tooltip>
              </div>
              <div v-else class="data-set-main-table-options" :class="{'no-allowed': batchSelection}">
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

      <div v-else class="data-set-main">
        <el-table
          ref="multipleTable"
          v-loading="dataSetLoading"
          :data="dataSetData"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="_id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="名称" width="200">
            <template slot-scope="scope">
              <svg-icon icon-class="sql" style="margin-right: 8px" />
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="root" label="文件路径" width="150" />
          <el-table-column prop="creatorId" label="创建者" width="120" />
          <el-table-column prop="lastUpdatedTime" label="修改时间" width="150" />
          <el-table-column prop="dataSource" label="数据源" width="120" />
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="data-set-main-table-options" :class="{'no-allowed': batchSelection}">
                <span @click="edit(scope.row)">编辑</span>
                <el-divider direction="vertical" />
                <span @click="createDashboard(scope.row)">新建仪表盘</span>
                <el-divider direction="vertical" />
                <span @click="showAttribute(scope.row)">属性</span>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip placement="bottom" effect="light" :disabled="moreToolTipDisabled">
                  <ul slot="content" class="data-set-menu">
                    <li @click="moveTo(scope.row)">移动到</li>
                    <li @click="deleteDataSet(scope.row)">删除</li>
                  </ul>
                  <span @click="showMore">更多</span>
                </el-tooltip>
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
          <el-input v-model="newFloderName" placeholder="请输入文件名称" style="margin-left: 12px;height: 32px"> </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createFloderVisible = false; newFloderName = ''">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="hanleCreateFloder">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="文件夹重命名"
        :visible.sync="renameFolderVisible"
        width="480px"
      >
        <div class="data-set-didlog-main">
          <span>文件夹名称</span>
          <el-input v-model="editFloderName" placeholder="请输入文件夹名称" class="data-set-didlog-main-input" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="renameFolderVisible = false">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="hanleRenameFloder">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑数据集"
        :visible.sync="editDataSetVisible"
        width="480px"
      >
        <div class="data-set-didlog-main">
          <span>数据集名称</span>
          <el-input v-model="updateDataSetName" placeholder="请输入文件夹名称" class="data-set-didlog-main-input" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDataSetVisible = false">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="hanleEditFile">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="删除提示"
        :visible.sync="deleteFolderVisible"
        width="480px"
      >
        <div class="data-set-didlog-del">
          <svg-icon icon-class="warning" style="margin-right: 16px" />
          <span>确定删除文件夹吗？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteFolderVisible = false">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="hanleDeleteFolder">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="删除提示"
        :visible.sync="deleteDataSetVisible"
        width="480px"
      >
        <div class="data-set-didlog-del">
          <svg-icon icon-class="warning" style="margin-right: 16px" />
          <span>确定删除数据集吗？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDataSetVisible = false">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="hanleDeleteDataSet">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="属性"
        :visible.sync="dataSetAttributeVisible"
        width="480px"
      >
        <div class="data-set-didlog-main">
          <el-form :model="dataSetAttr" style="padding: 0px">
            <el-form-item label="名称" label-width="80px">
              <el-input v-model="dataSetAttr.name" autocomplete="off" style="width: 360px" />
            </el-form-item>
            <el-form-item label="描述" label-width="80px">
              <el-input v-model="dataSetAttr.desc" type="textarea" style="width: 360px" />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dataSetAttributeVisible = false">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="hanleDataSetAttribute">确 定</el-button>
        </span>
      </el-dialog>

      <el-drawer
        title="资源移动到"
        :visible.sync="moveToVisible"
      >
        <div class="move-to-drawer">
          <div class="move-to-drawer-main">
            <el-input
              v-model="searchFloder"
              placeholder="请输入"
              prefix-icon="el-icon-search"
              @change="searchFloderList">
            </el-input>
            <div class="move-to-drawer-main-content" v-loading="!floderList">
              <span class="move-to-drawer-main-content-root">根目录</span>
              <ul>
                <li v-for="(item, i) in floderList" :key="i" :class="{'select-actived': selectFloderId == item._id }" @click="selectFloder(item)">
                  <svg-icon icon-class="floder" style="margin-right: 8px" />
                  {{ item.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="move-to-drawer-footer">
            <el-button @click="moveToVisible = false; selectFloderId = '' ">取 消</el-button>
            <el-button style="background-color: #FA8334;color: #fff;" @click="handleMoveTo">确 定</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
// import qs from 'qs'
import { createFloders, updateFolderName, delFolders, updateDataSet, delDataSet, moveDataSet2Folder, getFolderLists, getDataSetsFolders } from '@/api/dataSet'
import { getDateTime } from '@/utils/optionUtils'
export default {
  name: 'DataSet',
  data () {
    return {
      serachName: '',
      updateDataSetName: '',
      tableData: [
        {
          _id: 'XKxw5woOOWWHp',
          name: 'xxx-floder',
          creatorId: 'xxx',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSourceName: '',
          isFolder: true,
          children: [
            {
              _id: 'wy1Vf5wAvVXrT2',
              name: 'qqq-data-set',
              creatorId: 'qqq',
              lastUpdatedTime: '2022-4-18 14:42:30',
              dataSourceName: 'qqq',
              isFolder: false
            },
            {
              _id: 'wy1Vf5wAvVXrT3',
              name: 'www-data-set',
              creatorId: 'www',
              lastUpdatedTime: '2022-4-18 14:42:30',
              dataSourceName: 'www',
              isFolder: false
            }
          ]
        },
        {
          _id: 'wy1Vf5wAvVXrT',
          name: 'ooo-data-set',
          creatorId: 'ooo',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSourceName: 'aaa',
          isFolder: false
        },
        {
          _id: 'BnJLUVUO2PV0p',
          status: 1,
          version: '1.0',
          displayName: 'huym-0422',
          comment: '这是备注',
          sqlId: 'FwWlNdQ4N7JBs',
          fields: [
            {
              attributes: {
                isHidden: true,
                dataType: 'number'
              },
              status: 1,
              type: 'Measure',
              column: 'id',
              displayColumn: 'id',
              comment: 'id',
              _id: 'd2ZIiiSrmOKTr'
            },
            {
              attributes: {
                isHidden: false,
                dataType: 'number'
              },
              status: 1,
              type: 'Measure',
              column: 'id',
              displayColumn: 'id_cp',
              comment: 'id',
              _id: 'ofno3idEh98HM'
            },
            {
              attributes: {
                isHidden: false,
                dataType: 'text'
              },
              status: -1,
              type: 'Dimension',
              column: 'name',
              displayColumn: 'name',
              comment: 'name',
              _id: '9DoQFxAnPWX4p'
            },
            {
              attributes: {
                isHidden: true,
                dataType: 'text'
              },
              status: 1,
              type: 'Dimension',
              column: 'telephone',
              displayColumn: 'telephone',
              comment: 'telephone',
              _id: '9sRMN8KfO74dQ'
            },
            {
              attributes: {
                isHidden: true,
                dataType: 'text'
              },
              status: 1,
              type: 'Dimension',
              column: 'address',
              displayColumn: 'address',
              comment: 'address',
              _id: 'Ewp5qgoOFYprq'
            }
          ],
          creatorId: 'huym',
          dataSourceId: 'bUGgsUrXIe7I0',
          createdTime: '2022-04-22T06:38:11.769Z',
          lastUpdatedTime: '2022-04-22T09:02:22.514Z',
          folderId: null,
          isFolder: false,
          dataSourceName: 'huym-test',
          creatorName: 'huyimiao'
        }
      ],
      loading: false,
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
      floderList: [
        {
          _id: 'XKxw5woOOWWHp',
          name: 'xxx-floder',
          creatorId: 'xxx',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSource: '',
          type: 'floder',
          children: []
        },
        {
          _id: 'XKxw5woOOWWHpx',
          name: 'ooo-floder',
          creatorId: 'ooo',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSource: '',
          type: 'floder',
          children: []
        }
      ],
      currentFloder: null,
      cureentDataSet: null,
      moveToVisible: false,
      searchFloder: '',
      selectFloderId: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 55
      },
      dataSetData: [
        {
          _id: 'wy1Vf5wAvVXrTz',
          name: 'zzz-data-set',
          creatorId: 'xxx',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSource: 'aaa',
          root: 'aaa/xxx',
          type: 'dataSet'
        },
        {
          _id: 'wy1Vf5wAvVXrTx',
          name: 'xxx-data-set',
          creatorId: 'ooo',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSource: 'aaa',
          root: 'aaa/xxx',
          type: 'dataSet'
        }
      ],
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
      this.getTableData()
      this.currentFloder = null
      this.cureentDataSet = null
      this.searchFloder = ''
      this.selectFloderId = ''
      this.serachName = ''
      this.multipleSelection = []
      this.isAllDataShow = true
    },
    // 获取 tableData
    async getTableData () {
      try {
        const { data } = await getDataSetsFolders()
        // data.forEach(item => {
        //   if (item.isFolder) {
        //     item.children = []
        //   }
        // })
        this.tableData = data
        console.log(this.tableData)
        this.loading = false
      } catch (error) {
        console.log(error)
      }
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
        const { data } = await createFloders(body)
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
        path: '/dataSet/edit',
        query
      })
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
      try {
        const { data } = await getDataSetsFolders({ searchkey })
        this.dataSetData = data.filter(item => !item.isFolder)
        this.dataSetLoading = false
      } catch (error) {
        console.log(error)
      }
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
        const { data } = await updateDataSet(id, params)
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
        const { data } = await updateDataSet(id, params)
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
        const { data } = await updateFolderName(id, body)
        console.log(data)
        this.editFloderName = ''
        this.currentFloder = null
        this.loading = true
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
        const { data } = await delFolders(id)
        console.log(data)
        this.deleteFolderVisible = false
        this.currentFloder = null
        this.loading = true
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
        const { data } = await delDataSet(id)
        console.log(data)
        this.deleteDataSetVisible = false
        this.cureentDataSet = null
        this.loading = true
        this.dataSetLoading = true
        this.init()
      } catch (error) {
        console.log(error)
      }
    },
    async moveTo (val) {
      if (this.multipleSelection.some(item => item.isFolder)) {
        return this.$message({
          message: '移动操作暂且只支持数据集不支持文件夹',
          type: 'warning'
        })
      }
      if (val) {
        this.multipleSelection.push(val)
      }
      this.moveToVisible = true
      try {
        const { data } = await getFolderLists()
        console.log(data)
        this.floderList = data.result
      } catch (error) {
        console.log(error)
      }
    },
    async handleMoveTo () {
      const ids = []
      const folderId = this.selectFloderId
      this.multipleSelection.forEach(item => {
        if (!item.isFolder) {
          ids.push(item._id)
        }
      })
      if (!ids.length) return false
      try {
        const { code } = await moveDataSet2Folder({
          ids,
          folderId
        })
        if (code === 200) {
          this.multipleSelection = null
          this.selectFloderId = ''
          this.$refs.multipleTable.clearSelection()
          this.moveToVisible = false
          this.$router.go(0)
        } else {
          return false
        }
      } catch (error) {
        console.log(error)
      }
    },
    selectFloder (item) {
      this.selectFloderId = item._id
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    async handleExpandChange (row, expandedRows) {
      if (!expandedRows || !row.isFolder) return false
      const tmp = this.tableData.slice()
      const folderId = row._id
      try {
        const { data } = await getDataSetsFolders({ folderId })
        tmp.forEach(item => {
          if (item._id === folderId) {
            item.children = data
            return true
          }
        })
        this.tableData = tmp
      } catch (error) {
        console.log(error)
      }
    },
    handleUpdateDataSetName () {
      this.editDataSetVisible = false
    },
    handleCellClick (row, column) {
      if (column.label !== '名称' || row.isFolder) return false
      const query = row
      this.$router.push({
        path: '/dataSet/edit',
        query
      })
    },
    async loadDataSet (tree, treeNode, resolve) {
      const folderId = tree._id
      try {
        const { data } = await getDataSetsFolders({ folderId })
        console.log(data)
        resolve(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 搜索数据集
    async searchFloderList() {
      const searchkey = this.searchFloder
      try {
        const { data } = await getFolderLists({ searchkey })
        console.log(data)
        this.floderList = data.result
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

  &-title {
    height: 20px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 20px;
    font-weight: 500;
  }

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

    ::v-deep .el-input__inner {
      height: 32px;
    }
  }

  &-btn {
    height: 32px;
    font-size: 12px;
    padding: 0 20px;
    line-height: 32px;
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
    color: rgba(0,0,0,0.65);
    font-weight: 400;
  }
}

.data-set-menu > li {
  list-style: none;
  margin: 8px 8px;
  font-size: 12px;
  color: rgba(0,0,0,0.65);
  font-weight: 400;
  cursor: pointer;
}

.dialog-footer {
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

.move-to-drawer {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-top: 1px #F1F1F1 solid;
  height: calc(100vh - 75px);
  &-main {
    flex: 1;
    padding: 24px;
    &-content {
      &-root {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        margin-top: 6px;
        font-size: 12px;
        color: rgba(0,0,0,0.65);
      }
      ul > li {
        list-style: none;
        height: 30px;
        line-height: 30px;
        margin-bottom: 8px;
        font-size: 12px;
        color: rgba(0,0,0,0.65);
        padding-left: 20px;
        cursor: pointer;
      }
      .select-actived {
        background: #F79B53;
      }
    }
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
