<template>
  <div class="upload-img-inner">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="使用素材"
        name="1"
      >
        <div class="svg-content">
          <span>指标修饰图</span>
          <ul>
            <li
              v-for="(item,index) in imgList"
              :key="index"
              :class="[{'img-item-selected': item.url === option.imgUrl},'img-item']"
              @click="handlerClick(item)"
            >
              <div class="svg-img-url">
                <SvgIcon :icon-class="item" />
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>

      <el-tab-pane
        label="自定义图片"
        name="2"
      >
        <div class="upload-img-card">
          <div>
            <el-upload
              action="#"
              :before-upload="beforeUpload"
              :show-file-list="false"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              :http-request="(params) =>saveload(params,'imgaddr')"
              class="avatar-uploader"
            >
              <el-button
                size="small"
                type="primary"
                :icon="isUpload?'el-icon-refresh':'el-icon-upload2'"
              >{{ isUpload?'重新上传':'上传本地图片' }}</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >只支持jpg,png,gif格式最大1M</div>
            </el-upload>
          </div>
          <div class="m-t-24">
            <div class="title">或 通过图片链接上传</div>
            <div class="img-url">
              <el-input
                v-model="imgUrl"
                placeholder="请输入图片地址"
                maxlength="400"
              /><span
                class="btn"
                @click="handlerClick(imgUrl)"
              >使用</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { uploadImg } from '@/api/dataSource'
import SvgIcon from '@/components/SvgIcon/index.vue'
export default {
  name: 'UploadImgInner',
  components: { SvgIcon },
  props: {
    option: {
      type: Object,
      default: () => { }
    },
    svgValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: '1',
      imgList: null,
      imgUrl: '',
      fileList: [],
      isUpload: false,
      value: this.option.imgSize
    }
  },
  mounted() {
    this.imgList = [
      'earth',
      'footprints',
      'love',
      'collection',
      'eyes'
    ]
  },
  methods: {
    // 选择svg
    handlerClick(url) {
      this.option.setSvg.forEach(item => {
        if (item.name === this.svgValue) {
          item.svg = url
        }
      })
    },
    // 上传图片前钩子
    beforeUpload(file) {
      console.log(file)
      const imgType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isType = imgType.includes(file.type)
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isType) {
        this.$message.error('图片上传格式错误!')
      }
      if (!isLt1M) {
        this.$message.error('图片上传大小最大为1M!')
      }
      return isType && isLt1M
    },
    // 上传附件
    saveload (data, val) {
      if (data.file.type === 'image/jpeg' || data.file.type === 'image/png' || data.file.type === 'image/jpg' || data.file.type === 'image/gif') {
        const formData = new FormData()
        formData.append('img', data.file)
        // 发送http请求
        uploadImg(formData, ({ total, loaded }) => {
          // 文件进度条控制
          data.onProgress({ percent: Math.round(loaded / total * 100) })
        }).then((res) => {
          if (res) {
            if (val === 'imgaddr') {
              this.option.setSvg.forEach(item => {
                if (item.name === this.svgValue) {
                  item.svg = process.env.VUE_APP_BASE_API + `/dataFiles/img?path=${res}`
                }
              })
              this.isUpload = true
            }
          }
        }).catch(res => {
          this.loading = false
          this.$message.error({
            type: 'error',
            message: `上传图片失败`,
            duration: 500
          })
        })
      }
    },
    // 选择背景图片尺寸
    changeImgSize() {
      this.option.imgSize = this.value
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-img-inner {
  display: flex;
  flex-direction: column;
  margin: -12px;
  ::v-deep  .el-tabs__header{
    margin: 0px !important;
  }
  ::v-deep .el-tabs__nav-wrap{
    padding: 8px 24px 0px 24px !important;
  }
  ::v-deep .el-tabs__content{
    padding: 24px;
  }
  .material-content {
    box-sizing: border-box;
    span{
      font-size: 12px;
      color: rgba(0,0,0,0.90);
      line-height: 20px;
      font-weight: 400;
    }
    ul {
      display: flex;
      .img-item {
        width: 116px;
        height: 57px;
        background-color: #fff;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .img-url {
          height: 48px;
          width: 107px;
          background: #383B47;
          border-radius: 2px;
          text-align: center;
        }
        &.img-item-selected {
          border: 1px solid rgba(250,131,52,1);
        }
      }
    }
  }
  .svg-content {
    max-height: 204px;
    overflow-y: auto;
    box-sizing: border-box;
    span{
      font-size: 12px;
      color: rgba(0,0,0,.65);
    }
    ul {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      .img-item {
        width: 40px;
        height: 40px;
        background-color: #fff;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
        cursor: pointer;
        .svg-img-url {
          width: 100%;
          line-height: 40px;
          border-radius: 2px;
          background: #1f2841;
          text-align: center;
        }
        &.img-item-selected {
          border: 1px solid #2e74ff;
        }
      }
    }
  }
  .upload-img-card {
    font-size: 12px;
    overflow: auto;
    max-height: 204px;
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 348px;
    .el-upload__tip{
      display: inline;
      font-size: 12px;
      color: rgba(0,0,0,0.45);
      line-height: 20px;
      font-weight: 400;
      margin-left: 12px;
    }
    .title{
      font-size: 12px;
      color: rgba(0,0,0,0.90);
      line-height: 20px;
      font-weight: 400;
    }
    .img-url {
      display: flex;
      margin-top: 12px;
      .btn {
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 500;
        color: #FFFFFF;
        cursor: pointer;
        background: #AEAEAE;
        border-radius: 0px 2px 2px 0px;
      }
      .btn.active{
        background: #FA8334;
        border-radius: 0px 2px 2px 0px;
        border-left: 0px;
      }
      .el-input--small{
        border-right: 0px;
      }
    }
  }
  .show-type{
    font-size: 12px;
    color: rgba(0,0,0,0.90);
    line-height: 20px;
    font-weight: 400;
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ::v-deep .el-select--small, ::v-deep .el-input--small{
      width: 220px;
    }
    ::v-deep .el-input__inner{
      font-size: 12px;
      color: rgba(0,0,0,0.65);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.img-select{
  .item{
    font-size: 12px;
    width: 220px;
  }
}
</style>
