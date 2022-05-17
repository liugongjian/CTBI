<template>
  <el-dialog
    title="编辑字段"
    width="600px"
    :visible.sync="dialogVisible"
  >
    <el-form
      ref="form"
      :model="form"
    >
      <el-form-item
        label="字段名称"
        :label-width="formLabelWidth"
        prop="displayColumn"
        :rules="[
          { pattern: regex.DATASET_NAME_REGEX, message: '字段名称只能由中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号组成，不超过50个字符', trigger: 'change' }
        ]"
      >
        <el-input
          v-model="form.displayColumn"
          maxlength="50"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="物理字段名"
        :label-width="formLabelWidth"
      >
        {{ form.column }}
      </el-form-item>
      <el-form-item
        label="字段描述"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.comment"
          type="textarea"
          maxlength="100"
          :rows="2"
          placeholder="请输入字段描述"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeSilence">取 消</el-button>
      <el-button
        type="primary"
        @click="checkDisplayColumn"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import regex from '@/constants/regex'

export default {
  name: 'EditDimensionMeasureDialog',
  mixins: [dialogMixin],
  data () {
    return {
      regex: regex,
      form: {},
      formLabelWidth: '120px',
      fields: []
    }
  },
  methods: {
    checkDisplayColumn () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const temp = this.fields.find(item => (item.displayColumn === this.form.displayColumn && item._id !== this.form._id))
          if (temp) {
            this.$message.error('字段名称和其他对象存在重名，请检查！')
          } else {
            this.close(this.form)
          }
        }
      })
    }
  }
}
</script>
