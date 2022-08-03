<template>
  <div class="editor-object-container">
    <div>
      <el-checkbox v-model="option.check">显示指标修饰图</el-checkbox>
      <template>
        <div :class="!option.check ? 'box-disabled' : ''">
          <div class="editor-item-container">
            <Color :option="option.Color" />
          </div>
          <!-- 有维度时 指的是对维度的设置 -->
          <div v-if="getPicTypeShow">
            <div class="editor-item-container">
              <div>
                图片类型
                <el-radio-group v-model="option.type">
                  <el-radio label="img">图片字段</el-radio>
                  <el-radio label="static">静态</el-radio>
                </el-radio-group>
              </div>

            </div>
            <div class="editor-item-container">
              <div
                v-if="option.type === 'img'"
                class="dimension"
              >
                图片字段
                <el-select
                  v-model="value"
                  class="w-select"
                  placeholder="请选择"
                  popper-class="setting-select"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div
                v-else
                class="dimension"
              >
                <el-select
                  v-model="svgValue"
                  class="w-select"
                  placeholder="请选择维度项"
                  popper-class="setting-select"
                >
                  <el-option
                    v-for="(item,index) in option.setSvg"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  >
                    <div class="svgValue">
                      <span>{{ item.name }}</span>
                      <ImgIcon :data="item.svg" />
                    </div>
                  </el-option>
                </el-select>
                <el-popover
                  placement="top-end"
                  width="365"
                  trigger="click"
                >
                  <UploadSvg
                    :option="option"
                    :svg-value="svgValue"
                  />
                  <div
                    slot="reference"
                    class="upload-img-wrapper"
                  >
                    <ImgIcon :data="getSvgVal" />
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
          <!-- 无维度时 指的是对度量的设置 -->
          <div v-else>
            <div v-for="(item, index) in getDataSeries" :key="index" class="editor-item-container dimension">
              <el-input v-model="item.title" :readonly="true" />
              <el-popover
                placement="top-end"
                width="365"
                trigger="click"
              >
                <UploadSvg
                  :option="option"
                  :svg-value="item.title"
                />
                <div
                  slot="reference"
                  class="upload-img-wrapper"
                >
                  <ImgIcon :data="getSvgValTitle(item.title)" />
                </div>
              </el-popover>
            </div>

          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import Color from '../Color'
import { colorTheme } from '@/constants/color.js'
import UploadSvg from './UploadSvg.vue'
import ImgIcon from '@/components/Dashboard/Common/ImgIcon'
export default {
  name: 'IndicatorPic',
  components: {
    Color,
    UploadSvg,
    ImgIcon
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      colorTheme,
      value: null,
      svgValue: '',
      options: []
    }
  },
  computed: {
    getSvgVal () {
      return this.option.setSvg.find(item => item.name === this.svgValue)?.svg || ''
    },
    getPicTypeShow () {
      return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)?.option.dataSource.Dimension?.value.length > 0 || false
    },
    getDataSeries() {
      if (store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)?.option.theme.StyleConfig.IndicatorDisplay?.relation === 'deputy') {
        return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)?.option.theme.SeriesSetting.IndicatorSeries.dataSeries.splice(0, 1)
      } else {
        return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)?.option.theme.SeriesSetting.IndicatorSeries.dataSeries
      }
    }
  },
  methods: {
    getSvgValTitle(val) {
      return this.option.setSvg.find(item => item.name === val)?.svg || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.lineNum {
  display: flex;
  align-items: center;
  .el-input-number {
    flex: 1;
  }
}
.dimension {
  display: flex;
  align-items: center;
  .el-color-picker {
    margin: 0 5px;
  }
  .w-select {
    flex: 1;
  }
}
.svgValue {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
   width: 38px;
  height: 24px;
  margin-left: 5px;
  background-color: #686e6e;
}
</style>
