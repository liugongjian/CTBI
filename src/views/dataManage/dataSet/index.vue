<template>
  <page-view>
    <div class="d-f f-b-s m-b-16">
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="createFolder()"
        >
          新建文件夹
        </el-button>
        <el-button @click="gotoDataSetEdit">新建数据集</el-button>
      </div>
      <div class="d-f">
        <el-input
          v-model="queryForm.searchkey"
          placeholder="请输入文件/数据集名称"
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

    <div>
      <!-- 多选事件发生的内容 -->
      <div
        v-show="selectedRows && selectedRows.length > 0"
        class="multiple-select-tip"
      >
        <span>已选{{ selectedRows.length }}项</span>
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

      <!-- 主表格 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        lazy
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="_id"
        :load="loadDataSet"
        :tree-props="{children: 'children', hasChildren: 'isFolder'}"
        @select-all="selectAll"
        @select="select"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="名称"
        >
          <template slot-scope="scope">
            <svg-icon
              :icon-class="scope.row.isFolder? 'folder': 'sql'"
              style="margin-right: 8px"
            />
            <el-tooltip
              v-if="!scope.row.isFolder"
              placement="top"
              effect="light"
            >
              <template slot="content">
                <span class="tooltip-light-content">点击编辑数据集</span>
              </template>
              <el-button
                type="text"
                @click="gotoDataSetEdit(scope.row)"
              >{{ scope.row.name || scope.row.displayName }}</el-button>
            </el-tooltip>
            <span v-else>{{ scope.row.name || scope.row.displayName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showFolderColumn"
          prop="folderName"
          label="文件路径"
          min-width="100"
        >
          <template slot-scope="scope">
            <span style="color: #4393F4;">根目录/{{ scope.row.folderName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="创建者"
        />
        <el-table-column
          prop="lastUpdatedTime"
          label="修改时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.lastUpdatedTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="dataSourceName"
          label="数据源"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div
              v-if="!scope.row.isFolder"
              class="data-set-main-table-options"
              :class="{'no-allowed': selectedRows}"
            >
              <el-button
                type="text"
                @click="gotoDataSetEdit(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="createDashboard(scope.row)"
              >新建仪表盘</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="showAttribute(scope.row)"
              >属性</el-button>
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
              :class="{'no-allowed': selectedRows}"
            >
              <el-button
                type="text"
                @click="createFolder(scope.row)"
              >重命名</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="deleteFloder(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </page-view>
</template>

<script>
import listPageMixin from '@/mixins/listPageMixin'
import { getDataSetsFolders, delFolders } from '@/api/dataSet'
export default {
  mixins: [listPageMixin],
  data () {
    return {
      queryForm: {
        searchkey: ''
      },
      showFolderColumn: false,
      // 定义一个变量，来识别全选框是否被选中，默认为未被选中
      checkedKey: false
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    // 表格重置搜索条件查询
    reset () {
      this.queryForm.searchkey = ''
      this.query()
    },
    // 表格查询
    async queryImpl () {
      // 清空已选
      this.selectedRows = []
      this.checkedKeys = false
      let params = Object.assign({}, this.queryForm)
      // 带参数查询，需要展示文件路径
      if (this.queryForm.searchkey.length > 0) {
        this.showFolderColumn = true
      } else {
        this.showFolderColumn = false
        // 接口要求不能传参
        params = {}
      }

      try {
        const data = await getDataSetsFolders(params)
        // element lazy数据会被缓存，需要清理
        if (this.dataList.length > 0) {
          this.$set(this.$refs.multipleTable.store.states, 'lazyTreeNodeMap', {})
        }
        this.setResult(data, data.length)
      } catch (error) {
        console.log(error)
      }
    },
    // 表格树状结构子查询
    async loadDataSet (tree, treeNode, resolve) {
      const folderId = tree._id
      try {
        const data = await getDataSetsFolders({ folderId })
        // 数据塞入展示数组中，全选使用
        this.dataList.forEach(item => {
          if (item._id === tree._id) {
            item.children = data
          }
        })
        resolve(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 跳转编辑&新增页面
    gotoDataSetEdit (row) {
      const query = { _id: row._id }
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
    },
    // 新建文件夹
    createFolder (data) {
      const title = data ? '重命名文件夹' : '新建文件夹'
      this.$dialog.show('SaveDatesetFolderDialog', { form: { ...data }, title }, () => {
        this.query()
      })
    },
    // 文件夹删除事件
    deleteFloder (row) {
      this.$dialog.show('TipDialog', { content: `确定删除文件夹${row.name}?` }, async () => {
        try {
          const data = await delFolders(row.id)
          this.$message.success(data)
          this.query()
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 目录移动事件
    moveTo (val) {
      const ids = []
      if (val) {
        ids.push(val._id)
      } else {
        this.selectedRows.forEach(item => {
          if (typeof item.isFolder !== 'undefined' && !item.isFolder) {
            ids.push(item._id)
          }
        })
      }
      this.$dialog.show('MoveDatasetDrawer', { ids }, () => {
        this.query()
      })
    },
    // 打开属性编辑页
    showAttribute (row) {
      this.$dialog.show('EditDatasetAttrDialog', { dataSetAttr: row }, async () => {
        this.query()
      })
    },
    // 多选全选
    selectAll () {
      // flag = true 有选中项，flag=false 为无选中项
      if (!this.checkedKeys) {
        this.split(this.dataList, !this.checkedKeys)
        if (this.selectedRows.length > 0) {
          this.checkedKeys = true
        }
      } else {
        this.$refs.multipleTable.clearSelection()
        this.selectedRows = []
        this.checkedKeys = false
      }
    },
    select (selection, row) {
      if (row.isFolder) {
        this.$refs.multipleTable.toggleRowSelection(row, false)
      } else {
        this.checkedKeys = true
        this.selectedRows = selection
      }
    },
    /**
     * 处理数据
     */
    split (data, flag) {
      data.forEach((row) => {
        // 如果为目录，则不做选中
        let isSelect = flag
        if (row.isFolder) {
          isSelect = false
        } else {
          this.selectedRows.push(row)
        }
        this.$refs.multipleTable.toggleRowSelection(row, isSelect)
        if (row.children !== undefined) {
          this.split(row.children, flag)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.multiple-select-tip {
  height: 40px;
  line-height: 40px;
  padding: 0px 16px;
  background: #fef6e7;
  border: 1px solid #fcd68a;

  span {
    color: #fa8334;
    margin-right: 8px;
  }
}
</style>
