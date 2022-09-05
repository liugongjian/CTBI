<template>
  <div class="upload-img-inner">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="使用素材"
        name="1"
      >
        <div class="material-content">
          <span>背景元素</span>
          <ul style="margin-top: 8px">
            <li
              v-for="(item,index) in imgList"
              :key="index"
              :class="[{'img-item-selected': item.url === option.imgUrl},'img-item']"
              @click="handlerClick(item.url)"
            >
              <div class="img-url">
                <img
                  :src="item.url"
                  style="max-width:100%;height:100%;"
                >
              </div>
            </li>
          </ul>
        </div>
        <div class="show-type">
          <div>显示方式</div>
          <el-select
            v-model="value"
            placeholder="请选择"
            popper-class="img-select"
            @change="changeImgSize"
          >
            <el-tooltip
              v-for="item in imgSizeOptions"
              :key="item.value"
              class="item"
              effect="dark"
              :content="item.label"
              placement="top-start"
            >
              <el-option
                :label="item.label"
                :value="item.value"
              />
            </el-tooltip>
          </el-select>
          <el-button type="text" @click="reset">恢复默认</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane
        label="自定义图片"
        name="2"
      >
        <div class="upload-img-card">
          <div>
            <el-upload
              action="fakerAction"
              class="avatar-uploader"
              :show-file-list="false"
              accept="image/png, image/jpeg, image/jpg"
              :before-upload="beforeUpload"
              :http-request="(params) =>saveload(params,'imgaddr')"
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
              /><span
                class="btn"
                :class="imgUrl?'active':''"
                @click="handlerClick(imgUrl)"
              >使用</span>
            </div>
          </div>
          <div class="show-type">
            <div>显示方式</div>
            <el-select
              v-model="value"
              placeholder="请选择"
              popper-class="img-select"
              @change="changeImgSize"
            >
              <el-tooltip
                v-for="item in imgSizeOptions"
                :key="item.value"
                class="item"
                effect="dark"
                :content="item.label"
                placement="top-start"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                />
              </el-tooltip>
            </el-select>
            <el-button type="text" @click="reset">恢复默认</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { uploadImg } from '@/api/dataSource'
export default {
  name: 'UploadImgInner',
  props: {
    option: {
      type: Object,
      default: () => { }

    }
  },
  data () {
    return {
      activeName: '1',
      imgList: null, // 图片数据
      imgUrl: '', // 图片网址
      fileList: [],
      isUpload: false, // 是否已经上传图片
      imgSizeOptions: [{
        value: 'containLeft',
        label: '居左平铺（比例不变，图片缩放）'
      }, {
        value: 'containMiddle',
        label: '居中平铺（比例不变，图片缩放）'
      }, {
        value: 'containRight',
        label: '居右平铺（比例不变，图片缩放）'
      }, {
        value: 'coverClip',
        label: '裁剪以充满区域（图片缩放，两头裁剪）'
      }, {
        value: 'cover',
        label: '拉伸以充满区域（比例变化，图片缩放）'
      }],
      optionImgSize: this.option.imgSize,
      value: this.option.imgSize
    }
  },
  mounted () {
    // 初始化图片数据
    this.imgList = [
      {
        name: 'background_one',
        url: require('./image/background_one.svg')
      },
      {
        name: 'background_two',
        url: require('./image/background_two.svg')
      },
      {
        name: 'background_three',
        url: require('./image/background_three.svg')
      }
    ]
  },
  methods: {
    // 选择背景图片
    handlerClick (url) {
      this.option.imgUrl = url
    },
    // 恢复默认
    reset () {
      this.value = this.optionImgSize
      this.option.imgSize = this.value
    },
    // 上传图片前钩子
    beforeUpload (file) {
      const isJPG = file.type
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isJPG !== 'image/jpeg' && isJPG !== 'image/png' && isJPG !== 'image/jpg') {
        this.$message({
          message: '图片只能是 jpg、png、jpeg 格式!',
          type: 'error'
        })
      }
      if (!isLt1M) {
        this.$message({
          message: '上传封面图片大小不能超过 1MB!',
          type: 'error'
        })
      }
      return isJPG && isLt1M
    },
    // 上传附件
    saveload (data, val) {
      if (data.file.type === 'image/jpeg' || data.file.type === 'image/png') {
        const formData = new FormData()
        formData.append('img', data.file)
        // 发送http请求
        uploadImg(formData, ({ total, loaded }) => {
          // 文件进度条控制
          data.onProgress({ percent: Math.round(loaded / total * 100) })
        }).then((res) => {
          if (res) {
            if (val === 'imgaddr') {
              this.option.imgUrl = process.env.VUE_APP_BASE_API + `/dataFiles/img?path=${res}`
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

    // // 获取上传图片的本地路径，有后端接口时需删除
    // getLocalImg (event) {
    //   let url = ''
    //   if (window.createObjectURL !== undefined) {
    //     url = window.createObjectURL(event.raw)
    //   } else if (window.URL !== undefined) {
    //     url = window.URL.createObjectURL(event.raw)
    //   } else if (window.webkitURL !== undefined) {
    //     url = window.webkitURL.createObjectURL(event.raw)
    //   }
    //   this.option.imgUrl = url
    // },

    // // 图片上传成功后
    // onSuccess (res) {
    //   this.isUpload = true
    // },

    // 选择背景图片尺寸
    changeImgSize () {
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
  .upload-img-card {
    font-size: 12px;
    overflow: auto;
    height: 204px;
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
