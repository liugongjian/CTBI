<template>
  <el-dialog
    title="新建文件夹"
    :visible.sync="visible"
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
      <el-button @click="close">取 消</el-button>
      <el-button
        type="primary"
        @click="handlerCreateFolder"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createFolder } from '@/api/dashboard'

export default {
  name: 'FolderEdit',
  props: {
    visible: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    handleAction: Function
  },
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
        name: this.newFolderName
      }
      try {
        await createFolder(body)
        this.close()
      } catch (error) {
        console.log(error)
      }
    },
    close() {
      console.log(123)
      this.$emit('handleAction', 'cancel')
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
