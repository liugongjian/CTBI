<template>
  <el-dialog
    title="属性"
    :visible.sync="dialogVisible"
    width="480px"
  >
    <div class="data-set-didlog-main">
      <el-form
        :model="dataSetAttr"
        style="padding: 0px"
      >
        <el-form-item
          label="名称"
          label-width="80px"
        >
          <el-input
            v-model="dataSetAttr.displayName"
            autocomplete="off"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          label-width="80px"
        >
          <el-input
            v-model="dataSetAttr.comment"
            type="textarea"
            style="width: 360px"
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
        @click="hanleDataSetAttribute"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { updateDataSet } from '@/api/dataSet'

export default {
  name: 'EditDatasetAttrDialog',
  mixins: [dialogMixin],
  props: {},
  data () {
    return {
      dataSetAttr: {}
    }
  },
  mounted () {
    console.log(this.dataSetAttr)
  },
  methods: {
    async hanleDataSetAttribute () {
      const id = this.dataSetAttr._id
      const params = {
        displayName: this.dataSetAttr.name,
        comment: this.dataSetAttr.comment
      }
      try {
        this.loading = true
        await updateDataSet(id, params)
        this.close()
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
