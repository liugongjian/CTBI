<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <span>这是一段信息</span>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeSilence()">取 消</el-button>
      <el-button
        type="primary"
        @click="close()"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMinix from '@/dialogs/dialogMixin'

export default {
  name: 'TestDialog',
  mixins: [dialogMinix]
}
</script>
