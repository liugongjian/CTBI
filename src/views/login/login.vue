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
          :maxlength="50"
          placeholder="请输入用户名"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="title-size">密&emsp;码</span>
        <el-input
          v-model="loginForm.password"
          show-password
          :maxlength="30"
          placeholder="请输入密码"
          @keyup.enter.native="validateLogin"
        />
      </el-form-item>
      <el-form-item prop="verifyCode">
        <span class="title-size">验证码</span>
        <el-input
          v-model="loginForm.verifyCode"
          type="text"
          :maxlength="10"
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
      activate: false,
      logout: false,
      freeze: false,
      options: [{
        value: 'zhinan',
        label: '指南',
        icon: 'el-icon-position',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致',
            icon: 'el-icon-position'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    }
  },
  mounted () {
    this.verifyGet()
  },
  methods: {
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
