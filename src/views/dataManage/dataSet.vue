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
          <el-button class="data-set-header-btn" style="background: #fa8334; color: #fff" @click="createFolder"><i class="el-icon-plus"></i>新建文件夹</el-button>
          <el-button @click="createDataSet" class="data-set-header-btn" style="color: rgba(0, 0, 0, 0.65)">新建数据集</el-button>
        </div>
        <div class="data-set-header-r">
          <el-input v-model="serachName" placeholder="请输入文件/数据集名称" style="margin-right: 12px"> </el-input>
          <el-button @click="query" class="data-set-header-btn" style="background: #fa8334; color: #fff">查询</el-button>
          <el-button @click="reset" class="data-set-header-btn" style="color: rgba(0, 0, 0, 0.65)">重置</el-button>
        </div>
      </div>

      <div class="data-set-multiple" v-show="multipleSelection && multipleSelection.length > 0">
        <span>已选{{ multipleSelection.length }}项</span>
        <span @click="moveTo" style="cursor: pointer;">移动到</span>
        <span @click="clearSelection">取消选择</span>
      </div>

      <!-- main -->
      <div class="data-set-main" v-if="!serachName">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="_id"
          @selection-change="handleSelectionChange"
          @expand-change="handleExpandChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="名称" width="200">
            <template slot-scope="scope">
              <svg-icon iconClass="sql" v-if="scope.row.type !== 'dataSet'" style="margin-right: 8px"/>
              <svg-icon v-else iconClass="floder" style="margin-right: 8px"/>
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creatorId" label="创建者" width="120"> </el-table-column>
          <el-table-column prop="lastUpdatedTime" label="修改时间" width="150"> </el-table-column>
          <el-table-column prop="dataSource" label="数据源" width="120"> </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.type === 'dataSet'" class="data-set-main-table-options">
                <span @click="edit">编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="createDashboard">新建仪表盘</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="showAttribute">属性</span>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip placement="bottom" effect="light">
                  <ul slot="content" class="data-set-menu">
                    <li @click="moveTo">移动到</li>
                    <li @click="deleteDataSet">删除</li>
                  </ul>
                  <span @click="showMore">更多</span>
                </el-tooltip>
              </div>
              <div v-else class="data-set-main-table-options">
                <span @click="rename">重命名</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="deleteFloder">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="text-align: right; margin-top: 16px"
          :total="pagination.total">
        </el-pagination>
      </div>

      <div class="data-set-main" v-else>
        <el-table
          v-loading="dataSetLoading"
          ref="multipleTable"
          :data="dataSetData"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="_id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="名称" width="200">
            <template slot-scope="scope">
              <svg-icon iconClass="sql" style="margin-right: 8px"/>
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="root" label="文件路径" width="150"> </el-table-column>
          <el-table-column prop="creatorId" label="创建者" width="120"> </el-table-column>
          <el-table-column prop="lastUpdatedTime" label="修改时间" width="150"> </el-table-column>
          <el-table-column prop="dataSource" label="数据源" width="120"> </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template>
              <div class="data-set-main-table-options">
                <span @click="edit">编辑</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="createDashboard">新建仪表盘</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="showAttribute">属性</span>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip placement="bottom" effect="light">
                  <ul slot="content" class="data-set-menu">
                    <li @click="moveTo">移动到</li>
                    <li @click="deleteDataSet">删除</li>
                  </ul>
                  <span @click="showMore">更多</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dataSetPagination.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="dataSetPagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="text-align: right; margin-top: 16px"
          :total="dataSetPagination.total">
        </el-pagination>
      </div>

      <!-- 各种 弹窗 & 抽屉 -->
      <el-dialog
        title="新建文件夹"
        :visible.sync="createFloderVisible"
        width="30%"
      >
        <div>
          <span>文件名称</span>
          <el-input v-model="newFloderName" placeholder="请输入文件名称" style="margin-right: 12px"> </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createFloderVisible = false">取 消</el-button>
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
          <el-input v-model="editFloderName" placeholder="请输入文件夹名称" class="data-set-didlog-main-input"> </el-input>
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
          <el-input v-model="newFloderName" placeholder="请输入文件夹名称" class="data-set-didlog-main-input"> </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDataSetVisible = false">取 消</el-button>
          <el-button style="background-color: #FA8334;color: #fff;" @click="hanleRenameFloder">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="删除提示"
        :visible.sync="deleteFolderVisible"
        width="480px"
        >
        <div class="data-set-didlog-del">
          <svg-icon iconClass="warning" style="margin-right: 16px"/>
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
          <svg-icon iconClass="warning" style="margin-right: 16px"/>
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
              <el-input v-model="dataSetAttr.name" autocomplete="off" style="width: 360px"></el-input>
            </el-form-item>
            <el-form-item label="描述" label-width="80px">
              <el-input type="textarea" v-model="dataSetAttr.desc" style="width: 360px"></el-input>
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
              placeholder="请输入"
              prefix-icon="el-icon-search"
              v-model="searchFloder">
            </el-input>
            <div class="move-to-drawer-main-content">
              <span class="move-to-drawer-main-content-root">根目录</span>
              <ul>
                <li v-for="(item, i) in floderList" :key="i" @click="selectFloder(item)" :class="{'select-actived': selectFloderId == item._id }">
                  <svg-icon iconClass="floder" style="margin-right: 8px"/>
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
export default {
  name: 'DataSet',
  data () {
    return {
      serachName: '',
      tableData: [
        {
          _id: 'XKxw5woOOWWHp',
          name: 'xxx-floder',
          creatorId: 'xxx',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSource: '',
          type: 'floder',
          children: [
            {
              _id: 'wy1Vf5wAvVXrT2',
              name: 'qqq-data-set',
              creatorId: 'qqq',
              lastUpdatedTime: '2022-4-18 14:42:30',
              dataSource: 'qqq',
              type: 'dataSet'
            },
            {
              _id: 'wy1Vf5wAvVXrT3',
              name: 'www-data-set',
              creatorId: 'www',
              lastUpdatedTime: '2022-4-18 14:42:30',
              dataSource: 'www',
              type: 'dataSet'
            }
          ]
        },
        {
          _id: 'wy1Vf5wAvVXrT',
          name: 'ooo-data-set',
          creatorId: 'ooo',
          lastUpdatedTime: '2022-4-18 14:42:30',
          dataSource: 'aaa',
          type: 'dataSet'
        }
      ],
      loading: false,
      dataSetLoading: false,
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
      curentFloder: null,
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
      dataSetPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 55
      }
    }
  },
  methods: {
    init () {},
    // 新建文件夹
    createFolder () {
      this.createFloderVisible = true
    },
    hanleCreateFloder () {
      this.createFloderVisible = false
      this.newFloderName = ''
    },
    // 新建数据集
    createDataSet () {},
    // 查询
    query () {
      this.serachName = ''
    },
    // 重置
    reset () {
      this.serachName = ''
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 取消选择
    clearSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    // table options
    edit () {
      this.editDataSetVisible = true
    },
    hanleEditFile () {
      this.editDataSetVisible = false
    },
    createDashboard () {},
    showAttribute () {
      this.dataSetAttributeVisible = true
    },
    hanleDataSetAttribute () {
      this.dataSetAttributeVisible = false
    },
    showMore () {},
    rename () {
      this.renameFolderVisible = true
    },
    hanleRenameFloder () {
      this.renameFolderVisible = false
    },
    deleteFloder () {
      this.deleteFolderVisible = true
    },
    hanleDeleteFolder () {
      this.deleteFolderVisible = false
    },
    deleteDataSet () {
      this.deleteDataSetVisible = true
    },
    hanleDeleteDataSet () {
      this.deleteDataSetVisible = false
    },
    moveTo () {
      this.moveToVisible = true
    },
    handleMoveTo () {
      this.moveToVisible = false
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
    handleExpandChange (row, expandedRows) {
      console.log(row, expandedRows)
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
</style>
