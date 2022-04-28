<template>
  <div class="login">
    <div class="login-item_image">
      <img class="background" :src="background" alt="">
      <img class="logo" :src="logo" alt="">
    </div>
    <div class="login-item_input">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      background: require('@/assets/Image/login-image/background.jpg'),
      logo: require('@/assets/Image/login-image/logo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
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

::v-deep{
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
    height: 46px;
    left: 250px;
    top: -10px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 6px;
    font-size: 16px;
    color: #6A6A6A;
    cursor: pointer;
    user-select: none;
  }
  .warn {
    display: inline-block;
    margin-top: 10%;
  }
  .warn-text {
    margin-left: 5px;
    font: 14px "PingFang SC";
    color: #EB371F;
  }
}
</style>
