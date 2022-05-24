<template>
  <div class="bi-header-container">
    <div class="nameWrap">
      <img
        style="width: 18px; height: 17px"
        :src="require('../../../assets/Image/dashboard/name.png')"
      >
      <el-input
        v-devicel="name"
        placeholder="请输入仪表板名称"
        class="nameInput"
      />
    </div>
    <div class="device">
      <div class="pc" :class="{'choosed-pc': device === 'pc'}" @click="() => changeDevice('pc')">
        <img
          style="width: 18px; height: 17px"
          :src="require('../../../assets/Image/dashboard/pc.png')"
        >
      </div>
      <div class="mobile" :class="{'choosed-mobile': device === 'mobile'}" @click="() => changeDevice('mobile')">
        <img
          style="width: 18px; height: 17px"
          :src="require('../../../assets/Image/dashboard/mobile.png')"
        >
      </div>
    </div>
    <div class="operation">
      <div class="divider" />
      <button
        class="bi-header-btn default"
        @click="changeMode"
      >{{ mode === 'edit' ?'预览' : '编辑' }}</button>
      <button
        class="bi-header-btn default"
        @click="save"
      >保存</button>
      <button
        class="bi-header-btn default"
        @click="saveAndShare"
      >保存并发布</button>
      <div v-if="false" class="more">
        <img
          style="width: 4px; height: 14px"
          :src="require('../../../assets/Image/dashboard/more.png')"
        >
      </div>
      <el-dropdown
        class="data-more"
      >
        <span><img
          style="width: 4px; height: 14px"
          :src="require('../../../assets/Image/dashboard/more.png')"
        ></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="moveTo()">另存为</el-dropdown-item>
          <el-dropdown-item
            @click.native="cancelPublish()"
          >下线</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      name: '未命名',
      device: 'pc',
      mode: 'edit'
    }
  },
  methods: {
    // 切换模式
    changeDevice (device) {
      this.device = device
    },
    changeMode() {
      this.mode = this.mode === 'edit' ? 'preview' : 'edit'
    },
    save () {
    },
    saveAndShare () {
    }
  }
}
</script>
<style lang="scss" scoped>
.nameWrap{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .nameInput{
    width: 200px;
  }
}
::v-deep .el-input__inner{
  background: #2D303B;
  border: 0;
  color: #fff;
}
.device {
  width: 120px;
  height: 30px;
  background: rgba(253,185,100, 0.2);
  border-radius: 16px;
  display: flex;
  overflow: hidden;
  .pc{
    width: 54px;
    height: 30px;
    position: relative;
    cursor: pointer;
    img{
      position: absolute;
      top: 6px;
      left: 24px;
    }
  }
  .mobile{
    width: 54px;
    height: 30px;
    position: relative;
    cursor: pointer;
    img{
      position: absolute;
      top: 6px;
      right: 24px;
    }
  }
  .choosed-pc{
    width: 66px;
    background: #FA8334;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  .choosed-mobile{
    width: 66px;
    background: #FA8334;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
}
.operation {
  display: flex;
  align-items: center;
  .divider{
    width: 1px;
    height: 20px;
    background: #717276;
  }
  .data-more {
    margin-left: 30px;
    margin-top: 4px;
    & > span {
      color: #fa8334;
      text-align: left;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
