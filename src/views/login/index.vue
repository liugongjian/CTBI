<template>
  <div class="login">
    <div class="login-item_image">
      <img class="background" src="../../assets/Image/login-image/background.jpg" alt="">
      <img class="logo" src="../../assets/Image/login-image/logo.png" alt="">
    </div>
    <div class="login-item_input">
      <div v-if="isValid" class="form">
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
            <span class="refresh"><svg-icon icon-class="refresh" /></span>
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
      <div v-else class="form">
        <svg-icon icon-class="back" class="back" />
        <el-form
          ref="validForm"
          :model="validForm"
          label-position="left"
          :rules="validRules"
        >
          <div class="login-font">
            <span class="login-item_title">激活</span>
          </div>
          <el-form-item prop="userName">
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
      </div>
    </div>
  </div>
</template>

<script>
import { verify, login } from '@/api/user'
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
      isValid: true,
      passwordType: ''
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
      const { data } = await verify()
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
    setUp () {
      console.log('激活')
    },
    async handleLogin () {
      this.loading = true
      const { code, data } = await login(this.loginForm)
      if (code === 200) {
        this.$store.dispatch('user/login', data.token).then(() => {
          this.$router.push('/')
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
        console.log(data)
      } else if (code === 405) {
        this.isValid = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .back {
  width: 62px;
  height: 62px;
  margin-bottom: 10%;
}
.login {
  display: flex;
  height:100%;
}
.login-item_image {
  position: relative;
  width: 50%;
  height: 100%;
}
.background {
  width: 100%;
  height: 100%;
}
.logo {
  position: absolute;
  top: calc(50% - 53px);
  left: calc(50% - 105.7px);
  width: 211.4px;
  height: 106px;
}
.login-item_input {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-font {
  margin-bottom: 50px;
}
.login-item_title {
  height: 59px;
  width: 176px;
  color: #F0914B;
  font: 42px "PingFang SC";
}
.login-item_title-bi {
  height: 62px;
  width: 46px;
  color: #F0914B;
  font: 44px "PingFang SC"
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
.form {
  width: 330px;
}
::v-deep {
  .el-input {
    display: inline-block;
    width:273px;
  }
  .el-input__inner {
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-radius: 0;
    font-size: 1.3em;
    }
  .el-input__inner:focus {
    border-color: #f0914b
  }
  .el-input__inner::-webkit-input-placeholder {
    font-size: 14px;
  }
}
.title-size {
  width: 57px;
  height: 25px;
  font-family: "PingFang SC";
  font-size: 18px;
  color: #696969;
  }
.button-style {
  position: relative;
  margin-top: 58px;
}
.shadow {
  z-index: -1;
  position: absolute;
  top: 17px;
  left:26.4px;
  width: 277.2px;
  height: 33px;
  opacity: 0.5;
  background:#F0914B;
  box-shadow:0 9px 15px #F0914B;
  border-radius: 6px;
}
.verifyImg {
  position:absolute;
  display: inline-block;
  width: 90.63px;
  height: 25px;
  left: 250px;
  top: 5px
}

::v-deep .verifyImg {
  svg {
    width: 100%;
    height: 100%;
    }
}
.refresh {
  position:absolute;
  display: inline-block;
  height: 30px;
  width: 30px;
  left: 230px
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 6px;
  font-size: 16px;
  color: gray;
  cursor: pointer;
  user-select: none;
}
</style>
