<template>
  <el-dialog :append-to-body="true" :title="form.realName ? '创建成功' : '重置成功'" :visible.sync="visible" :close-on-click-modal="false" width="40%" @close="handleClose">
    <div v-loading="loading" class="create">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item prop="userName">
          <template #label>
            <span>
              账号名
            </span>
          </template>
          {{ form.userName }}
        </el-form-item>
        <el-form-item prop="password">
          <template #label>
            <span>
              密码
            </span>
          </template>
          {{ '********' }}
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">关 闭</el-button>
      <el-button type="primary" size="small" @click="(e) => handleClipboard(e)">一键复制</el-button>
    </div>
  </el-dialog>
</template>

<script>
import clipboard from '../../utils/clipboard'

export default {
  name: 'Success',
  props: {
    successVisible: {
      required: true,
      type: Boolean
    },
    successData: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      loading: false
      // form: {}
    }
  },
  computed: {
    visible: {
      get () {
        return this.successVisible
      },
      set (val) {
        this.$emit('update:successVisible', val)
      }
    },
    form: {
      get () {
        return this.successData
      }
    }
  },
  methods: {
    handleClose () {
      // this.form = {}
      this.$refs.form.clearValidate()
      this.$emit('refresh')
      this.visible = false
    },
    handleClipboard (event) {
      const str = `账号名：${this.form.userName}\n密码：${this.form.password}`
      clipboard(str, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.create {
  ::v-deep .el-input--small {
    width: 85%;
  }
  .info {
    font-size: 12px;
    color: rgba(153,153,153,0.90);
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
::v-deep .el-dialog__title {
  font-size: 16px;
}
::v-deep .el-dialog__body {
  padding-bottom: 10px;
}
::v-deep .el-input__inner {
  font-size: 12px;
}
::v-deep .el-form-item__label {
  font-size: 12px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin: 0 -20px -10px;
}
</style>
