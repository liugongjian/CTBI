<template>
  <el-dialog
    :title=" !data ? '新建文件夹' : '编辑文件夹'"
    :visible.sync="visible"
    width="30%"
    @close="close"
  >
    <div class="create-folder">
      <div style="line-height: 32px; width: 90px"><span>文件夹名称</span></div>
      <el-input
        v-model="newFolderName"
        placeholder="请输入文件夹名称"
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
        @click="submit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createFolder, updateFolderOrDashboardProperties } from '@/api/dashboard'

export default {
  name: 'FolderEdit',
  props: {
    visible: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    data: Object,
    // eslint-disable-next-line vue/require-default-prop
    handleAction: Function
  },
  data () {
    return {
      newFolderName: ''
    }
  },
  computed: {},
  watch: {
    data: {
      handler (newVal) {
        console.log(newVal)
        this.newFolderName = !newVal ? '' : newVal.name
      }
    }
  },
  created () { },
  mounted () {
    console.log(this.data)
  },
  methods: {
    async submit () {
      const name = this.newFolderName
      if (!name) {
        this.$message.warning('文件夹名称必填')
        return
      }
      const isEdit = this.data && this.data._id
      const body = isEdit ? {
        id: this.data._id,
        name,
        type: 'directory'
      } : {
        name
      }
      try {
        if (isEdit) {
          await updateFolderOrDashboardProperties(body)
        } else {
          await createFolder(body)
        }
        this.newFolderName = ''
        this.$emit('handleAction', isEdit ? '重命名成功' : '创建成功')
      } catch (error) {
        console.log(error)
      }
    },
    close() {
      this.newFolderName = ''
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
