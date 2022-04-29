<template>
  <div class="editor-object-container">
    <div>
      展示样式
    </div>
    <div class="editor-item-container">
      <el-button
        type="text"
        @click="changeHandler('default')"
      >
        <el-tooltip class="item" effect="dark" content="默认" placement="top">
          <svg-icon
            :icon-class="'displaystyle-funnel-default'"
            style="font-size: 20px"
          />
        </el-tooltip>
      </el-button>
      <el-button
        type="text"
        @click="changeHandler('trapezoid')"
      >
        <el-tooltip class="item" effect="dark" content="梯形" placement="top">
          <svg-icon
            :icon-class="'displaystyle-funnel-trapezoid'"
            style="font-size: 20px"
          />
        </el-tooltip>
      </el-button>
      <el-button
        type="text"
        @click="changeHandler('rectangle')"
      >
        <el-tooltip class="item" effect="dark" content="矩形" placement="top">
          <svg-icon
            :icon-class="'displaystyle-funnel-rectangle'"
            style="font-size: 20px"
          />
        </el-tooltip>
      </el-button>
    </div>
    <div>
      显示类别标签
    </div>
    <div class="editor-item-container">
      <el-radio-group v-model="labelPos" @change="labelPosHandler">
        <el-radio label="left">位于图表左侧</el-radio>
        <el-radio label="right">位于图表右侧</el-radio>
      </el-radio-group>
    </div>
    <div>
      显示数据标签
    </div>
    <div class="editor-item-container">
      <el-radio-group v-model="dataLabel" @change="dataLabelHandler">
        <el-radio label="conversion">转化率</el-radio>
        <el-radio label="metric">度量值</el-radio>
        <el-radio label="coMe">转化率 + 度量值</el-radio>
      </el-radio-group>
    </div>
    <div>
      转化率计算方式
    </div>
    <div class="editor-item-container">
      <el-radio-group v-model="calcMethod" @change="labelCalcHandler">
        <el-radio label="last">占上一层的百分比</el-radio>
        <el-radio label="first">占第一层的百分比</el-radio>
      </el-radio-group>
    </div>
    <div>
      底部样式
    </div>
    <div class="editor-item-container">
      <el-radio-group v-model="triangle" @change="triangleHandler">
        <el-radio label="false">梯形</el-radio>
        <el-radio label="true">三角形</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisplayStyle',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      labelPos: 'left',
      dataLabel: 'conversion',
      calcMethod: 'last',
      triangle: 'false'
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    console.log('漏斗    漏斗！！！   ', this.option)
  },
  methods: {
    changeHandler (type) {
      switch (type) {
        case 'default':
          this.option.default = true
          this.option.trapezoid = false
          this.option.rectangle = false
          break
        case 'trapezoid':
          this.option.default = false
          this.option.trapezoid = true
          this.option.rectangle = false
          break
        case 'rectangle':
          this.option.default = false
          this.option.trapezoid = false
          this.option.rectangle = true
          break
      }
    },
    labelPosHandler (val) {
      this.option.labelPos = val + ''
    },
    dataLabelHandler (val) {
      this.option.dataLabel = val + ''
    },
    labelCalcHandler (val) {
      this.option.calcMethod = val + ''
    },
    triangleHandler (val) {
      this.option.triangle = val
    }
  }
}
</script>
