<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.open">开启日期趋势图展示</el-checkbox>
    <div class="editor-item-container">
      <SwitchIcon :icon-options="typeOption" :type.sync="option.type" :disabled="!option.open" @checekType="checekType" />
    </div>
    <template v-if="option.open">
      <span class="editor-item-title" style="margin:20px 0 -5px 0">图表类型切换</span>
      <div class="editor-item-container">
        <SwitchIcon :icon-options="chartOption" :type.sync="option.chart" :disabled="!option.open" />
      </div>
      <div v-if="option.titleColor" class="editor-item-container color">
        <Color
          :option="option.titleColor"
        />
      </div>

      <!-- <ColorConfig
        :color-data.sync="option.color"
        title="自定义趋势图颜色"
        @showColor="getColor"
      /> -->
      <!-- <div class="editor-object-container">
        <span class="editor-item-title">自定义趋势图颜色</span>
        <div v-for="(data,index) in option.color" :key="index" class="editor-item-container box">
          {{ data.name }}
          <el-color-picker v-model="data.color" class="pl10" />
        </div>
      </div> -->
      <!-- <div class="editor-item-container pl0">
        <span class="inline">日期区间设定</span>
        <el-input-number v-model="option.dateRange" class="number number-box pl10" controls-position="right" :min="1" :max="9999" />
        天
      </div> -->
      <div v-if="option.type == 'disperse'" class="editor-item-container pl0">
        <span class="inline">指标预览交互方式 </span>
        <el-radio-group v-model="option.preview" class="pl5">
          <el-radio label="radio">单选</el-radio>
          <el-radio label="multi">多选</el-radio>
        </el-radio-group>
      </div>
      <div v-if="option.chart == 'bar'" class="editor-item-container pl0 editorBarFix">
        <span class="inline">柱体宽度</span>
        <el-slider v-model="option.barWidth" class="editorBar" />
        <el-input-number v-model="option.barWidth" style="width:61px" class="number number-box " controls-position="right" step-strictly :step="1" :min="1" :max="100" />
      </div>

      <!-- <div class="editor-item-container pl0">
        <span>多指标展示形式</span>
        <el-radio-group v-model="option.indicators">
          <el-radio label="line">左右滑动</el-radio>
          <el-radio label="linefeed">换行平铺</el-radio>
        </el-radio-group>
      </div>
      <div class="editor-item-container pl0">
        <p>22{{ option.twoY[activeName] }}</p>
        <div v-if="option.preview == 'multi'">
          <el-checkbox v-model="option.twoY.show">显示双Y轴</el-checkbox>
          <el-tabs v-if="option.twoY.show" v-model="activeName" class="ytabs">
            <el-tab-pane label="垂直左轴" name="left" />
            <el-tab-pane label="垂直右轴" name="right">配置管理</el-tab-pane>
          </el-tabs>
        </div>
        <Axis :data.sync="option.twoY[activeName]" />
        <AxisFormat :data.sync="option.axisLabel" />
        <el-checkbox v-model="option.showChart">显示图标标签</el-checkbox>
        <br>
      </div> -->
      <!-- <div class="editor-item-container pl0">
        <span>数据标签展示方式</span>
        <el-radio-group v-model="option.labelShow">
          <el-radio label="0">智能显示</el-radio>
          <el-radio label="1">全量显示</el-radio>
        </el-radio-group>
      </div> -->
    </template>
  </div>
</template>

<script>
import SwitchIcon from './component/SwitchIcon'
import Color from '@/components/Dashboard/Settings/Color'
// import Axis from './component/Axis'
// import AxisFormat from './component/AxisFormat'
export default {
  name: 'TrendChartConfig',
  components: {
    SwitchIcon,
    Color
    // AxisFormat,
    // Axis
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      typeOption: [
        { name: '展示趋势图', icon: 'disperse', type: 'disperse' },
        { name: '指标带小趋势图', icon: 'integration', type: 'integration' }
      ],
      chartOption: [
        { name: '线图', icon: 'trendBroken', type: 'line' },
        { name: '柱图', icon: 'trendBar', type: 'bar' },
        { name: '面积图', icon: 'trendArea', type: 'area' }
      ],
      color: [],
      activeName: 'left'
    }
  },
  watch: {
    option: {
      handler() {
        this.activeName = 'left'
      }
    }
  },
  mounted() {
    console.log('option', this.option)
  },
  methods: {
    // 检查多选状态
    checekType(val) {
      if (val === 'integration') {
        this.option.preview = 'radio'
      }
    },
    // 设置颜色
    getColor(val) {
      console.log(val)
    },
    handleSelect(val) {
      console.log(val, 'hah')
    }
  }
}
</script>

<style lang="scss" scoped>
.date {
  display: flex;
  align-items: center;
  margin-top: 5px;
  .number {
    flex:1;
  }
}
.editorBarFix{
  display:flex;align-items: center;
  .editorBar{ width: 70px; margin: 0 10px;}
  .number-box{ width: 60px;}
}
::v-deep .editorBarFix .ytabs  .el-tabs__header{ padding:0 !important}
::v-deep .editorBarFix .el-input-number.is-controls-right[class*=small] [class*=increase], ::v-deep .editorBarFix .el-input-number.is-controls-right[class*=small] [class*=decrease]{ width:20px}
::v-deep .editorBarFix .el-input-number.is-controls-right .el-input__inner{ padding:0  21px 0 0;}
::v-deep .editorBarFix .el-slider__bar{ height: 3px;}
::v-deep .editorBarFix .el-slider__runway{ height: 3px;}
::v-deep .editorBarFix .el-slider__button{ width:10px; height: 10px;}
::v-deep .editorBarFix .el-slider__button-wrapper{ top: -16px;}
::v-deep .editorBarFix .el-slider__button:hover, ::v-deep .editorBarFix .el-slider__button.hover, ::v-deep .editorBarFix .el-slider__button.dragging{ transform: scale(1);}
</style>
