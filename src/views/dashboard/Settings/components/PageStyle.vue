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
              <div class="editor-item-container">
                <span class="title">主题模板</span>
                <el-button type="text" icon="el-icon-edit">自定义</el-button>
              </div>
              <el-carousel arrow="always" :loop="false" :autoplay="false">
                <el-carousel-item v-for="(item,index) in carouselItems" :key="index">
                  <div class="carousel-item-wrapper">
                    <div
                      v-for="(theme,i) in item"
                      :key="i"
                      class="carousel-item-wrapper__item"
                      :class="{'active': carouselActiveIndex === 6 * index + i}"
                      @click="() => selectTheme(theme,i,index)"
                    >
                      <img :src="theme.src" alt="">
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </el-collapse-item>
            <el-collapse-item title="全局配置" name="2">
              <Theme />
              <ColorSet />
              <div class="editor-item-container with-icon">
                <el-checkbox>渐变色彩样式</el-checkbox>
                <el-tooltip placement="top">
                  <div slot="content">渐变样式作用于指示类、趋势类以及比较类图表</div>
                  <svg-icon icon-class="tools-i" style="color:white" />
                </el-tooltip>
              </div>
              <div class="editor-item-container with-icon">
                <span class="title">间距</span>
                <el-radio-group>
                  <el-radio :label="3">紧凑</el-radio>
                  <el-radio :label="6">宽松</el-radio>
                </el-radio-group>
              </div>
              <div class="editor-item-container with-icon">
                <span class="title">圆角</span>
                <el-radio-group v-model="chartRadius">
                  <el-radio :label="'0px'">无</el-radio>
                  <el-radio :label="'5px'">小</el-radio>
                  <el-radio :label="'10px'">大</el-radio>
                </el-radio-group>
              </div>
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

const picsrc1 = 'https://img.alicdn.com/imgextra/i4/O1CN01bzVMre1wmo6CLoPyv_!!6000000006351-0-tps-2068-3188.jpg'
const picsrc2 = 'https://img.alicdn.com/imgextra/i3/O1CN01QEZ2el1semh9WkS0F_!!6000000005792-0-tps-2068-3228.jpg'
const picsrc3 = 'https://img.alicdn.com/imgextra/i1/O1CN016GmMrK1YCZzTop2FQ_!!6000000003023-0-tps-2068-3218.jpg'

export default {
  name: 'PageStyle',
  components: { Theme, ColorSet },
  data () {
    return {
      styles: {},
      activeName: '1',
      themeTemplates: [
        { src: picsrc1, template: 'template1', style: { background: 'white' } },
        { src: picsrc2, template: 'template2', style: { background: 'black' } },
        { src: picsrc3, template: 'template3', style: { background: 'pink' } },
        { src: picsrc1, template: 'template4', style: { background: 'none' } },
        { src: picsrc2, template: 'template5', style: { background: '#f32464' } },
        { src: picsrc3, template: 'template6', style: { background: 'green' } },
        { src: picsrc1, template: 'template7', style: { background: 'yellow' } },
        { src: picsrc2, template: 'template8', style: { background: 'black' } },
        { src: picsrc3, template: 'template9', style: { background: 'black' } },
        { src: picsrc3, template: 'template10', style: { background: 'black' } }
      ],
      carouselActiveIndex: 0,
      chartRadius: '0px'
    }
  },
  computed: {
    carouselItems() {
      const items = []
      for (let i = 0; i <= this.themeTemplates.length; i += 6) {
        const tail = this.themeTemplates.length > i + 5 ? i + 5 : this.themeTemplates.length
        items.push(this.themeTemplates.slice(i, tail + 1))
      }
      return items
    }
  },
  watch: {
    chartRadius (val) {
      this.$store.state.settings.chartsStyles = { ...this.$store.state.settings.chartsStyles, 'border-radius': val }
    }
  },
  methods: {
    selectTheme(theme, i, index) {
      this.$store.state.settings.layoutStyles = theme.style
      this.carouselActiveIndex = 6 * index + i
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-panel{
    ::v-deep .el-tabs__header{
        padding-left: 150px !important;
    }
}
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
    &__item.active{
        border: 1px solid #FA8334;
    }
}
.title{
    color:#fff;
    margin-right: 15px;
}
.editor-item-container{
    display: flex;
    justify-content: space-between;
    .el-button,::v-deep .el-checkbox__label{
        color: #fff;
    }
    svg {
        margin-left: 15px;
    }
}
.with-icon {
    justify-content:start !important;
    align-items: center;
    .el-radio{
        margin-right: 9px !important;
        ::v-deep .el-radio__label{
            color: #fff;
        }
    }
}
</style>

