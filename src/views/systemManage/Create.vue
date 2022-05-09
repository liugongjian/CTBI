<template>
  <div>
    <el-dialog :append-to-body="true" title="新建账号" :visible.sync="visible" :close-on-click-modal="false" @close="handleClose">
      <div v-loading="loading" class="create">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item prop="userName">
            <template #label>
              <span>
                账号名
              </span>
              <el-tooltip placement="top" trigger="hover" effect="dark">
                <svg-icon
                  style="cursor: pointer;"
                  icon-class="help-center"
                />
                <div slot="content">
                  <div>1. 账号名为数字、大写字母、小写字母的组合</div>
                  <div>2. 长度不能超过50个字符</div>
                  <div>3. 不能以数字开头</div>
                </div>
              </el-tooltip>
            </template>
            <el-input v-model="form.userName" size="small" placeholder="请输入账号名" />
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
                  <div>2. 长度限制为8-20位</div>
                  <div>3. 不能包含账号信息、字典序及键盘序</div>
                </div>
              </el-tooltip>
            </template>
            <div>
              <el-input v-model="form.password" placeholder="请输入密码" size="small" style="width:85%" show-password />
              <el-button type="text" style="margin-left:10px" @click="createNewPassword">随机生成</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="realName">
            <template #label>
              <span>
                真实姓名
              </span>
            </template>
            <el-input v-model="form.realName" size="small" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item prop="phone">
            <template #label>
              <span>
                手机号
              </span>
            </template>
            <el-input v-model="form.phone" size="small" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="email">
            <template #label>
              <span>
                邮箱
              </span>
            </template>
            <el-input v-model="form.email" size="small" placeholder="请输入邮箱" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleCreate">确 定</el-button>
      </div>
    </el-dialog>
    <Success :success-visible.sync="successVisible" :success-data="successData" @refresh="refresh" />
  </div>
</template>

<script>
import { encryptAes } from '@/utils/encrypt'
import { validEmail, validPhone } from '@/utils/validate'
import { exists, createUser } from '@/api/userManage'
import { deepClone } from '@/utils/optionUtils'
import _ from 'lodash'
import { validPassword, validContinuousChar, validKeyboardContinuousChar } from '@/utils/validate'
import Success from './Success'

export default {
  name: 'Create',
  components: { Success },
  // directives: { trim },
  props: {
    createVisible: {
      required: true,
      type: Boolean
    }
  },
  data () {
    this.rules = {
      userName: [
        { required: true, message: '请输入账号名', trigger: 'blur' },
        { pattern: /^[\w]*$/, message: '账号名仅支持英文、数字', trigger: 'blur' },
        { pattern: /^[^0-9].*$/, message: '账号名不能以数字开头', trigger: 'blur' },
        { validator: this.validateExists, trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
        { pattern: /^[^\s]*$/, message: '不能输入空格' },
        { validator: this.validatePassword, trigger: 'blur' }
      ],
      realName: [
        { required: true, message: '请输入真实姓名', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '真实姓名只允许输入中文和英文', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: this.checkPhone, trigger: 'blur' },
        { validator: this.validateExists, trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: this.checkMail, trigger: 'blur' },
        { validator: this.validateExists, trigger: 'blur' }
      ]
    }
    return {
      loading: false,
      form: {
        userName: '',
        password: '',
        realName: '',
        phone: '',
        email: ''
      },
      successVisible: false,
      successData: {}
    }
  },
  computed: {
    visible: {
      get () {
        return this.createVisible
      },
      set (val) {
        this.$emit('update:createVisible', val)
      }
    }
  },
  methods: {
    handleClose () {
      this.form = {
        userName: '',
        password: '',
        realName: '',
        phone: '',
        email: ''
      }
      this.$refs.form.clearValidate()
      this.visible = false
    },
    handleCreate () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true
            const encryptedPswd = encryptAes(this.form.password)
            const params = {
              ..._.omit(this.form, ['password']),
              password: encryptedPswd,
              from: 'platform'
            }
            const data = await createUser(params)
            if (data) {
              this.successVisible = true
              this.successData = deepClone(this.form)
              this.visible = false
            }
          } catch (error) {
            console.log(error)
          } finally {
            this.loading = false
          }
        }
      })
    },
    checkMail (rule, value, callback) {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      }
      callback()
    },
    checkPhone (rule, value, callback) {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      }
      callback()
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
        validPassword(newPassword) &&
        !validContinuousChar(newPassword) &&
        !validKeyboardContinuousChar(newPassword)
      ) {
        if (this.form.userName && newPassword.toLowerCase().includes(this.form.userName.toLowerCase())) {
          this.form.password = newPassword
          return
        }
        this.form.password = newPassword
        return
      }
      this.createNewPassword()
    },
    async validateExists (rule, value, callback) {
      const params = rule.field === 'userName' ? { userName: value } : rule.field === 'phone' ? { phone: value } : { email: value }
      const label = rule.field === 'userName' ? '账号名' : rule.field === 'phone' ? '手机号' : '邮箱'
      const isExist = await exists({ ...params, from: 'platform' })
      if (isExist) {
        callback(new Error(`${label}已存在`))
      }
      callback()
    },
    refresh () {
      this.$emit('refresh')
    },
    validatePassword (rule, value, callback) {
      if (!validPassword(value)) {
        callback(new Error('密码应包括数字、小写字母、大写字母和特殊符号四种类型字符(长度为8-26位)'))
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
      if (value.toLowerCase().includes(this.form.userName.toLowerCase()) && this.form.userName !== '') {
        callback(new Error('密码包含账号信息!'))
        return
      }
      callback()
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
.el-button--text {
  font-size: 12px;
  font-weight: 400;
}
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
.dialog-footer {
  display: flex;
  justify-content: center;
  margin: 0 -20px -10px;
}
</style>
