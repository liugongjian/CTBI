<template>
  <div class="editor-object-container">
    <div class="editor-item-title">
      展示样式
    </div>
    <div v-if="style === 'funnel-standard'" class="editor-item-container">
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
    <div v-if="style === 'funnel-horizontal'" class="editor-item-container">
      <el-button
        type="text"
        @click="changeDirect('horizontal')"
      >
        <el-tooltip class="item" effect="dark" content="横向" placement="top">
          <svg-icon
            :icon-class="'funnel-trans-horizon'"
            style="font-size: 20px"
          />
        </el-tooltip>
      </el-button>
      <el-button
        type="text"
        @click="changeDirect('vertical')"
      >
        <el-tooltip class="item" effect="dark" content="纵向" placement="top">
          <svg-icon
            :icon-class="'funnel-trans-vertical'"
            style="font-size: 20px"
          />
        </el-tooltip>
      </el-button>
    </div>
    <div v-if="style === 'funnel-standard'" class="editor-item-title">
      显示类别标签
    </div>
    <div v-if="style === 'funnel-standard'" class="editor-item-container">
      <el-radio-group v-model="labelPos" @change="labelPosHandler">
        <el-radio label="left">位于图表左侧</el-radio>
        <el-radio label="right">位于图表右侧</el-radio>
      </el-radio-group>
    </div>
    <div v-if="style === 'funnel-standard'" class="editor-item-title">
      显示数据标签
    </div>
    <div v-if="style === 'funnel-standard'" class="editor-item-container">
      <el-radio-group v-model="dataLabel" @change="dataLabelHandler">
        <el-radio label="conversion">转化率</el-radio>
        <el-radio label="metric">度量值</el-radio>
        <el-radio label="coMe">转化率 + 度量值</el-radio>
      </el-radio-group>
    </div>
    <div class="editor-item-title" :class="{'ban-edit':style === 'funnel-horizontal'}">
      转化率计算方式
    </div>
    <div class="editor-item-container">
      <el-radio-group v-model="calcMethod" :disabled="style === 'funnel-horizontal'" @change="labelCalcHandler">
        <el-radio label="last">占上一层的百分比</el-radio>
        <el-radio label="first">占第一层的百分比</el-radio>
      </el-radio-group>
    </div>
    <div v-if="style === 'funnel-standard'" class="editor-item-title">
      底部样式
    </div>
    <div v-if="style === 'funnel-standard'" class="editor-item-container">
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
      triangle: 'false',
      style: 'funnel-standard'
    }
  },
  computed: {},
  watch: {
    '$store.state.funnel.visiableStyle': {
      handler(val) {
        this.style = val
      },
      deep: true
    }
  },
  created () { },
  mounted () {
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
    },
    changeDirect (val) {
      if (val === 'horizontal') {
        this.option.vertical = false
        this.option.horizontal = true
      }
      if (val === 'vertical') {
        this.calcMethod = 'last' // 纵向仅支持计算 last 方法
        this.option.vertical = true
        this.option.horizontal = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ban-edit {
  cursor:not-allowed;
  color: #5e636e;
}

</style>
