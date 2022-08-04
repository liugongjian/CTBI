<template>
  <div class="upload-img-inner">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="使用素材"
        name="1"
      >
        <div class="material-content">
          <span>背景元素</span>
          <ul>
            <li
              v-for="(item,index) in imgList"
              :key="index"
              :class="[{'img-item-selected': item.url === option.imgUrl},'img-item']"
              @click="handlerClick(item)"
            >
              <div class="img-url">
                <SvgIcon :icon-class="item" />
                <!-- <img
                  :src="item.url"
                  style="max-width:100%;height:100%;"
                > -->
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
              :on-change="getLocalImg"
              :on-success="onSuccess"
              :file-list="fileList"
            >
              <el-button
                size="small"
                type="primary"
                :icon="isUpload?'el-icon-refresh':'el-icon-upload2'"
              >{{ isUpload?'重新上传':'上传本地图片' }}</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >只支持svg,png,gif格式最大1M</div>
            </el-upload>
          </div>
          <div>
            <div style="margin-bottom:12px;">或 通过图片链接上传</div>
            <div class="img-url">
              <el-input
                v-model="imgUrl"
                placeholder="请输入图片地址"
              /><span
                class="btn"
                @click="handlerClick(imgUrl)"
              >使用</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- <div class="footer">
      <div>显示方式</div>
      <div>
        <el-select
          v-model="value"
          placeholder="请选择"
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
      </div>
    </div> -->
  </div>
</template>

<script>
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
    // 初始化图片数据
    // this.imgList = [
    //   {
    //     name: 'background_one',
    //     url: require('./image/background_one.png')
    //   },
    //   {
    //     name: 'background_two',
    //     url: require('./image/background_two.png')
    //   }
    // ]
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
      const imgType = ['image/svg+xml']
      const isType = imgType.includes(file.type)
      const isLt1M = file.size / 1024 / 1024
      if (!isType) {
        this.$message.error('图片上传格式错误!')
      }
      if (!isLt1M) {
        this.$message.error('图片上传大小最大为1M!')
      }
      // return isType && isLt1M
      return false // 有后端接口时删除，换成上面代码
    },
    // 获取上传图片的本地路径，有后端接口时需删除
    getLocalImg(event) {
      let url = ''
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(event.raw)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(event.raw)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(event.raw)
      }
      this.handlerClick(url)
    },
    // 图片上传成功后
    onSuccess(res) {
      this.isUpload = true
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
  height: 286px;
  .material-content {
    padding: 8px;
    overflow: auto;
    height: 204px;
    box-sizing: border-box;
    ul {
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
        .img-url {
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
    height: 204px;
    padding: 24px;
    box-sizing: border-box;
    .img-url {
      display: flex;
      .btn {
        padding: 0 8px;
        display: flex;
        align-items: center;
        border-radius: 2px;
        background-color: #565b67;
        cursor: pointer;
        color: #fff;
        opacity: 0.5;
      }
    }
  }
  .footer {
    height: 34px;
    padding: 0 12px;
    border-top: 1px solid #dfdfdf;
    color: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
  }
}
</style>
