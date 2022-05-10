<template>
  <el-dialog
    title="保存数据集"
    :visible.sync="dialogVisible"
    width="480px"
  >
    <el-form
      :model="dataInfo"
      label-width="70px"
    >
      <el-form-item label="活动名称">
        <div>
          <el-input
            v-model="dataInfo.displayName"
            autocomplete="off"
            placeholder="请输入数据集名称"
          />
        </div>
        <div style="margin-top:8px;font-size: 12px;color: rgba(0, 0, 0, 0.45);">
          <span>名称只能由中英文、数字及下划线(_)、斜线(/)、反斜线(\)、竖线(I)、 小括号(())、中括号([])组成，不超过50个字符。</span>
        </div>
      </el-form-item>

      <el-form-item
        label="位置"
        class="m-t-8"
      >
        <el-select
          v-model="dataInfo.folderId"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in folderList"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        :loading="loading"
        @click="closeSilence"
      >取 消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSave"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { createDataSets, updateDataSet, getFolderLists } from '@/api/dataSet'

export default {
  name: 'SaveDataSetDialog',
  mixins: [dialogMixin],
  data () {
    return {
      dataInfo: {},
      // 文件列表
      folderList: []
    }
  },
  // 避免页面跳动，先拉取目录数据
  created () {
    this.getFolder()
  },
  methods: {
    // 保存数据
    async handleSave () {
      try {
        this.loading = true
        const body = Object.assign({}, this.dataInfo)
        if (body._id) {
          await updateDataSet(body._id, body)
        } else {
          await createDataSets(body)
        }
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.close()
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async getFolder () {
      const { result } = await getFolderLists()
      this.folderList = result
    }
  }
}
</script>
