<template>
  <el-dialog
    title="属性"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
  >
    <div class="data-set-dialog-main">
      <el-form
        ref="form"
        :model="dataSetAttr"
        :rules="rules"
        style="padding: 0px"
        @submit.native.prevent
      >
        <el-form-item
          label="数据集名称"
          label-width="100px"
          prop="displayName"
        >
          <el-input
            v-model="dataSetAttr.displayName"
            placeholder="请输入数据集名称"
            autocomplete="off"
          />
        </el-form-item>
        <div style="padding-left: 100px;margin-bottom:8px;font-size: 12px;color: rgba(0, 0, 0, 0.45);">
          <span>名称只能由中英文、数字及下划线(_)、斜线(/)、反斜线(\)、竖线(|)、 小括号(())、中括号([])组成，不超过50个字符。</span>
        </div>
        <el-form-item
          label="描述"
          label-width="100px"
          prop="comment"
        >
          <el-input
            v-model="dataSetAttr.comment"
            type="textarea"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
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
        @click="handleDataSetAttribute"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { updateDataSet, existsDataSet } from '@/api/dataSet'
import regex from '@/constants/regex'

export default {
  name: 'EditDatasetAttrDialog',
  mixins: [dialogMixin],
  props: {},
  data () {
    this.rules = {
      displayName: [
        { required: true, message: '请输入数据集名称', trigger: 'blur' },
        { pattern: regex.STRING_REGEX2, message: '名称输入有误，请参考下方提示', trigger: 'blur' },
        { validator: this.existDataSet, trigger: 'blur' }
      ],
      comment: [
        { whitespace: true, message: '描述不能全为空格' }
      ]
    }
    return {
      dataSetAttr: {}
    }
  },
  methods: {
    async handleDataSetAttribute () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const id = this.dataSetAttr._id
          const params = {
            displayName: this.dataSetAttr.displayName,
            comment: this.dataSetAttr.comment
          }
          try {
            await updateDataSet(id, params)
            this.close()
          } catch (error) {
            console.log(error)
          }
          this.loading = false
        }
      })
    },
    async existDataSet (rule, value, callback) {
      const isExist = await existsDataSet({ excludeId: this.dataSetAttr._id, displayName: this.dataSetAttr.displayName })
      if (isExist) {
        callback(new Error('数据集名称已存在！'))
      }
      callback()
    }
  }
}
</script>
