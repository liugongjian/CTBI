<template>
  <div class="form">
    <span class="back" @click="back">
      <svg-icon icon-class="back" />
    </span>
    <el-form
      ref="validForm"
      :model="validForm"
      label-position="left"
      :rules="validRules"
    >
      <div class="login-font">
        <span class="login-item_title">激活</span>
      </div>
      <el-form-item prop="oldPassword">
        <span class="title-size">旧密码</span>
        <el-input
          ref="oldPassword"
          v-model="validForm.oldPassword"
          name="oldPassword"
          :type="passwordType"
          placeholder="请输入旧密码"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="newPassword">
        <span class="title-size">新密码</span>
        <el-input
          v-model="validForm.newPassword"
          :type="passwordType"
          placeholder="请输入新密码"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <span class="title-size">新密码</span>
        <el-input
          v-model="validForm.checkPassword"
          :type="passwordType"
          placeholder="请再次输入新密码"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
    </el-form>
    <div class="button-style">
      <el-button
        class="button"
        @click="setUp"
      >
        确认
      </el-button>
      <div class="shadow" />
    </div>
    <span class="warn">
      <svg-icon icon-class="warn" />
      <span class="warn-text">您尚未激活，请修改出厂密码。</span>
    </span>
  </div>
</template>

<script>
import { activate } from '@/api/user'
import { encryptAes } from '@/utils/encrypt'
export default {
  name: 'Login',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else if (value === this.validForm.oldPassword) {
        callback(new Error('新密码应不能与旧密码相同'))
      } else {
        if (this.validForm.checkPassword !== '') {
          this.$refs.validForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.validForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      validForm: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      validRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }]
      },
      loading: false,
      redirect: undefined,
      verifyImg: undefined,
      isValid: false,
      passwordType: 'password'
    }
  },
  mounted () {
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      // this.$nextTick(() => {
      //   this.$refs.password.focus()
      // })
    },
    back () {
      this.$router.push('/login')
    },

    async setUp () {
      this.$refs['validForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          const oldPassword = encryptAes(this.validForm.oldPassword)
          const newPassword = encryptAes(this.validForm.newPassword)
          const data = {
            _id: this.$route.query.userName,
            oldPassword: oldPassword,
            newPassword: newPassword
          }
          try {
            await activate(data)
            this.$message({
              type: 'success',
              message: '激活成功!',
              center: true
            })
            this.$router.push({ path: '/login' })
          } catch (error) {
            console.log(error)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.button-style {
    position: relative;
    margin-top: 58px;
  }
.button {
    background: #f0914b;
    color: #fff;
    width: 100%;
    height: 50px;
    font-size: 18px;
    border:#f0914b;
    border-radius: 10px;
  }
::v-deep .back {
  display: inline-block;
  font-size: 62px;
  color:#6A6A6A;
  margin-bottom: 10%;
  cursor: pointer
  }

.back:hover {
  color: black;
}
</style>
<style>
.title-size {
  width: 57px;
  height: 25px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #696969;
  letter-spacing: 1px;
  font-weight: 500;
  margin-right: 1em;
}
.el-message {
  background-color:#FFF;
  border-color:#E6E6E6;
  box-shadow: 2px 4px 12px 0px rgba(0,0,0,0.09);
  border-radius: 2px;
  font: 500 16px/42px "PingFang SC";
  color: #333333;
  letter-spacing: 0.89px;
}
</style>

