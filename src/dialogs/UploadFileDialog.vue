<template>
  <el-dialog
    class="upload-file-dialog"
    title="上传文件"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  >
    <div slot="footer">
      <el-button
        size="small"
        @click="dialogVisible = false"
      >取 消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        size="small"
        @click="handleConfirm"
      >确 定</el-button>
    </div>
    <div class="title">
      <div class="block" />
      <span class="text">基础配置</span>
    </div>
    <el-form
      ref="form"
      :rules="rules"
      size="small"
      class="form"
      :model="form"
      label-width="110px"
      @submit.native.prevent
    >
      <el-form-item
        prop="file"
        label="请选择文件"
      >
        <el-upload
          :auto-upload="false"
          action=""
          accept=".csv,.xlsx,.xls"
          :on-remove="handleRemove"
          :on-change="handleUploadChange"
          :before-upload="beforeUpload"
          :file-list="fileList"
        >
          <el-button class="upload-btn">
            <svg-icon
              icon-class="upload"
              style="margin-right: 9px;"
            />{{ form.file ? '重新上传' : '添加文件' }}
          </el-button>
          <ExportFileTemplate />
          <div
            slot="tip"
            class="el-upload__tip"
          >文件只支持csv、xlsx、xls格式且行数不能大于10000，列数不能大于50</div>
        </el-upload>
      </el-form-item>
      <el-form-item
        prop="displayName"
        label="自定义文件名称"
      >
        <el-input v-model="form.displayName" />
      </el-form-item>
      <el-form-item label="">
        <div class="tip">名称只能由中英文、数字及下划线(_)、斜线(/)、反斜线(\)、竖线(|)、小括号(())、中括号([])组成，不超过50个字符。</div>
        <div class="attention">注意：您使用的是excel上传，将默认使用第一个sheet</div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { uploadDataFile, isDataFileExists } from '@/api/dataSource'
import ExportFileTemplate from '../views/dataManage/ExportFileTemplate'
import XLSX from 'xlsx'

export default {
  name: 'UploadFileDialog',
  components: {
    ExportFileTemplate
  },
  mixins: [dialogMixin],
  data () {
    const validateUpload = (rule, value, callback) => {
      if (this.flag) {
        callback()
      } else {
        callback(new Error('请上传文件'))
      }
    }
    return {
      loading: false,
      flag: false,
      fileList: [],
      form: {
        displayName: null,
        file: null
      },
      rules: Object.freeze({
        displayName: [
          { required: true, message: '请输入自定义文件名称' },
          { pattern: /^[\u4e00-\u9fa5A-Za-z0-9_\\\/\|\(\)\[\]]+$/, message: '自定义文件名称只能由中英文、数字及下划线(_)、斜线(/)、反斜线(\)、竖线(|)、小括号(())、中括号([])组成' },
          { max: 50, message: '自定义文件名称长度不超过50个字符' },
          { validator: this.validateDisplayName, trigger: 'blur' }
        ],
        file: [
          { required: true, validator: validateUpload, trigger: 'change' }
        ]
      })
    }
  },
  methods: {
    async validateDisplayName (rule, value, callback) {
      try {
        const isExist = await isDataFileExists({ displayName: value })
        if (isExist) {
          callback('文件名称已存在！')
        } else {
          callback()
        }
      } catch (error) {
        console.log(error)
        callback()
      }
    },
    async beforeUpload (file) {
      if (file.raw.type !== 'text/csv' && file.raw.type !== 'application/vnd.ms-excel' && file.raw.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.warning('文件只支持csv、xlsx、xls格式！请重新上传')
        return false
      }
      return await this.readExcel(file.raw)
    },
    readExcel (file) {
      return new Promise((resolve) => {
        const fileReader = new FileReader()
        try {
          fileReader.readAsBinaryString(file)
        } catch (error) {
          console.log(error)
        }
        fileReader.onload = (event) => {
          try {
            const data = event.target.result
            const workbook = XLSX.read(data, { type: 'binary', codepage: 936 })
            const fileExcelData = this.excelToJson(workbook)
            const [header = []] = fileExcelData
            if (fileExcelData.length > 10000) {
              resolve(false)
              this.$message.warning('文件行数大于10000!请重新上传')
            } else if (header.length > 200) {
              resolve(false)
              this.$message.warning('文件列数大于200!请重新上传')
            } else {
              resolve(true)
            }
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    excelToJson (workbook) {
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: 'NULL' })
      return data
    },
    async handleUploadChange (file, fileList) {
      if (!await this.beforeUpload(file)) {
        this.fileList = []
        return
      }
      const { status, name } = file
      if (status === 'fail') {
        this.fileList = []
        this.handleUploadErr(name, file)
        return
      }
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.form.file = file.raw
      this.flag = true
      this.$refs.form.clearValidate('file')
    },
    handleUploadErr () {
      this.$message.warning('文件上传失败!请重新上传')
    },
    handleRemove () {
      this.form.file = null
      this.flag = false
      this.$refs.form.validateField('file')
    },
    handleConfirm () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = new FormData()
          data.append('displayName', this.form.displayName)
          data.append('file', this.form.file)
          try {
            this.loading = true
            await uploadDataFile(data)
            this.loading = false
            this.close()
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.upload-file-dialog {
  .el-button--text {
    font-size: 12px;
    font-weight: 400;
  }
  .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .el-dialog__title {
      font-size: 16px;
    }
  }
  .el-dialog__body {
    .title {
      display: flex;
      justify-content: flex-start;
      .block {
        background-color: rgba(250, 131, 52, 1);
        width: 4px;
        height: 14px;
        margin-top: 3px;
      }
      .text {
        margin-left: 12px;
        line-height: 20px;
        text-align: left;
        white-space: nowrap;
        font-size: 14px;
        font-family: PingFangSC-Medium;
        color: rgba(0, 0, 0, 0.9);
      }
    }
    .form {
      padding: 24px 0 0 24px;
      .upload-btn {
        width: 156px;
        height: 32px;
        border-radius: 2px;
      }
      .el-input__inner {
        font-size: 12px;
      }
      .el-form-item__label {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.9);
      }
      .tip {
        line-height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
      }
      .attention {
        line-height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    margin: 0 -20px -10px;
  }
}
</style>
