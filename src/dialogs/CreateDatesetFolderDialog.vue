<template>
  <el-dialog
    title="新建文件夹"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <div class="create-folder">
      <div style="line-height: 32px; width: 70px"><span>文件名称</span></div>
      <el-input
        v-model="newFolderName"
        placeholder="请输入文件名称"
        style="margin-left: 12px;height: 32px"
      />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeSilence">取 消</el-button>
      <el-button
        type="primary"
        @click="handlerCreateFolder"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/dialogs/dialogMixin'
import { createFolders } from '@/api/dataSet'

export default {
  name: 'CreateDatesetFolderDialog',
  mixins: [dialogMixin],
  props: {},
  data () {
    return {
      newFolderName: ''
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async handlerCreateFolder () {
      const body = {
        type: 'dataSet',
        name: this.newFolderName
      }
      try {
        await createFolders(body)
        this.close()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.create-folder {
  display: flex;
  ::v-deep .el-input__inner {
    height: 32px;
  }
}
.dialog-footer {
  height: 50px;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>
