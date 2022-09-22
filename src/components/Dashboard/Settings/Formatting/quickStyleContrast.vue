<template>
  <div class="preset-sample-box">
    <el-select v-model="val" placeholder="请选择" popper-class="quickStyleContrast" @change="changeSelected">
      <div class="subtitle">
        与0对比
        <div class="reverseBox">颜色翻转 <el-switch v-model="option.reverse" active-color="#13ce66" inactive-color="#393F4D" :width="30" /></div></div>
      <el-option value="">
        <span class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i style="color: #FFF;">无</i></span>
        </span>
      </el-option>
      <el-option value="num">
        <span class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#26BF6A': '#F65252'}">1</i></span>
          <span class="preset-sample-title-element"><i style="color: #ECD432;">0</i></span>
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#F65252': '#26BF6A'}">-1</i></span>
        </span>
      </el-option>
      <el-option value="arraw">
        <span class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#26BF6A': '#F65252'}"><svg-icon icon-class="arrowTop" /></i></span>
          <span class="preset-sample-title-element"><i style="color: #ECD432;"><svg-icon icon-class="arrowRight" /></i></span>
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#F65252': '#26BF6A'}"><svg-icon icon-class="arrowDown" /></i></span>
        </span>
      </el-option>
      <el-option value="caret">
        <span class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#26BF6A': '#F65252'}"><svg-icon icon-class="markTop" /></i></span>
          <span class="preset-sample-title-element"><i style="color: #ECD432;"><svg-icon icon-class="markLine" /></i></span>
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#F65252': '#26BF6A'}"><svg-icon icon-class="markDown" /></i></span>
        </span>
      </el-option>
      <el-option v-if="option.styleType!=='contrast'" value="bgNum">
        <span class="preset-sample-title">
          <span class="preset-sample-title-element">
            <span class="text-bg-item" style="background-color: rgb(246, 82, 82);"><i>1</i></span>
          </span>
          <span class="preset-sample-title-element">
            <span class="text-bg-item" style="background-color: rgb(38, 191, 106);"><i>-1</i></span>
          </span>
        </span>
      </el-option>
      <span slot="prefix">
        <!-- {{ option.reverse }} -->
        <span v-if="option.selected == 'num'" class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#26BF6A': '#F65252'}">1</i></span>
          <span class="preset-sample-title-element"><i style="color: #ECD432;">0</i></span>
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#F65252': '#26BF6A'}">-1</i></span>
        </span>
        <span v-else-if="option.selected == 'arraw'" class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#26BF6A': '#F65252'}"><svg-icon icon-class="arrowTop" /></i></span>
          <span class="preset-sample-title-element"><i style="color: #ECD432;"><svg-icon icon-class="arrowRight" /></i></span>
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#F65252': '#26BF6A'}"><svg-icon icon-class="arrowDown" /></i></span>
        </span>
        <span v-else-if="option.selected == 'caret'" class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#26BF6A': '#F65252'}"><svg-icon icon-class="markTop" /></i></span>
          <span class="preset-sample-title-element"><i style="color: #ECD432;"><svg-icon icon-class="markLine" /></i></span>
          <span class="preset-sample-title-element"><i :style="{'color':option.reverse?'#F65252': '#26BF6A'}"><svg-icon icon-class="markDown" /></i></span>
        </span>
        <span v-else-if="option.selected == 'bgNum'" class="preset-sample-title">
          <span class="preset-sample-title-element">
            <span class="text-bg-item" style="background-color: rgb(246, 82, 82);"><i>1</i></span>
          </span>
          <span class="preset-sample-title-element">
            <span class="text-bg-item" style="background-color: rgb(38, 191, 106);"><i>-1</i></span>
          </span>
        </span>
        <span v-else class="preset-sample-title">无</span>
      </span>
    </el-select>
  </div>
</template>

<script>
// import { boolean } from 'yargs'

export default {
  name: 'Title',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      val: ''
    }
  },
  methods: {
    // 检查多选状态
    changeSelected(val) {
      this.$emit('update:option', {
        ...this.option,
        selected: val
      })
    }
  }
}
</script>

<style lang="scss">

.quickStyleContrast{background: #424550; border-color: #6A6C74; width:240px; margin-left: -89px;
  .el-select-dropdown__item{ height: 24px;line-height: 24px;  padding: 0 10px; display: flex; align-items: center; width: 100%;justify-content:space-between; }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{background: #50525D; }
  .subtitle{ display: flex; justify-content: space-between;}
}
.text-bg-item {display:inline-block;width:32px;height:12px;color:#fff;font-size:12px;line-height:12px;text-align:center;}
.text-bg-item i{ transform: scale(.7);display: inline-block;}
.preset-sample-box .el-input__prefix{ width: calc(100% - 30px); background: #424550; height: 22px; margin: 1px; }

.preset-sample-title {display:flex;justify-content:space-between;align-items:center; width: 100%;}
.preset-sample-title-element {padding:0 8px;font-weight:700}
.preset-sample-title-element i {font-style:normal;font-size:12px}
.preset-sample-title-element i+i {margin-left:2px}
</style>
