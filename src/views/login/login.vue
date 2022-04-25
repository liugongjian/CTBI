<template>
  <div class="form">
    <el-form
      ref="loginForm"
      :model="loginForm"
      label-position="left"
      :rules="loginRules"
    >
      <div class="login-font">
        <span class="login-item_title">欢迎来到</span>
        <span class="login-item_title-bi">BI</span>
      </div>
      <el-form-item prop="userName">
        <span class="title-size">用户名</span>
        <el-input
          ref="userName"
          v-model="loginForm.userName"
          name="userName"
          type="text"
          placeholder="请输入用户名"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="title-size">密&emsp;码</span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <span class="title-size">验证码</span>
        <el-input
          v-model="loginForm.verifyCode"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="refresh" @click="verifyGet"><svg-icon icon-class="refresh" /></span>
        <span class="verifyImg" v-html="verifyImg" />
      </el-form-item>
    </el-form>
    <div class="button-style">
      <el-button
        class="button"
        @click="validateLogin"
      >
        登录
      </el-button>
      <div class="shadow" />
    </div>
  </div>

</template>

<script>
import { verify, login } from '@/api/user'
import { encryptAes } from '@/utils/encrypt'
export default {
  name: 'Login',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
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
      loginForm: {
        userName: '',
        password: '',
        verifyCode: '',
        from: 'platform'
      },
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
      loginRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      redirect: undefined,
      verifyImg: undefined,
      isValid: false,
      passwordType: 'password',
      activate: false
    }
  },
  mounted () {
    this.verifyGet()
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
      this.isValid = true
    },
    async verifyGet () {
      const data = await verify()
      if (data) {
        this.verifyImg = data
      }
    },
    validateLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.handleLogin()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async setUp () {
      this.loading = true
      this.activate = true
    },
    async handleLogin () {
      this.loading = true
      const { password } = this.loginForm
      const encryptedPswd = encryptAes(password)
      try {
        const { code, data } = await login({ ...this.loginForm, password: encryptedPswd })

        // const { code, data } = await login(this.loginForm)
        if (code === 200) {
          this.$store.dispatch('user/login', data.token).then(() => {
            this.$router.push('home').catch(err => console.log(err))
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else if (code === 1036) {
          this.isValid = false
        }
      } catch (err) {
        if (err.message === '1036') {
          this.$router.push('/login/activate')
        }
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verifyImg {
  position:absolute;
  display: inline-block;
  width: 90.63px;
  height: 46px;
  left: 250px;
  top: -10px;
  ::v-deep svg{
    width: 100%;
    height: 100%;
  }
}
.refresh {
  cursor: pointer;
  position:absolute;
  display: inline-block;
  height: 30px;
  width: 30px;
  left: 230px
}
</style>
