<template>
  <el-dialog
    title="另存为模板"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="480px"
    @close="handleClose"
  >
    <div class="data-set-dialog-main">
      <el-form
        ref="attrForm"
        style="padding: 0px"
        :model="form"
        :rules="attrRules"
        label-width="60px"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="仅支持中英文和数字,长度不超过50"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
          style="margin-top: 30px"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="仅支持中英文和数字,长度不超过100"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleClick"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    templateVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validateName = (rule, value, callback) => {
      const name = value.trim()
      if (name === '') {
        callback(new Error('请输入模板名称'))
      } else {
        // const reg = /^[\u4e00-\u9fa5\w]{1,50}$/
        const reg = /^[\u4e00-\u9fa5\w]+$/
        if (!reg.test(name)) {
          callback(new Error('仅支持中英文和数字,不能含有特殊字符'))
        } else if (name.length > 50) {
          callback(new Error('字符长度不超过50'))
        } else {
          callback()
        }
      }
    }
    const validateDescription = (rule, value, callback) => {
      const description = value.trim()
      if (description === '') {
        callback(new Error('请输入模板描述'))
      } else {
        // const reg = /^[\u4e00-\u9fa5\w]{1,100}$/
        const reg = /^[\u4e00-\u9fa5\w]+$/
        if (!reg.test(description)) {
          callback(new Error('仅支持中英文和数字,不能含有特殊字符'))
        } else if (description.length > 100) {
          callback(new Error('字符长度不超过100'))
        } else {
          callback()
        }
      }
    }
    return {
      form: {
        name: '',
        description: ''
      },
      loading: false,
      attrRules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        description: [
          { required: true, validator: validateDescription, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    visible: {
      get () {
        return this.templateVisible
      },
      set (val) {
        this.$emit('update:templateVisible', val)
      }
    }
  },
  methods: {
    handleClose () {
      this.visible = false
      this.$refs.attrForm.resetFields()
    },
    handleClick () {
      this.$refs.attrForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$emit('handleSubmit', _.cloneDeep(this.form), this.cb)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cb () {
      this.loading = false
      this.handleClose()
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  padding-top: 10px;
}
</style>
