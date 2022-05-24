<template>
  <div class="setting-panel">
    <el-container>
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="主题"
          name="1"
        >
          <el-collapse>
            <el-collapse-item title="仪表板主题" name="1">
              <el-carousel arrow="always" :loop="false" :autoplay="false">
                <el-carousel-item v-for="item in 4" :key="item">
                  <div class="carousel-item-wrapper">
                    <div class="carousel-item-wrapper__item">
                      <img src="https://img.alicdn.com/imgextra/i4/O1CN01bzVMre1wmo6CLoPyv_!!6000000006351-0-tps-2068-3188.jpg" alt="">
                    </div>
                    <div class="carousel-item-wrapper__item">
                      <img src="https://img.alicdn.com/imgextra/i4/O1CN01bzVMre1wmo6CLoPyv_!!6000000006351-0-tps-2068-3188.jpg" alt="">
                    </div>
                    <div class="carousel-item-wrapper__item">
                      <img src="https://img.alicdn.com/imgextra/i4/O1CN01bzVMre1wmo6CLoPyv_!!6000000006351-0-tps-2068-3188.jpg" alt="">
                    </div>
                    <div class="carousel-item-wrapper__item">
                      <img src="https://img.alicdn.com/imgextra/i4/O1CN01bzVMre1wmo6CLoPyv_!!6000000006351-0-tps-2068-3188.jpg" alt="">
                    </div>
                    <div class="carousel-item-wrapper__item">
                      <img src="https://img.alicdn.com/imgextra/i4/O1CN01bzVMre1wmo6CLoPyv_!!6000000006351-0-tps-2068-3188.jpg" alt="">
                    </div>
                    <div class="carousel-item-wrapper__item">
                      <img src="https://img.alicdn.com/imgextra/i4/O1CN01bzVMre1wmo6CLoPyv_!!6000000006351-0-tps-2068-3188.jpg" alt="">
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </el-collapse-item>
            <el-collapse-item title="全局配置" name="2">
              <Theme />
              <ColorSet />
            </el-collapse-item>
            <el-collapse-item title="仪表板标题区" name="3">
              <span style="color:white">非同源级联配置项</span>
            </el-collapse-item>
            <el-collapse-item title="图表背景" name="4">
              <span style="color:white">非同源级联配置项</span>
            </el-collapse-item>
            <el-collapse-item title="图表标题" name="5">
              <span style="color:white">非同源级联配置项</span>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane
          label="高级"
          name="2"
        >
          <el-collapse>
            <el-collapse-item title="基础设置" name="1">
              <div>
                <el-checkbox>显示水印</el-checkbox>
              </div>
              <div>
                <el-checkbox>允许下载</el-checkbox>
              </div>
            </el-collapse-item>
            <el-collapse-item title="级联条件" name="2">
              <span style="color:white">非同源级联配置项</span>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
// import store from '@/store'
import Theme from './Theme.vue'
import ColorSet from './ColorSet.vue'

export default {
  name: 'PageStyle',
  components: { Theme, ColorSet },
  data () {
    return {
      activeName: '1'
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.el-carousel ::v-deep .el-carousel__container {
  height: 150px;
}
.carousel-item-wrapper{
    display: inline-grid;
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(2, 50%);
    grid-gap: 5px 5px;
    padding:0 10% 0 8%;
    &__item{
        width: 111px;
        height: 68px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>

