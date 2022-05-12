<template>
  <el-drawer
    title="资源移动到"
    :visible.sync="dialogVisible"
  >
    <div class="move-to-drawer">
      <div class="move-to-drawer-main">
        <el-input
          v-model="searchKey"
          placeholder="请输入"
          prefix-icon="el-icon-search"
          @change="searchFloderList"
        />
        <div
          v-loading="loading"
          class="move-to-drawer-main-content"
        >
          <span class="move-to-drawer-main-content-root">根目录</span>
          <ul>
            <li
              v-for="(item, i) in floderList"
              :key="i"
              :class="{'select-actived': selectFloderId == item._id }"
              @click="selectFloder(item)"
            >
              <svg-icon
                icon-class="floder"
                style="margin-right: 8px"
              />
              {{ item.name }}
            </li>
          </ul>
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
</template>

<script>
import dialogMinix from '@/mixins/dialogMixin'
import { getFolderLists, moveDataSet2Folder } from '@/api/dataSet'
export default {
  name: 'MoveDatasetDrawer',
  mixins: [dialogMinix],
  data () {
    return {
      floderList: [],
      // 目录搜索值
      searchKey: '',
      // 当前选中目录id
      selectFloderId: '',
      // 将被移动的数据集数组
      ids: []
    }
  },
  mounted () {
    this.searchFloderList()
  },
  methods: {
    selectFloder (item) {
      this.selectFloderId = item._id
    },
    // 搜索数据集
    async searchFloderList () {
      const searchkey = this.searchKey
      try {
        const data = await getFolderLists({ searchkey })
        this.floderList = data.result
      } catch (error) {
        console.log(error)
      }
    },
    async handleMoveTo () {
      this.loading = true
      try {
        const data = await moveDataSet2Folder({
          ids: this.ids,
          folderId: this.selectFloderId
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
        display: inline-block;
        height: 30px;
        line-height: 30px;
        margin-top: 6px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
      ul > li {
        list-style: none;
        height: 30px;
        line-height: 30px;
        margin-bottom: 8px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        padding-left: 20px;
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
