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
          @keyup.enter.native="validateLogin"
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
          @keyup.enter.native="validateLogin"
        />
        <span
          class="refresh"
          @click="verifyGet"
        >
          <svg-icon icon-class="refresh" />
        </span>
        <span
          class="verifyImg"
          v-html="verifyImg"
        />
      </el-form-item>
    </el-form>
    <div class="button-style">
      <el-button
        v-loading="loading"
        class="button"
        @click="validateLogin"
      >
        登录
      </el-button>
      <div class="shadow" />
    </div>
    <span
      v-if="logout"
      class="warn"
    >
      <svg-icon icon-class="warn" />
      <span class="warn-text">您的账号已被注销，请联系系统管理员！</span>
    </span>
    <span
      v-if="freeze"
      class="warn"
    >
      <svg-icon icon-class="warn" />
      <span class="warn-text">您长时间未登录，账号已被冻结。<br><span class="warn-freeze">请联系系统管理员进行解冻!</span></span>
    </span>
  </div>

</template>

<script>
import { verify, login } from '@/api/user'
import { encryptAes } from '@/utils/encrypt'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        userName: '',
        password: '',
        verifyCode: '',
        from: 'platform'
      },
      loginRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      redirect: undefined,
      verifyImg: undefined,
      passwordType: 'password',
      activate: false,
      logout: false,
      freeze: false
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
        // 执行登录接口
        const res = await login({ ...this.loginForm, password: encryptedPswd })
        // 存储本地token，同时存储vuex + cookie
        this.$store.dispatch('user/login', res).then(() => {
          const { redirect } = this.$route.query
          this.$router.push(redirect || 'home').catch(err => { console.log(err) })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } catch (err) {
        this.verifyGet()
        this.loading = false
        if (err.code === 1036) {
          const userName = err.data._id
          this.$router.push({ path: '/login/activate', query: { userName } })
        } else if (err.code === 1034) {
          this.logout = true
        } else if (err.code === 1035) {
          this.freeze = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-item_title {
  font-family: PingFangSC-Medium;
  font-size: 42px;
  color: #F0914B;
  letter-spacing: 1.91px;
  font-weight: 500;
}
.login-item_title-bi {
  font-family: PingFangSC-Medium;
  font-size: 44px;
  color: #F0914B;
  letter-spacing: 2px;
  font-weight: 500;
}
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
.button-style {
    position: relative;
    margin-top: 58px;
  }
  .button {
    background: #F0914B;
    width: 100%;
    height: 50px;
    color: #FFF;
    font-size: 18px;
    border:#f0914b;
    border-radius: 10px;
  }
  .button:hover {
    background: #f0914b;
    color: #fff;
    border:#f0914b
  }
  .button:focus {
    background: #f0914b;
    color: #fff;
    border:#f0914b
  }
.verifyImg {
  position: absolute;
  display: inline-block;
  width: 90.63px;
  height: 46px;
  left: 250px;
  top: -10px;
  ::v-deep svg {
    width: 100%;
    height: 100%;
  }
}
.refresh {
  cursor: pointer;
  position: absolute;
  display: inline-block;
  height: 30px;
  width: 30px;
  left: 230px;
}
.warn-freeze {
  padding-left: 1.5em;
}
</style>
