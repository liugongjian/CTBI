<template>
  <el-dialog
    title="保存数据集"
    :visible.sync="dialogVisible"
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
        @click="validForm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import regex from '@/constants/regex'
import { createDataSets, updateDataSet, getFolderLists } from '@/api/dataSet'

export default {
  name: 'SaveDataSetDialog',
  mixins: [dialogMixin],
  data () {
    return {
      dataInfo: {},
      rules: {
        displayName: [
          { required: true, message: '请输入数据集名称', trigger: 'change' },
          { pattern: regex.STRING_REGEX2, message: '名称输入有误，请参考下方提示', trigger: 'change' }
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
          _id: this.dataInfo._id,
          displayName: this.dataInfo.displayName,
          sql: this.dataInfo.sql,
          fields: this.dataInfo.fields,
          comment: this.dataInfo.comment,
          folderId: this.dataInfo.folderId
        }
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
    },
    // 名称规则校验
    validateName (rule, value, callback) {

    }
  }
}
</script>
