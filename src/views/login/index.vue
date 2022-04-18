<template>
  <div class="login">
    <div class="login-item_image">
      <img class="background" src="../bi/Image/login-image/background.jpg" alt="">
      <img class="logo" src="../bi/Image/login-image/logo.png" alt="">
    </div>
    <div class="login-item_input">
      <div class="form">
        <el-form
          label-position="left"
          :rules="loginRules"
        >
          <div class="login-font">
            <span class="login-item_title">欢迎来到</span>
            <span class="login-item_title-bi">BI</span>
          </div>
          <el-form-item prop="username">
            <span class="title-size">用户名</span>
            <el-input
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="title-size">密&emsp;码</span>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item prop="verification">
            <span class="title-size">验证码</span>
            <el-input
              v-model="loginForm.verification"
              type="text"
              placeholder="请输入验证码"
            />
          </el-form-item>
        </el-form>
        <div class="button-style">
          <el-button class="button">
            登录
          </el-button>
          <div class="shadow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { login } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        verification: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verification: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style>
.login {
  display: flex;
}
.login-item_image {
  position: relative;
  width: 720px;
  height: 900px;
}
.background {
  width: 100%;
  height: 100%;
}
.logo {
  position: absolute;
  top: 397px;
  left: 254.29px;
  width: 211.42px;
  height: 106px;
}
.login-item_input {
  flex: 1;
  position: relative;
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
  position: absolute;
  width: 330px;
  top: 262.5px;
  left: 195px;
}
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
.title-size {
  width: 57px;
  height: 25px;
  font-family: "PingFang SC";
  font-size: 18px;
  color: #696969 100%;
  }
.el-input__inner::-webkit-input-placeholder {
  font-size: 14px;
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
</style>
