<template>
  <el-dialog
    title="发布"
    :visible.sync="shareDashboardVisible"
    width="560px"
  >
    <el-form
      ref="shareForm"
      :model="currentShareInfo"
      style="padding: 0px"
      :rules="shareRules"
      label-width="70px"
    >
      <el-form-item label="有效期" prop="shareEndTime">
        <el-date-picker
          v-model="currentShareInfo.shareEndTime"
          type="date"
          placeholder="选择日期"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="shareDateChange"
        />
      </el-form-item>
      <el-form-item label="密码" prop="sharePassword">
        <el-input v-model="currentShareInfo.sharePassword" class="input" placeholder="请输入分享密码" />
        <el-button class="random" type="text" @click="randomPwd">随机生成</el-button>
      </el-form-item>
      <el-form-item label="白名单" prop="whiteList">
        <el-input
          v-model="currentShareInfo.whiteList"
          class="input"
          type="textarea"
          :rows="2"
          placeholder="多个地址以英文逗号分隔"
        />
      </el-form-item>
    </el-form>
    <p class="shareCopyUrl">{{ currentShareInfo.shareUrl }}</p>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="shareDashboardVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="executeShare"
      >确 定</el-button>
      <el-button
        type="primary"
        @click="executeShare"
      >再次发布</el-button>
      <el-button
        type="primary"
        @click="copyShareUrl"
      >一键复制</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getShareInfo,
  shareDashboard,
  cancelShareDashboard
} from '@/api/dashboard'
import moment from 'moment'

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
        shareEndTime: '',
        sharePassword: '',
        whiteList: ''
      },
      currentData: this.data,
      shareDashboardVisible: false,
      shareRules: {
        shareEndTime: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ],
        sharePassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }
  },
  computed: {},
  watch: {
    data: {
      handler (newVal) {
        console.log(newVal)
        this.currentData = newVal
      }
    }
  },
  created () { },
  mounted () {
    console.log(this.data)
  },
  methods: {
    async shareDashboard (data) {
      try {
        this.currentData = data
        if (this.from === 'edit') {
          this.executeShare()
        } else {
          if (data.publishStatus === 1) {
            const info = await getShareInfo(data._id)
            this.currentShareInfo = info
          } else {
            this.currentShareInfo = null
          }

          this.shareDashboardVisible = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    async executeShare (endDate) {
      try {
        const shareEndTime = endDate || moment().add(1, 'days').format('YYYY-MM-DD')
        const params = {
          _id: this.currentData._id,
          sharePassword: 'hfdsahhfd7wk,hjSD',
          shareEndTime,
          whiteList: []
        }
        const info = await shareDashboard(params)
        this.currentShareInfo = { ...info, shareEndTime }
        this.shareDashboardVisible = true
        this.$emit('handleAction', { id: this.currentData._id, publishStatus: 1 })
      } catch (error) {
        console.log(error)
      }
    },
    copyShareUrl () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.currentShareInfo.shareUrl)
        this.$message.success('复制成功')
      } else {
        const textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        textarea.value = this.currentShareInfo.shareUrl
        textarea.select()
        document.execCommand('copy', true)
        this.$message.success('复制成功')
        document.body.removeChild(textarea)
      }
    },
    shareDateChange (e) {
      this.executeShare(moment(e).format('YYYY-MM-DD'))
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
    randomPwd() {
      this.currentShareInfo = {
        ...this.currentShareInfo,
        sharePassword: 'sfdsfdsafdsa'
      }
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
.input{
  width: 360px;
}
.random{
  margin-left: 14px;
}
.shareCopyUrl {
  margin-top: 24px;
  margin-left: 70px;
  width: 360px;
  height: 54px;
  padding: 0px 10px;
  background: #f4f6f8;
  box-sizing: border-box;
  border: 1px solid rgba(223, 225, 229, 1);
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0,0,0,0.65);
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
.dialog-footer {
  padding-top: 10px;
  margin-right: 20px;
}
</style>
