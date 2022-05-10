<template>
  <div>
    <el-dialog :append-to-body="true" title="重置密码" :visible.sync="visible" :close-on-click-modal="false" width="40%" @close="handleClose">
      <div v-loading="loading">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item>
            <template #label>
              <span>
                账号名:
              </span>
            </template>
            <span>{{ resetData.userName }}</span>
          </el-form-item>
          <el-form-item prop="password">
            <template #label>
              <span>
                密码
              </span>
              <el-tooltip placement="top" trigger="hover" effect="dark">
                <svg-icon
                  style="cursor: pointer;"
                  icon-class="help-center"
                />
                <div slot="content">
                  <div>1. 密码为数字、大写字母、小写字母、特殊符号（@$!%*#_~?&）的组合</div>
                  <div>2. 长度限制为12-26位</div>
                  <div>3. 不能包含账号信息、字典序及键盘序</div>
                </div>
              </el-tooltip>
            </template>
            <div>
              <el-input v-model="form.password" placeholder="请输入密码" size="small" style="width:85%" show-password />
              <el-button type="text" style="margin-left:10px" @click="createNewPassword">随机生成</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </div>
    </el-dialog>
    <Success :success-visible.sync="successVisible" :success-data="successData" @refresh="refresh" />
  </div>
</template>

<script>
import { encryptAes } from '@/utils/encrypt'
import { resetUser } from '@/api/userManage'
import { validPassword, validContinuousChar, validKeyboardContinuousChar } from '@/utils/validate'
import Success from './Success'

export default {
  name: 'Reset',
  components: { Success },
  props: {
    resetVisible: {
      required: true,
      type: Boolean
    },
    resetData: {
      required: true,
      type: Object
    }
  },
  data () {
    this.rules = {
      password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { pattern: /^[^\s]*$/, message: '不能输入空格' },
        { validator: this.validatePassword, trigger: 'blur' }
      ]
    }
    return {
      loading: false,
      form: {
        password: ''
      },
      successData: {},
      successVisible: false
    }
  },
  computed: {
    visible: {
      get () { return this.resetVisible },
      set (newVal) { this.$emit('update:resetVisible', newVal) }
    }
  },
  methods: {
    handleClose () {
      this.form = { password: '' }
      this.$refs.form.clearValidate()
      this.visible = false
    },
    updatePassword () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true
            const encryptedPswd = encryptAes(this.form.password)
            const params = {
              password: encryptedPswd
            }
            const data = await resetUser(this.resetData._id, params)
            if (data) {
              this.successVisible = true
              this.visible = false
              this.successData = { userName: this.resetData.userName, password: this.form.password }
            }
          } catch (error) {
            console.log(error)
          } finally {
            this.loading = false
          }
        }
      })
    },
    createNewPassword () {
      const newPasswordArray = []
      // 密码12-26位
      const passwordLength = Math.floor(Math.random() * 15) + 12
      const str = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM@$!%*#_~?&^'
      for (let index = 0; index < passwordLength; index++) {
        const tag = Math.floor(Math.random() * str.length)
        newPasswordArray.push(str[tag])
      }
      const newPassword = newPasswordArray.join('')
      if (
        this.resetData.userName &&
        validPassword(newPassword) &&
        !validContinuousChar(newPassword) &&
        !validKeyboardContinuousChar(newPassword) &&
        !newPassword.toLowerCase().includes(this.resetData.userName.toLowerCase())
      ) {
        this.form.password = newPassword
        return
      }
      this.createNewPassword()
    },
    refresh () {
      this.$emit('refresh')
    },
    validatePassword (rule, value, callback) {
      if (!validPassword(value)) {
        callback(new Error('密码应包括数字、小写字母、大写字母和特殊符号四种类型字符(长度为12-26位)'))
        return
      }
      if (validContinuousChar(value)) {
        callback(new Error('密码不允许使用三个及以上的连续字符或连续相同字符'))
        return
      }
      if (validKeyboardContinuousChar(value)) {
        callback(new Error('密码不允许使用三个及以上的键盘连续字符'))
        return
      }
      if (value.toLowerCase().includes(this.resetData.userName.toLowerCase()) && this.resetData.userName !== '') {
        callback(new Error('密码包含账号信息!'))
        return
      }
      callback()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
::v-deep .el-dialog__title {
  font-size: 16px;
}
::v-deep .el-input__inner {
  font-size: 12px;
}
::v-deep .el-form-item__label {
  font-size: 12px;
}
.el-button--text {
  font-size: 12px;
  font-weight: 400;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin: 0 -20px -10px;
}
.info {
  font-size: 12px;
  color: rgba(153,153,153,0.90);
}
</style>
