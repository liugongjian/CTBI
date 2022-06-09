<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="480px"
  >
    <div>
      <div class="title">{{ title }}</div>
      <div class="d-f">
        <div>
          <svg-icon
            icon-class="warning"
            style="margin-right: 16px;width: 16px;height: 16px;"
          />
        </div>
        <div><span>{{ content }}</span></div>
      </div>
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
      content: '您是否要删除该数据？',
      title: '删除提示'
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 8px;
  border-bottom: 0px solid #ddd;
}
::v-deep .el-dialog__body {
  padding: 0px 32px;
}
::v-deep .el-dialog > .el-dialog__footer {
  background: #fff;
  text-align: right;
}
.title {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  line-height: 22px;
  margin-bottom: 16px;
}
</style>
