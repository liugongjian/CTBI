<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="form"
      label-width="90px"
      @submit.native.prevent
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          autocomplete="off"
          maxlength="50"
          placeholder="请输入文件夹名称"
        />
      </el-form-item>
      <div style="padding-left: 90px;margin-top:8px;font-size: 12px;color: rgba(0, 0, 0, 0.45);">
        <span>名称只能由中英文、数字及下划线(_)组成，不超过50个字符。</span>
      </div>
    </el-form>

    <span slot="footer">
      <el-button
        :loading="loading"
        @click="closeSilence"
      >取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="validForm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import regex from '@/constants/regex'
import { createFolders, updateFolderName, existsFolder } from '@/api/dataSet'

export default {
  name: 'SaveDatesetFolderDialog',
  mixins: [dialogMixin],
  data () {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入数据集名称', trigger: 'change' },
          { pattern: regex.FOLDER_REGEX, message: '名称输入有误，请参考下方提示', trigger: 'change' },
          { validator: this.existFolder, trigger: 'blur' }
        ]
      },
      title: '新建文件夹'
    }
  },
  methods: {
    validForm () {
      const self = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (self.form._id) {
            self.handlerUpdate()
          } else {
            self.handlerCreate()
          }
        } else {
          return false
        }
      })
    },
    async handlerCreate () {
      const body = Object.assign({ type: 'dataSet' }, this.form)
      try {
        const data = await createFolders(body)
        this.$message.success(data)
        this.close()
      } catch (error) {
        console.log(error)
      }
    },
    async handlerUpdate () {
      const id = this.form._id
      const body = {
        name: this.form.name
      }
      try {
        const data = await updateFolderName(id, body)
        this.$message.success(data)
        this.close()
      } catch (error) {
        console.log(error)
      }
    },
    async existFolder (rule, value, callback) {
      const isExist = await existsFolder({ type: 'dataSet', name: this.form.name, excludeId: this.form._id })
      if (isExist) {
        callback(new Error('文件夹名称已存在！'))
      }
      callback()
    }
  }
}
</script>
