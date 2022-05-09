<template>
  <el-dialog
    title="编辑字段"
    width="600px"
    :visible.sync="dialogVisible"
  >
    <el-form :model="form">
      <el-form-item
        label="字段名称"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.displayColumn"
          maxlength="100"
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
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeSilence">取 消</el-button>
      <el-button
        type="primary"
        @click="close(form)"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/dialogs/dialogMixin'
export default {
  name: 'EditDimensionMeasureDialog',
  mixins: [dialogMixin],
  data () {
    return {
      form: {},
      formLabelWidth: '120px'
    }
  }
}
</script>
