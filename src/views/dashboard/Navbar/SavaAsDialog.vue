<template>
  <el-dialog
    title="另存为模板"
    :visible.sync="visible"
    width="480px"
    @close="handleClose"
  >
    <div class="data-set-didlog-main">
      <el-form
        ref="attrForm"
        style="padding: 0px"
        :model="form"
        :rules="attrRules"
        label-width="40px"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入模板名称"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
          style="margin-top: 30px"
        >
          <el-input v-model="form.description" type="textarea" placeholder="请输入模板描述" />
        </el-form-item>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        v-loading="loading"
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
  data() {
    const validateName = (rule, value, callback) => {
      const name = value.trim()
      if (name === '') {
        callback(new Error('请输入模板名称'))
      } else {
        const reg = /^[\u4e00-\u9fa5\w]{1,50}$/
        if (!reg.test(name)) {
          callback(new Error('仅支持中英文和数字,长度不超过50'))
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
        const reg = /^[\u4e00-\u9fa5\w]{1,100}$/
        if (!reg.test(description)) {
          callback(new Error('仅支持中英文和数字,长度不超过100'))
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
          { validator: validateName, trigger: 'blur' }
        ],
        description: [
          { validator: validateDescription, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.templateVisible
      },
      set(val) {
        this.$emit('update:templateVisible', val)
      }
    }
  },
  methods: {
    handleClose() {
      this.visible = false
      this.$refs.attrForm.resetFields()
    },
    handleClick() {
      this.loading = true
      this.$emit('handleSubmit', _.cloneDeep(this.form), this.cb)
    },
    cb() {
      this.loading = false
      this.handleClose()
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer{
  padding-top: 10px;
}
</style>
