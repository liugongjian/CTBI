<template>
  <div class="preset-bar-box">
    <el-select v-model="val" placeholder="请选择" popper-class="quickStyleContrast" @change="changeSelected">
      <div class="subtitle">
        与0对比
        <div class="reverseBox">颜色翻转 <el-switch v-model="option.reverse" active-color="#13ce66" inactive-color="#393F4D" :width="30" /></div></div>
      <el-option value="">
        <span class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i style="color: #FFF;">无</i></span>
        </span>
      </el-option>
      <el-option value="colorGR">
        <div class="preset-style-selector-subitem">
          <span class="data-bar-item">
            <span class="data-bar-item-left">
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#F65252': '#2BC048'}" />
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#F65252': '#2BC048'}" />
            </span>
            <span class="data-bar-item-right" :style="{'background-color':option.reverse?'#2BC048': '#F65252'}" />
          </span>
        </div>
      </el-option>
      <el-option value="colorRB">
        <div class="preset-style-selector-subitem">
          <span class="data-bar-item">
            <span class="data-bar-item-left">
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#5DA7FF': '#FF6F6F'}" />
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#5DA7FF': '#FF6F6F'}" />
            </span>
            <span class="data-bar-item-right" :style="{'background-color':option.reverse?'#FF6F6F': '#5DA7FF'}" />
          </span>
        </div>
      </el-option>
      <el-option value="colorYG">
        <div class="preset-style-selector-subitem">
          <span class="data-bar-item">
            <span class="data-bar-item-left">
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#2BC971': '#FFCB0D'}" />
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#2BC971': '#FFCB0D'}" />
            </span>
            <span class="data-bar-item-right" :style="{'background-color':option.reverse?'#FFCB0D': '#2BC971'}" />
          </span>
        </div>
      </el-option>
      <span slot="prefix">
        <!-- {{ option.reverse }} -->
        <span v-if="option.selected == 'colorGR'" class="preset-style-selector-subitem">
          <span class="data-bar-item">
            <span class="data-bar-item-left">
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#F65252': '#2BC048'}" />
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#F65252': '#2BC048'}" />
            </span>
            <span class="data-bar-item-right" :style="{'background-color':option.reverse?'#2BC048': '#F65252'}" />
          </span>
        </span>
        <span v-else-if="option.selected == 'colorRB'" class="preset-style-selector-subitem">
          <span class="data-bar-item">
            <span class="data-bar-item-left">
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#5DA7FF': '#FF6F6F'}" />
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#5DA7FF': '#FF6F6F'}" />
            </span>
            <span class="data-bar-item-right" :style="{'background-color':option.reverse?'#FF6F6F': '#5DA7FF'}" />
          </span>
        </span>
        <span v-else-if="option.selected == 'colorYG'" class="preset-style-selector-subitem">
          <span class="data-bar-item">
            <span class="data-bar-item-left">
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#2BC971': '#FFCB0D'}" />
              <span class="data-bar-item-left-sub" :style="{'background-color':option.reverse?'#2BC971': '#FFCB0D'}" />
            </span>
            <span class="data-bar-item-right" :style="{'background-color':option.reverse?'#FFCB0D': '#2BC971'}" />
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

.preset-bar-box .el-input__prefix{ width: calc(100% - 30px); background: #424550; height: 22px; margin: 1px; }

.quickStyleContrast{background: #424550; border-color: #6A6C74; width:240px; margin-left: -89px;
  .el-select-dropdown__item{ height: 24px;line-height: 24px;  padding: 0 10px; display: flex; align-items: center; width: 100%;justify-content:space-between; }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{background: #50525D; }
  .subtitle{ display: flex; justify-content: space-between;}
}
.text-bg-item {display:inline-block;width:32px;height:12px;color:#fff;font-size:12px;line-height:12px;text-align:center;}
.text-bg-item i{ transform: scale(.7);display: inline-block;}

.preset-sample-title {display:flex;justify-content:space-between;align-items:center; width: 100%;}
.preset-style-selector-subitem{ width: 100%;}
.preset-style-selector-sublist{ width: 100%;}
.data-bar-item {display:flex;align-items:center;width:calc(100% - 16px);margin:0 8px;padding:6px 0}
.data-bar-item-right {display:inline-block;width:44%;height:4px}
.data-bar-item-left {display:flex;flex-direction:column;align-items:flex-end;width:56%}
.data-bar-item-left-sub {display:inline-block;height:4px}
.data-bar-item-left-sub:first-child {width:72%}
.data-bar-item-left-sub:last-child {width:100%;margin-top:4px}
</style>
