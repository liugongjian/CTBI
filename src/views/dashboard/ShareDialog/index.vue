<template>
  <el-dialog
    title="发布"
    :visible.sync="shareDashboardVisible"
    :close-on-click-modal="false"
    width="560px"
    @close="close"
  >
    <el-form
      ref="shareForm"
      :model="currentShareInfo"
      style="padding: 0px"
      :rules="shareRules"
      label-width="70px"
    >
      <el-form-item
        label="有效期"
        prop="shareEndTime"
      >
        <el-date-picker
          v-model="currentShareInfo.shareEndTime"
          type="date"
          placeholder="选择日期"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="shareDateChange"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="sharePassword"
      >
        <el-input
          v-model="currentShareInfo.sharePassword"
          class="input"
          placeholder="请输入分享密码"
          @input="shareChange"
        />
        <el-button
          class="random"
          type="text"
          @click="randomPwd"
        >随机生成</el-button>
      </el-form-item>
      <!-- <el-form-item
        label="白名单"
        prop="whiteList"
      >
        <el-input
          v-model="currentShareInfo.whiteList"
          class="input"
          type="textarea"
          :rows="2"
          placeholder="多个IP地址以英文逗号分隔"
          @input="shareChange"
        />
      </el-form-item> -->
      <el-form-item v-if="currentData.shareUrl">
        <div class="d-f">
          <p class="shareCopyUrl">{{ currentData.shareUrl }}</p>
          <el-button
            class="random"
            type="text"
            @click="copyUrl"
          >复制地址</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button v-if="!currentData.shareUrl" @click="close">取 消</el-button>
      <el-button v-else @click="close">关 闭</el-button>
      <el-button
        v-if="currentData.shareUrl"
        type="primary"
        @click="executeShare"
      >重新发布</el-button>
      <el-button
        v-if="!needShareAgain && !currentData.shareUrl"
        type="primary"
        @click="executeShare"
      >确定</el-button>
      <el-button
        v-if="currentData.shareUrl"
        type="primary"
        @click="copyShareUrl"
      >一键复制</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  shareDashboard,
  cancelShareDashboard
} from '@/api/dashboard'
import { encryptAesForShare, decryptAesForShare } from '@/utils/encrypt'
import moment from 'moment'
function randomPassword (size = 10) {
  const lower = 'abcdefghijkmlnopqrstwvxyz'
  const upper = lower.toUpperCase()
  const str = upper + lower
  const num = '0123456789'
  const special = '#$,@'
  const strArray = (str + num + special).split('')
  const length = strArray.length
  const result = []
  for (let i = 0; i < size; i++) {
    if (i === 0) {
      result.push(strArray[Math.round(Math.random() * str.length)])
    } else {
      result.push(strArray[Math.round(Math.random() * length)])
    }
  }
  return result.join('')
}

function reassembleData (data) {
  const result = data ? { ...data } : {}
  result.sharePassword = result.sharePassword ? decryptAesForShare(result.sharePassword) : ''
  return result
}

