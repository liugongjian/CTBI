<template>
  <div class="dataset-drawer">
    <el-drawer
      :visible.sync="dialogVisible"
      :wrapper-closable="false"
    >
      <span slot="title" class="title">
        资源移动到
      </span>
      <div class="move-to-drawer">
        <div class="move-to-drawer-main">
          <el-input
            v-model="filterText"
            placeholder="请输入文件夹名称"
            prefix-icon="el-icon-search"
          />
          <div
            v-loading="loading"
            class="move-to-drawer-main-content"
          >
            <el-tree ref="tree" :data="treeData" :props="defaultProps" :default-expand-all="true" class="filter-tree" :filter-node-method="filterNode" @node-click="handleNodeClick">
              <span slot-scope="{ data }">
                <span>
                  <svg-icon
                    icon-class="folder"
                    style="margin-right: 8px"
                  />
                  <span class="count">{{ data.name }}</span>
                </span>
              </span>
              <svg-icon
                icon-class="folder"
                style="margin-right: 8px"
              />
            </el-tree>
          </div>
        </div>
        <div class="move-to-drawer-footer">
          <el-button
            :loading="loading"
            @click="closeSilence"
          >取 消</el-button>
          <el-button
            :loading="loading"
            type="primary"
            @click="handleMoveTo"
          >确 定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import dialogMinix from '@/mixins/dialogMixin'
import { getFolderLists, moveDataSet2Folder } from '@/api/dataSet'
export default {
  name: 'MoveDatasetDrawer',
  mixins: [dialogMinix],
  data () {
    this.defaultProps = {
      children: 'children',
      label: 'name'
    }
    return {
      treeData: [],
      folderList: [],
      // 目录搜索值
      searchKey: '',
      // 当前选中目录id
      selectFolderId: '',
      // 将被移动的数据集数组
      ids: [],
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.searchFolderList()
  },
  methods: {
    handleNodeClick(data) {
      this.selectFolderId = data._id
    },
    selectFolder (item) {
      this.selectFolderId = item._id
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 搜索数据集
    async searchFolderList () {
      const searchKey = this.searchKey
      try {
        const data = await getFolderLists({ searchKey })
        this.folderList = data.result
        this.treeData = [
          {
            name: '根目录',
            children: this.folderList
          }
        ]
      } catch (error) {
        console.log(error)
      }
    },
    async handleMoveTo () {
      this.loading = true
      try {
        const data = await moveDataSet2Folder({
          ids: this.ids,
          folderId: this.selectFolderId
        })
        this.$message.success(data)
        this.close()
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.dataset-drawer {
  ::v-deep .el-drawer__header {
    margin-bottom: 0 !important;
    padding: 15px 24px 15px !important;
  }
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0,0,0,0.90);
    font-weight: 500;
  }
  .move-to-drawer {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border-top: 1px #f1f1f1 solid;
    &-main {
      flex: 1;
      padding: 24px;
      &-content {
        margin-top: 8px;
        ::v-deep.el-tree-node__content{
          height: 30px;
          line-height: 30px;
          margin-bottom: 8px;
          &:hover{
            background-color: #FEF5EE;
          }
        }
        ::v-deep .el-tree-node:focus>.el-tree-node__content {
          background-color: #FEF5EE !important;
        }
        ::v-deep.el-tree-node.is-current > .el-tree-node__content {
          background-color: #FEF5EE !important;
        }
        .select-actived {
          background: #FEF5EE;
        }
      }
    }
    &-footer {
      display: flex;
      background: #F5F5F5;
      line-height: 50px;
      height: 50px;
      padding: 0;
      bottom: 0;
      align-items: center;
      position: absolute;
      width: 100%;
      justify-content: center;
      ::v-deep .el-button {
        line-height: 8px;
        height: 32px;
        border-radius: 2px;
      }
    }
  }
}
</style>
