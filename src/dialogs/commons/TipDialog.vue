<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="480px"
  >
    <div>
      <svg-icon
        icon-class="tip"
        style="margin-right: 8px"
      />
      <span>{{ content }}</span>
    </div>
    <span slot="footer">
      <el-button @click="closeSilence">取 消</el-button>
      <el-button
        type="primary"
        @click="close"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
export default {
  name: 'TipDialog',
  mixins: [dialogMixin],
  data () {
    return {
      content: '您是否要删除该数据？'
    }
  }
}
</script>
