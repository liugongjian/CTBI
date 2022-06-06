<template>
  <el-dialog
    title="公开链接分享"
    :visible.sync="shareDashboardVisible"
    width="560px"
  >
    <div
      v-if="!currentShareInfo || !currentShareInfo.shareUrl"
      class="shareEmpty"
    >
      <img
        style="width: 371px; height: 200px"
        :src="require('../../../assets/Image/dashboard/shareEmpty.png')"
      >
      <p>开启后，所有获得分享链接的人都可以查看内容</p>
      <el-button
        style="margin-top: 14px;"
        type="primary"
        @click="() => executeShare()"
      >公开分享</el-button>
    </div>
    <div
      v-else
      class="shareWrap"
    >
      <div>
        <span class="shareTip">所有用户可以通过一下链接查看报表备份</span>
        <el-button
          style="color:#FA8334; border-color: #FA8334;font-size:12px; margin-left: 14px;height: 32px;"
          @click="cancelShareDashboard"
        >不再公开</el-button>
      </div>
      <div class="shareCopy">
        <div class="shareCopyUrl">{{ currentShareInfo.shareUrl }}</div>
        <el-button
          type="primary"
          style="font-size:12px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;margin-left: -3px;z-index: 99;"
          @click="copyShareUrl"
        >复制</el-button>
      </div>
      <div class="shareDate">
        <el-form
          :model="currentShareInfo"
          style="padding: 0px"
        >
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="currentShareInfo.shareEndTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              @change="shareDateChange"
            />
          </el-form-item>
        </el-form>
      </div>
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
  name: 'FolderEdit',
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
      currentShareInfo: null,
      currentData: this.data,
      shareDashboardVisible: false
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
        this.$message.success(result)
        this.currentData = null
        this.currentShareInfo = null
        this.shareDashboardVisible = false
      } catch (error) {
        console.log(error)
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
  .shareCopy {
    margin-top: 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .shareCopyUrl {
      width: 480px;
      height: 32px;
      padding: 0px 10px;
      background: #f4f6f8;
      box-sizing: border-box;
      border: 1px solid rgba(223, 225, 229, 1);
      border-radius: 2.5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #666a77;
      line-height: 30px;
    }
  }
  .shareDate {
    margin-top: 24px;
  }
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
</style>
