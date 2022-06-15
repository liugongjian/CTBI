<template>
  <el-dialog
    title="保存数据集"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="dataInfo"
      label-width="90px"
    >
      <el-form-item
        label="名称"
        prop="displayName"
      >
        <div>
          <el-input
            v-model="dataInfo.displayName"
            autocomplete="off"
            maxlength="50"
            placeholder="请输入数据集名称"
          />
        </div>
      </el-form-item>
      <div style="padding-left: 90px;margin-top:8px;font-size: 12px;color: rgba(0, 0, 0, 0.45);">
        <span>名称只能由中英文、数字及下划线(_)、斜线(/)、反斜线(\)、竖线(|)、 小括号(())、中括号([])组成，不超过50个字符。</span>
      </div>

      <el-form-item
        label="位置"
        class="m-t-8"
      >
        <b-select-tree
          v-model="dataInfo.folderId"
          leaf-icon="folder"
          :close-on-click="true"
          :indent="0"
          :data="folderList"
          :default-expand-all="true"
        />
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
        @click="validForm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import regex from '@/constants/regex'
import { createDataSets, existsDataSet, getFolderLists } from '@/api/dataSet'

export default {
  name: 'SaveDataSetDialog',
  mixins: [dialogMixin],
  data () {
    return {
      dataInfo: {},
      rules: {
        displayName: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
          { pattern: regex.DATASET_NAME_REGEX, message: '名称输入有误，请参考下方提示', trigger: 'blur' },
          { validator: this.existDataSet, trigger: 'blur' }
        ]
      },
      // 文件列表
      folderList: []
    }
  },
  // 避免页面跳动，先拉取目录数据
  created () {
    this.getFolder()
  },
  methods: {
    validForm () {
      const self = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          self.handleSave()
        } else {
          return false
        }
      })
    },
    // 保存数据
    async handleSave () {
      try {
        this.loading = true
        const body = {
          displayName: this.dataInfo.displayName,
          sql: this.dataInfo.sql,
          fields: this.dataInfo.fields,
          comment: this.dataInfo.comment,
          folderId: this.dataInfo.folderId
        }
        await createDataSets(body)
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
      const folders = [{ _id: '', name: '根目录', children: [...result] }]
      this.folderList = folders
    },
    async existDataSet (rule, value, callback) {
      const isExist = await existsDataSet({ displayName: this.dataInfo.displayName })
      if (isExist) {
        callback(new Error('文件夹名称已存在！'))
      }
      callback()
    }
  }
}
</script>
