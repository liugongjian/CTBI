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
    <div v-if="activate" class="activate">提交成功！</div>
    <div class="button-style">
      <el-button
        class="button"
        :plain="true"
        @click="setUp"
      >
        确认
      </el-button>
      <div class="shadow" />
    </div>
    <span class="warn">
      <svg-icon icon-class="warn" />
      <span class="warn-text">您尚未激活，请修改出场密码。</span>
    </span>
  </div>
</template>

<script>
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
      passwordType: 'password',
      activate: false
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
      this.loading = true
      this.activate = true
    }

  }
}
</script>

<style lang="scss" scoped>
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
.activate {
  position:absolute;
  top: 50%;
  left: 38%;
  background: #FFF;
  border: 1px solid #E6E6E6;
  width: 117px;
  height: 42px;
  text-align: center;
  box-shadow: 2px 4px 12px 0px rgba(0,0,0,0.09);
  border-radius: 2px;
  font: 500 16px/42px "PingFang SC";
  color: #333333;
  letter-spacing: 0.89px;
}
</style>
