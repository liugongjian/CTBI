<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.open">开启日期趋势展示</el-checkbox>
    <div class="editor-item-container">
      <SwitchIcon :icon-options="typeOption" :type.sync="option.type" :disabled="option.open" />
    </div>
    <template v-if="!option.open">
      <span>图标切换</span>
      <div class="editor-item-container">
        <SwitchIcon :icon-options="chartOption" :type.sync="option.chart" />
      </div>
      <ColorConfig
        :color-data.sync="color"
        title="自定义趋势图颜色"
        @showColor="getColor"
      />
      <div class="date">
        日期区间设定
        <el-input-number v-model="option.dateRange" class="number" controls-position="right" :min="1" :max="9999" />
        天
      </div>
      <span>指标预览交互方式</span>
      <div class="editor-item-container">
        <el-radio-group v-model="option.preview">
          <el-radio label="radio">单选</el-radio>
          <el-radio label="multi">多选</el-radio>
        </el-radio-group>
      </div>
      <span>多指标展示形式</span>
      <div class="editor-item-container">
        <el-radio-group v-model="option.indicators">
          <el-radio label="line">左右滑动</el-radio>
          <el-radio label="linefeed">换行平铺</el-radio>
        </el-radio-group>
      </div>
      <el-checkbox v-model="option.twoY.show">显示双Y轴</el-checkbox>
      <el-tabs v-if="option.twoY.show" v-model="activeName">
        <el-tab-pane label="垂直左轴" name="left" />
        <el-tab-pane label="垂直右轴" name="right">配置管理</el-tab-pane>
      </el-tabs>
      <Axis :data.sync="option.twoY[activeName]" />
      <AxisFormat :data.sync="option.axisLabel" />
      <el-checkbox v-model="option.showChart">显示图标标签</el-checkbox>
      <br>
      <span>数据标签展示方式</span>
      <div class="editor-item-container">
        <el-radio-group v-model="option.dataLabel">
          <el-radio label="capacity">智能显示</el-radio>
          <el-radio label="full">全量显示</el-radio>
        </el-radio-group>
      </div>
    </template>
  </div>
</template>

<script>
import SwitchIcon from './component/SwitchIcon'
import ColorConfig from '@/components/Dashboard/Common/ColorConfig'
import Axis from './component/Axis'
import AxisFormat from './component/AxisFormat'
export default {
  name: 'TrendConfig',
  components: {
    SwitchIcon,
    ColorConfig,
    AxisFormat,
    Axis
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
        { name: '展示趋势图', icon: 'disperse' },
        { name: '指标带小趋势图', icon: 'integration' }
      ],
      chartOption: [
        { name: '线图', icon: 'trendBroken' },
        { name: '柱图', icon: 'trendBar' },
        { name: '面积图', icon: 'trendArea' }
      ],
      color: [],
      activeName: 'left'
    }
  },
  methods: {
    // 设置颜色
    getColor() {

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
</style>
