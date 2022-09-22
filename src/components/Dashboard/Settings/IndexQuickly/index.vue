<template>
  <div class="editor-object-container">
    <div class="">
      <div class="editor-item-title">指标关系</div>
      <el-radio-group
        v-model="option.relation"
        @change="changeRelation"
      >
        <el-radio label="parataxis">并列</el-radio>
        <el-radio label="deputy">主副</el-radio>
      </el-radio-group>
    </div>
    <div class="m-t-12">
      <div class="editor-item-title">多指标展示形式</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.moreRelation">
          <el-radio label="line">左右滑动</el-radio>
          <el-radio label="lineBreak">换行平铺</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="lineNum">
      <div class="editor-item-title">每行最多</div>
      <el-input-number
        v-model="option.lineNum"
        controls-position="right"
        :min="1"
        :max="99"
      />
    </div>
    <div class="m-t-12">
      <el-checkbox v-model="option.dimension">显示维度名称</el-checkbox>
    </div>
    <div v-if="option.relation === 'deputy'" class="m-t-12">
      <el-checkbox v-model="option.indicators">显示主指标名称</el-checkbox>
    </div>
    <div class="m-t-12">
      <el-checkbox v-model="option.fontStyle.show">设置字体样式</el-checkbox>
      <div
        v-for="(item,index) in option.fontStyle.data"
        v-show="item.show"
        :key="index"
        class="editor-item-container dimension"
      >
        <div class="editor-item-title">{{ item.name }}</div>
        <el-color-picker
          v-model="item.color"
          :disabled="getDisabled(item.name)"
        />
        <el-select
          v-model="item.fontSize"
          :disabled="getDisabled(item.name)"
          class="w-select"
          placeholder="请选择"
          popper-class="setting-select"
        >
          <el-option
            v-for="data in fontSizeOptions"
            :key="data"
            :label="data"
            :value="data"
          />
        </el-select>
      </div>
      <div class="editor-item-container">
        <div class="editor-item-title">指标</div>
        <div class="editor-item-container dimension">
          <div class="editor-item-title">大小</div>
          <el-select
            v-model="option.fontStyle.target.fontSize"
            :disabled="!option.fontStyle.show"
            class="w-select"
            placeholder="请选择"
            popper-class="setting-select"
          >
            <el-option
              v-for="data in fontSizeOptions"
              :key="data"
              :label="data"
              :value="data"
            />
          </el-select>
        </div>
        <div class="editor-item-container dimension">
          <div class="editor-item-title">数值</div>
          <el-color-picker
            v-model="option.fontStyle.target.valColor"
            :disabled="!option.fontStyle.show"
          />
          <div class="editor-item-title">名称</div>
          <el-color-picker
            v-model="option.fontStyle.target.nameColor"
            :disabled="!option.fontStyle.show"
          />
        </div>
      </div>
    </div>
    <div class="m-t-12">
      <div class="editor-item-title">指标组合指标快内位置</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.position">
          <el-radio label="left">横向居左</el-radio>
          <el-radio label="center">横向居中</el-radio>
        </el-radio-group>
        <template v-if="option.position === 'center'">
          <div class="m-t-12">与指标对齐方式</div>
          <div class="editor-item-container">
            <el-radio-group v-model="option.align">
              <el-radio label="left">左对齐</el-radio>
              <el-radio label="center">居中对齐</el-radio>
            </el-radio-group>
          </div>
        </template>
      </div>
    </div>
    <div
      class="m-t-12"
    >
      <el-checkbox v-model="option.modified">显示指标修饰图</el-checkbox>
      <template v-if="option.modified">
        <div class="editor-item-container">
          <ColorConfig
            :color-data.sync="colorData"
            @showColor="getColor"
          />
        </div>
        <div class="editor-item-container">
          <div class="editor-item-title">图片类型</div>
          <el-radio-group v-model="option.type">
            <!-- <el-radio label="img">图片字段</el-radio> -->
            <el-radio label="static">静态</el-radio>
          </el-radio-group>
        </div>
        <div
          v-if="option.type === 'img'"
          class="editor-item-container dimension"
        >
          <div class="editor-item-title">图片字段</div>
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
          class="editor-item-container dimension"
        >
          <el-select
            v-model="svgValue"
            class="w-select"
            placeholder="请选择"
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
              <!-- <SvgIcon :icon-class="svgValue" /> -->
              <ImgIcon :data="getSvgVal" />
            </div>
          </el-popover>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ColorConfig from '@/components/Dashboard/Common/ColorConfig'
import UploadSvg from './UploadSvg.vue'
import store from '@/store'
import ImgIcon from '@/components/Dashboard/Common/ImgIcon'
export default {
  name: 'IndexQuickly',
  components: {
    ColorConfig,
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
      value: null,
      svgValue: '',
      colorData: [],
      options: [],
      fontSizeOptions: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    }
  },
  computed: {
    getSvgVal () {
      return this.option.setSvg.find(item => item.name === this.svgValue)?.svg || ''
    }
  },
  watch: {
    // 监听数据变化 变化后触发radar组件变化
    colorData: {
      handler (val) {
        this.option.color = val
      },
      deep: true
    }
  },
  methods: {
    getColor () {
      store.state.app.layout.forEach(item => {
        if (item.id === store.state.app.currentLayoutId) {
          this.colorData = item.option.theme.StyleConfig.IndexQuickly.color
        }
      })
    },
    changeRelation (val) {
      if (val === 'deputy') {
        this.option.fontStyle.data.forEach(item => {
          if (item.name !== '维度名称') {
            item.show = !item.show
          }
          if (item.name === '主指标数值') {
            item.fontSize = 24
          }
        })
      } else {
        this.option.fontStyle.data.forEach(item => {
          item.show = true
          if (item.name === '主指标数值') {
            item.fontSize = 16
          }
          if (item.name !== '维度名称') {
            item.show = !item.show
          }
        })
      }
    },
    getDisabled (name) {
      if (name === '维度名称') {
        return !this.option.dimension || !this.option.fontStyle.show
      } else if (name === '主指标名称') {
        return !this.option.indicators || !this.option.fontStyle.show
      }
      return !this.option.fontStyle.show
    }
  }
}
</script>

<style lang="scss" scoped>
.lineNum {
  display: flex;
  align-items: center;
  margin-top: 12px;
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
