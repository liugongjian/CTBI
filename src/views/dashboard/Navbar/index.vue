<template>
  <div class="bi-header-out">
    <div class="bi-header-container">
      <div class="nameWrap">
        <div class="back" @click="back"><i class="el-icon-arrow-left" /></div>
        <img
          style="width: 18px; height: 17px; margin-left:16px;"
          :src="require('../../../assets/Image/dashboard/name.png')"
        >
        <el-input
          v-model="name"
          :placeholder="operation === 'editTemplate' ? '请输入模板名称' : '请输入仪表板名称'"
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
          v-if="operation !== 'editTemplate'"
          class="bi-header-btn default"
          @click="save"
        >保存</button>
        <button
          v-if="operation !== 'editTemplate'"
          class="bi-header-btn default primary"
          @click="saveAndShare"
        >保存并发布</button>
        <button
          v-if="operation === 'editTemplate'"
          class="bi-header-btn default"
          @click="saveTemplate"
        >保存模板</button>
        <div v-if="false" class="more">
          <img
            style="width: 4px; height: 14px"
            :src="require('../../../assets/Image/dashboard/more.png')"
          >
        </div>
        <el-dropdown
          v-if="operation !== 'editTemplate'"
          class="data-more"
        >
          <span><img
            style="width: 4px; height: 14px"
            :src="require('../../../assets/Image/dashboard/more.png')"
          ></span>
          <el-dropdown-menu slot="dropdown" class="more-dropdown">
            <el-dropdown-item icon="el-icon-document-copy" @click.native="copy()">另存为仪表盘</el-dropdown-item>
            <el-dropdown-item v-if="role === 'superUser'|| role === 'admin'" icon="el-icon-document-copy" @click.native="saveAsTemplate()">另存为模板</el-dropdown-item>
            <el-dropdown-item
              v-if="dashboard.publishStatus === 1"
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
              prop="folderId"
              style="margin-top: 30px"
            >
              <el-select v-model="dashboardAttr.folderId" placeholder="请选择" style="width: 360px">
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
    <SaveAsDialog ref="saveAsDialog" :template-visible.sync="templateVisible" @handleSubmit="handleSubmit" />
    <ShareDialog ref="shareDialog" from="edit" :data="dashboard" @handleAction="handleShareChange" />
  </div>
</template>

