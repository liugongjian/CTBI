<template>
  <el-dialog
    title="链接跳转"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="70%"
  >
    <iframe
      :src="url"
      style="width:100%;min-height:500px;"
    />
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'

export default {
  name: 'RCDialog',
  mixins: [dialogMixin]
}
</script>
