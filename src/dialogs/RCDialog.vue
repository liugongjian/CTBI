<template>
  <el-dialog
    title="链接跳转"
    :visible.sync="dialogVisible"
    width="70%"
  >
    <iframe
      :src="url"
      style="width:100%;min-height:500px;"
    />
  </el-dialog>
</template>

<script>
import dialogMinix from '@/dialogs/dialogMixin'

export default {
  name: 'RCDialog',
  mixins: [dialogMinix]
}
</script>
