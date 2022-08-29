<template>
  <el-drawer
    title="资源移动到"
    :visible.sync="visible"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <div class="move-to-drawer">
      <div class="move-to-drawer-main">
        <el-input
          v-model="searchKey"
          placeholder="请输入"
          prefix-icon="el-icon-search"
          @input="searchfolder"
        />
        <div
          class="move-to-drawer-main-content"
        >
          <div
            class="move-to-drawer-main-content-root"
            :class="{'select-actived': selectFolderId === '-1' }"
            @click="selectFolder({id: '-1'})"
          >
            <svg-icon
              icon-class="folder"
              style="margin-right: 8px"
            />
            根目录
          </div>
          <ul>
            <li
              v-for="item in folderList"
              :key="item.id"
              :class="{'select-actived': selectFolderId == item.id }"
              @click="selectFolder(item)"
            >
              <svg-icon
                icon-class="folder"
                style="margin-right: 8px"
              />
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="move-to-drawer-footer">
        <el-button
          @click="close"
        >取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="handleMoveTo"
        >确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getFolderTree, moveDashboardToFolder } from '@/api/dashboard'
import _ from 'lodash'
export default {
  props: {
    visible: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    ids: Array,
    // eslint-disable-next-line vue/require-default-prop
    handleAction: Function
  },
  data () {
    return {
      folderList: [],
      // 目录搜索值
      searchKey: '',
      // 当前选中目录id
      selectFolderId: '',
      originList: [],
      loading: false
    }
  },
  mounted () {
    this.getFolders()
  },
  methods: {
    selectFolder (item) {
      this.selectFolderId = item.id
    },
    async getFolders() {
      try {
        const data = await getFolderTree()
        this.folderList = data.result
        this.originList = data.result
      } catch (error) {
        console.log(error)
      }
    },
    // 搜索
    searchfolder: _.debounce(function() {
      const searchkey = this.searchKey
      const result = this.originList.filter(item => {
        return item.name.includes(searchkey)
      })
      this.folderList = result
      if (this.selectFolderId && this.selectFolderId !== '-1' && result.findIndex(item => item.id === this.selectFolderId)) {
        this.selectFolderId = ''
      }
    }, 500),
    async handleMoveTo () {
      if (!this.selectFolderId) {
        this.$message.warning('请选中文件夹')
        return
      }
      this.loading = true
      try {
        const data = await moveDashboardToFolder({
          dashboardIds: this.ids,
          folderId: this.selectFolderId
        })
        this.$message.success(data)
        this.selectFolderId = null
        this.searchKey = null
        this.$emit('handleAction', 'success')
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    close () {
      this.selectFolderId = null
      this.searchKey = null
      this.$emit('handleAction', 'cancel')
    }

  }
}
</script>
<style lang="scss" scoped>
.move-to-drawer {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-top: 1px #f1f1f1 solid;
  height: calc(100vh - 75px);
  &-main {
    flex: 1;
    padding: 24px;
    &-content {
      &-root {
        display: flex;
        height: 30px;
        justify-content: flex-start;
        align-items: center;
        margin-top: 6px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
        padding-left: 10px;
      }
      ul > li {
        list-style: none;
        height: 30px;
        line-height: 30px;
        margin-bottom: 8px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        padding-left: 25px;
        cursor: pointer;
      }
      .select-actived {
        background: #f79b53;
      }
    }
  }
  &-footer {
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
}
</style>