<script>
import { getFolderTree, saveDashboard, cancelShareDashboard } from '@/api/dashboard'
import { addTemplate, updateTemplateContent } from '@/api/template'
import ShareDialog from '../ShareDialog'
import SaveAsDialog from './SavaAsDialog'
import domToImage from 'dom-to-image-more'
import { findComponentUpward } from '@/utils/findComponentUpward'
import store from '@/store'
export default {
  name: 'Dashboard',
  components: {
    ShareDialog,
    SaveAsDialog
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dashboard: Object,
    // eslint-disable-next-line vue/require-default-prop
    mode: String,
    // eslint-disable-next-line vue/require-default-prop
    handleChange: Function
  },
  data() {
    const validateName = (rule, value, callback) => {
      const name = value.trim()
      if (name === '') {
        callback(new Error('请输入仪表板名称'))
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
        folderId: ''
      },
      attrRules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ]
      },
      folderTree: [],
      originFolder: [],
      saveMode: 'save',
      templateVisible: false,
      thumbnail: '',
      operation: this.$route.query.operation || 'normal'
    }
  },
  computed: {
    role() {
      return this.$store.state.user.userData.role
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
    saveAsTemplate() {
      this.templateVisible = true
    },
    async handleSubmit(form, cb) {
      try {
        // 获取缩略图base64
        const dashboardCom = findComponentUpward(this, 'DashBoard')
        this.thumbnail = await domToImage.toPng(dashboardCom.$refs.mainLayout.$el)
        // 判断报表使用的是否全为公有数据集
        const layout = store.state.app.layout
        let flag = null
        if (layout.length > 0) {
          flag = layout.every(item => {
            const curDataSet = item.option.dataSet
            if (curDataSet) {
              const mold = curDataSet.mold ?? 2
              if (mold === 2) {
                return true
              } else {
                return false
              }
            } else {
              return true
            }
          })
        } else {
          this.$message.warning('模板不能为空')
          return
        }

        if (!flag) {
          this.$message.warning('模板中不能存在私有数据集')
          return
        }
        const data = {
          layout,
          layoutStyles: store.state.settings.layoutStyles
        }
        const params = {
          ...form,
          thumbnail: this.thumbnail,
          setting: JSON.stringify(data)
        }
        await addTemplate(params)
        this.$message.success('另存为模板成功')
        cb()
      } catch (error) {
        console.log(error)
      } finally {
        this.$refs.saveAsDialog.loading = false
      }
    },
    // 切换模式
    changeDevice (device) {
      this.device = device
    },
    changeMode() {
      // this.mode = this.mode === 'edit' ? 'preview' : 'edit'
      this.$emit('handleChange', {
        action: 'changeMode',
        data: this.mode === 'edit' ? 'preview' : 'edit'
      })
    },
    save () {
      this.saveMode = 'save'
      if (this.dashboard._id) {
        const tip = this.testNameValid()
        if (tip) {
          this.$message.warning(tip)
        } else {
          this.saveDashboard({ name: this.name })
        }
      } else {
        this.showDashboardAttribute()
      }
    },
    saveAndShare () {
      this.saveMode = 'saveAndShare'
      if (this.dashboard._id) {
        const tip = this.testNameValid()
        if (tip) {
          this.$message.warning(tip)
        } else {
          this.saveDashboard({ name: this.name })
        }
      } else {
        this.showDashboardAttribute()
      }
    },
    testNameValid() {
      const name = this.name.trim()
      if (name === '') {
        return this.operation === 'editTemplate' ? '请输入模板名称' : '请输入仪表板名称'
      } else {
        const reg = /^[\u4e00-\u9fa5\w|\[\]\(\)\/\\]{1,50}$/
        if (!reg.test(name)) {
          const dName = this.operation === 'editTemplate' ? '模板' : '仪表板'
          return dName + '名称错误，支持中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号, 长度不超过50'
        }
      }
      return ''
    },
    async showDashboardAttribute () {
      await this.getFolders()
      this.dashboardAttributeVisible = true
      this.dashboardAttr.name = this.saveMode === 'copy' ? '' : this.name
      this.dashboardAttr.folderId = this.saveMode === 'copy' ? '-1' : (this.dashboard.directoryId || '-1')
    },
    copy() {
      this.saveMode = 'copy'
      this.showDashboardAttribute()
    },
    async cancelPublish() {
      try {
        const result = await cancelShareDashboard(this.dashboard._id)
        this.handleShareChange({ publishStatus: -1 })
        this.$message.success(result)
      } catch (error) {
        console.log(error)
      }
    },
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
          // this.hiddenDashboardAttribute()
          this.saveDashboard()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存仪表板
    async saveDashboard (obj) {
      const isCopy = this.saveMode === 'copy'
      const id = isCopy ? null : (this.dashboard._id || null)
      const finalId = isCopy ? null : id
      const data = {
        layout: store.state.app.layout,
        layoutStyles: store.state.settings.layoutStyles
      }
      const params = {
        id: finalId,
        setting: JSON.stringify(data),
        isPublish: this.saveMode === 'saveAndShare',
        ...(obj || this.dashboardAttr)
      }
      const result = await saveDashboard(params)
      this.$message.success(isCopy ? '另存为成功' : '保存成功')
      console.log(result)
      if (!id) {
        this.hiddenDashboardAttribute()
      }
      if (!isCopy) {
        this.$emit('handleChange', {
          action: 'saveSuccess',
          data: result
        })
      }
      if (this.saveMode === 'saveAndShare' && !this.dashboard.shareUrl) {
        this.$refs['shareDialog'].showShare(result)
      }
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
    },
    async shareDashboard (data) {
      this.$refs['shareDialog'].showShare(data)
    },
    handleShareChange(data) {
      console.log(this.dashboard)
      console.log(data)
      this.$emit('handleChange', {
        action: 'changeShare',
        data
      })
    },
    back() {
      this.$emit('handleChange', {
        action: 'back'
      })
    },
    async saveTemplate() {
      console.log(this.dashboard)
      const tip = this.testNameValid()
      if (tip) {
        this.$message.warning(tip)
      } else {
        try {
        // 获取缩略图base64
          const dashboardCom = findComponentUpward(this, 'DashBoard')
          this.thumbnail = await domToImage.toPng(dashboardCom.$refs.mainLayout.$el)
          // 判断报表使用的是否全为公有数据集
          const layout = store.state.app.layout
          let flag = null
          if (layout.length > 0) {
            flag = layout.every(item => {
              const curDataSet = item.option.dataSet
              if (curDataSet) {
                const mold = curDataSet.mold ?? 2
                if (mold === 2) {
                  return true
                } else {
                  return false
                }
              } else {
                return true
              }
            })
          } else {
            this.$message.warning('模板不能为空')
            return
          }

          if (!flag) {
            this.$message.warning('模板中不能存在私有数据集')
            return
          }
          const data = {
            layout,
            layoutStyles: store.state.settings.layoutStyles
          }
          const params = {
            id: this.dashboard._id,
            name: this.name.trim(),
            thumbnail: this.thumbnail,
            setting: JSON.stringify(data)
          }
          await updateTemplateContent(params)
          this.$message.success('保存模板成功')
          this.$emit('handleChange', {
            action: 'saveSuccess',
            data: this.dashboard
          })
        } catch (error) {
          console.log(error)
        }
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
  .back{
    width: 48px;
    height: 50px;
    background: #020202;
    margin-left: -20px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nameInput{
    width: 200px;
  }
  ::v-deep .el-input__inner{
    background-color: #2D303B;
    border: 0;
    color: #fff;
  }
}
::v-deep .el-dialog__footer {
  padding: 0px;
}
.dialog-footer{
  padding-top: 10px;
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
  height: 50px;
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
