<template>
  <div class="bi-header-out">
    <div class="bi-header-container">
      <div class="nameWrap">
        <img
          style="width: 18px; height: 17px"
          :src="require('../../../assets/Image/dashboard/name.png')"
        >
        <el-input
          v-model="name"
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
          class="bi-header-btn default primary"
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
          <el-dropdown-menu slot="dropdown" class="more-dropdown">
            <el-dropdown-item icon="el-icon-document-copy" @click.native="copy()">另存为</el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-bottom-right"
              @click.native="cancelPublish()"
            >下线</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div>
      <el-dialog
        :title="saveMode === 'copy' ? '另存为仪表盘': '保存仪表盘'"
        :visible.sync="dashboardAttributeVisible"
        width="480px"
        @close="hiddenDashboardAttribute"
      >
        <div class="data-set-didlog-main">
          <el-form
            ref="attrForm"
            style="padding: 0px"
            :model="dashboardAttr"
            :rules="attrRules"
            label-width="40px"
          >
            <el-form-item
              label="名称"
              prop="name"
            >
              <el-input
                v-model="dashboardAttr.name"
                placeholder="请输入仪表板名称"
                style="width: 360px"
              />
            </el-form-item>
            <el-form-item
              label="位置"
              prop="directoryId"
              style="margin-top: 30px"
            >
              <el-select v-model="dashboardAttr.directoryId" placeholder="请选择" style="width: 360px">
                <el-option
                  v-for="item in folderTree"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span>
                    <svg-icon
                      icon-class="folder"
                      style="margin-right: 8px"
                      :style="{marginLeft: item.id === '-1' ? '5px' : '15px'}"
                    />
                  </span>
                  <span>{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="hiddenDashboardAttribute">取 消</el-button>
          <el-button
            type="primary"
            @click="handleDashboardAttribute"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getFolderTree } from '@/api/dashboard'
export default {
  name: 'Dashboard',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dashboard: Object,
    // eslint-disable-next-line vue/require-default-prop
    mode: String
  },
  data() {
    const validateName = (rule, value, callback) => {
      const name = value.trim()
      if (name === '') {
        callback(new Error('请输入文件夹名称'))
      } else {
        const reg = /^[\u4e00-\u9fa5\w|\[\]\(\)\/\\]{1,50}$/
        if (!reg.test(name)) {
          callback(new Error('支持中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号, 长度不超过50'))
        } else {
          callback()
        }
      }
    }
    return {
      name: '未命名',
      device: 'pc',
      dashboardAttributeVisible: false,
      dashboardAttr: {
        name: '',
        directoryId: ''
      },
      attrRules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ]
      },
      folderTree: [],
      originFolder: [],
      saveMode: 'save'
    }
  },
  watch: {
    dashboard: {
      handler (newVal) {
        console.log(newVal)
        this.name = newVal.name
      }
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
      this.saveMode = 'save'
      this.showDashboardAttribute()
    },
    saveAndShare () {
      this.saveMode = 'saveAndShare'
      this.showDashboardAttribute()
    },
    async showDashboardAttribute () {
      await this.getFolders()
      this.dashboardAttributeVisible = true
      this.dashboardAttr.name = this.saveMode === 'copy' ? '' : this.name
      this.dashboardAttr.directoryId = this.saveMode === 'copy' ? '-1' : (this.dashboard.directoryId || '-1')
    },
    copy() {
      this.saveMode = 'copy'
      this.showDashboardAttribute()
    },
    cancelPublish() {},
    resetForm () {
      this.$refs['attrForm'].resetFields()
    },
    hiddenDashboardAttribute () {
      this.dashboardAttributeVisible = false
      this.resetForm()
    },
    handleDashboardAttribute() {
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {
          this.hiddenDashboardAttribute()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getFolders() {
      try {
        const data = await getFolderTree()
        const result = data.result
        result.unshift({
          id: '-1',
          name: '根目录'
        })
        this.folderTree = result
        console.log(this.folderTree)
        this.originFolder = result
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bi-header-out{
  width: 100%;
}
.nameWrap{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .nameInput{
    width: 200px;
  }
  ::v-deep .el-input__inner{
    background-color: #2D303B;
    border: 0;
    color: #fff;
  }
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
.more-dropdown{
  border-color: #323541;
  background: #323541;
  color: #F8F8F8;
  top: 40px !important;
}
.more-dropdown li{
  background: #323541;
  color: #F8F8F8;
  &:hover{
    color: #fff;
    background: #2D303B;
  }
}
.el-popper ::v-deep .popper__arrow{
    border-bottom-color: #323541 !important;
    visibility: hidden;
  }
</style>