export default {
  name: 'ShareDialog',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    data: Object,
    // eslint-disable-next-line vue/require-default-prop
    handleAction: Function,
    // eslint-disable-next-line vue/require-default-prop
    from: String
  },
  data () {
    return {
      currentShareInfo: {
        shareEndTime: moment().add(1, 'days').format('YYYY-MM-DD'),
        sharePassword: '',
        whiteList: ''
      },
      oldShareInfo: {},
      needShareAgain: false,
      currentData: reassembleData(this.data),
      shareDashboardVisible: false,
      shareRules: {
        shareEndTime: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  computed: {},
  watch: {
    data: {
      handler (newVal) {
        console.log(newVal)
        this.currentData = reassembleData(newVal)
      }
    }
  },
  created () { },
  mounted () {
    console.log(this.data)
  },
  methods: {
    showShare (data) {
      console.log(data)
      this.shareDashboardVisible = true
      data = reassembleData(data)
      this.currentData = data
      this.currentShareInfo = {
        shareEndTime: data.shareEndTime ? data.shareEndTime : moment().add(7, 'days').format('YYYY-MM-DD'),
        sharePassword: data.sharePassword || '',
        whiteList: data.whiteList ? data.whiteList.join(',') : ''
      }
      this.oldShareInfo = { ...this.currentShareInfo }
      this.needShareAgain = false
    },
    async executeShare () {
      this.$refs['shareForm'].validate((valid) => {
        if (valid) {
          this.executeSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async executeSubmit () {
      try {
        const { shareEndTime, sharePassword, whiteList } = this.currentShareInfo
        const ipPattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        // IP校验
        const ips = whiteList ? whiteList.trim().split(',') : []
        let finalIps = ips
        if (ips.length > 0) {
          finalIps = ips.map(item => item.trim()).filter(item => !!item)
          if (finalIps.length > 0 && !finalIps.every(ip => ipPattern.test(ip))) {
            this.$message.error('白名单IP地址格式有错误，请更改')
            return
          }
        }
        const password = sharePassword && sharePassword.trim() ? encryptAesForShare(sharePassword.trim()) : ''
        const params = {
          _id: this.currentData._id,
          shareEndTime,
          sharePassword: password,
          whiteList: finalIps,
          currentUrl: location.origin + location.pathname.split('/dashboard')[0] + '/dashboard/publish'
        }
        const info = await shareDashboard(params)
        this.$message.success('发布成功')
        this.currentData = { ...this.currentData, ...info }
        this.needShareAgain = false
        this.oldShareInfo = { ...this.currentShareInfo }
        this.$emit('handleAction', {
          id: this.currentData._id, publishStatus: 1, ...info, shareEndTime,
          sharePassword,
          whiteList: whiteList ? whiteList.split(',') : []
        })
      } catch (error) {
        console.log(error)
      }
    },
    copyShareUrl () {
      const shareContent = this.currentShareInfo.sharePassword ? '分享链接：' + this.currentData.shareUrl + '\t\n' + '密码：' + this.currentShareInfo.sharePassword + '\t\n' + '有效期至：' + this.currentShareInfo.shareEndTime : '分享链接：' + this.currentData.shareUrl + '\t\n' + '有效期至：' + this.currentShareInfo.shareEndTime
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareContent)
        this.$message.success('复制成功')
      } else {
        const textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        textarea.value = shareContent
        textarea.select()
        document.execCommand('copy', true)
        this.$message.success('复制成功')
        document.body.removeChild(textarea)
      }
    },
    copyUrl () {
      const shareContent = this.currentData.shareUrl
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareContent)
        this.$message.success('地址复制成功')
      } else {
        const textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        textarea.value = shareContent
        textarea.select()
        document.execCommand('copy', true)
        this.$message.success('地址复制成功')
        document.body.removeChild(textarea)
      }
    },
    shareDateChange (e) {
      this.currentShareInfo.shareEndTime = moment(e).format('YYYY-MM-DD')
      this.testInfo()
    },
    async cancelShareDashboard () {
      try {
        const result = await cancelShareDashboard(this.currentData._id)
        this.$emit('handleAction', { id: this.currentData._id, publishStatus: -1 })
        this.$message.success(result)
        this.currentData = null
        this.currentShareInfo = null
        this.shareDashboardVisible = false
      } catch (error) {
        console.log(error)
      }
    },
    randomPwd () {
      this.currentShareInfo = {
        ...this.currentShareInfo,
        sharePassword: randomPassword()
      }
      this.testInfo()
    },
    close () {
      this.resetForm()
      this.shareDashboardVisible = false
    },
    resetForm () {
      this.$refs['shareForm'].resetFields()
    },
    shareChange () {
      this.testInfo()
    },
    testInfo () {
      if (!this.currentData.shareUrl) {
        return
      }
      const items = ['shareEndTime', 'sharePassword', 'whiteList']
      const isChange = items.some(item => this.oldShareInfo[item] !== this.currentShareInfo[item])
      this.needShareAgain = isChange
    }

  }
}
</script>
<style lang="scss" scoped>
.shareWrap {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  line-height: 20px;
  .shareDate {
    margin-top: 24px;
  }
}
.input {
  width: 360px;
}
.random {
  margin-left: 14px;
}
.shareCopyUrl {
  width: 360px;
  height: 54px;
  padding: 0px 10px;
  background: #f4f6f8;
  box-sizing: border-box;
  border: 1px solid rgba(223, 225, 229, 1);
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 20px;
  font-weight: 400;
  border-radius: 2.5px;
}
.shareEmpty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
}
.dialog-footer-new {
  padding-top: 10px;
  margin-right: 20px;
}
::v-deep .el-dialog__footer {
  padding: 0px;
}
.dialog-footer {
  padding-top: 10px;
}
</style>
