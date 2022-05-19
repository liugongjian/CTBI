<template>
  <el-dialog
    :title=" !data ? '新建文件夹' : '编辑文件夹'"
    :visible.sync="visible"
    width="30%"
    @close="close"
  >
    <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="文件夹名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入文件夹名称" />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createFolder, updateFolderOrDashboardProperties } from '@/api/dashboard'

export default {
  name: 'FolderEdit',
  props: {
    visible: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    data: Object,
    // eslint-disable-next-line vue/require-default-prop
    handleAction: Function
  },
  data () {
    const validateName = (rule, value, callback) => {
      const name = value.trim()
      if (name === '') {
        callback(new Error('请输入文件夹名称'))
      } else {
        const reg = /^[\u4e00-\u9fa5\w]{1,50}$/
        if (!reg.test(name)) {
          callback(new Error('支持中文、英文、数字及下划线, 长度不超过50'))
        } else {
          callback()
        }
      }
    }
    return {
      formData: {
        name: ''
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    data: {
      handler (newVal) {
        console.log(newVal)
        this.formData = !newVal ? {
          name: ''
        } : {
          name: newVal.name
        }
      }
    }
  },
  created () { },
  mounted () {
    console.log(this.data)
  },
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.executeSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async executeSubmit () {
      const name = this.formData.name.trim()
      const isEdit = this.data && this.data._id
      const body = isEdit ? {
        id: this.data._id,
        name,
        type: 'directory'
      } : {
        name
      }
      try {
        if (isEdit) {
          await updateFolderOrDashboardProperties(body)
        } else {
          await createFolder(body)
        }
        this.resetForm()
        this.$emit('handleAction', isEdit ? '重命名成功' : '创建成功')
      } catch (error) {
        console.log(error)
      }
    },
    close() {
      this.resetForm()
      this.$emit('handleAction', 'cancel')
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    }

  }
}
</script>
<style lang="scss" scoped>
.create-folder {
  display: flex;
  ::v-deep .el-input__inner {
    height: 32px;
  }
}
.dialog-footer {
  height: 50px;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
