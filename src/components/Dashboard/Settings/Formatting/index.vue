<!-- 功能型配置 -->
<template>
  <div class="editor-object-container editor-formatting">
    <div class="box">
      <p class="title-box">请选择系列</p>
      <el-select v-model="option.selected" placeholder="请选择" popper-class="formattingSelect">
        <el-option v-for="item in option.field" :key="item.name" :label="item.name" :value="item">
          <div class="title">
            <Title :item="item" />
          </div>
        </el-option>
        <span slot="prefix">
          <Title :item="option.selected" />
        </span>
      </el-select>
    </div>
    <div v-if="option.selected" class="box">
      <p v-if="quickStyle.styleType !== 'all'" class="title-box formatting-title">快捷样式</p>
      <!-- 如果是显示三种 -->
      <div v-if="quickStyle.styleType == 'all'">
        <el-tabs tab-position="left" style="height: 200px;" class="formattingTabs">
          <el-tab-pane label="对比">
            <div class="quickStyleTab">
              <div class="reverseBox">颜色翻转 <el-switch v-model="quickStyle.reverse" active-color="#13ce66" inactive-color="#393F4D" :width="30" /></div>
              <div v-if="quickStyle">
                <quickStyleContrast :option.sync="quickStyle" />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="数据条">
            <div class="quickStyleTab">
              <quickStyleBar :option.sync="quickStyle" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="色阶">
            <div class="quickStyleTab">
              <quickStyleColorScale :option.sync="quickStyle" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 只显示箭头 -->
      <div v-else-if="quickStyle.styleType == 'contrast'">
        <div>
          <div v-if="quickStyle">
            <quickStyleContrast :option.sync="quickStyle" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quickStyleColorScale from './quickStyleColorScale'
import quickStyleBar from './quickStyleBar'
import quickStyleContrast from './quickStyleContrast'
import Title from './formattingTitle'
export default {
  name: 'Formatting',
  components: { Title, quickStyleContrast, quickStyleBar, quickStyleColorScale },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      contrastList: []
    }
  },
  computed: {
    quickStyle: {
      get() {
        return this.option.field.find(item => item.name === this.option.selected.name)?.quickStyle || ''
      },
      set(value) {
        const data = this.option.field.find(item => item.name === this.option.selected.name)
        data.quickStyle = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title-box{  display: block;    font-size: 12px;    color: rgba(255, 255, 255, 0.75);}
.mt8{ margin-top: 8px;}
.box {  color: #FFF;  display: flex;  align-items: center;
  .el-input {    margin: 0 5px;    flex: 1  }
  .el-select {    margin: 0 5px;    flex: 1;  }
}
.ml5{ margin-left: 5px ;}
.reverseBox{ border-bottom:1px solid #4B4E59 ; padding:3px 10px; margin-bottom: 10px; font-size:12px; text-align: right;}
</style>
<style lang="scss">
.formatting-title{ padding: 5px 0; width:90px}
  .formattingSelect{background: #424550 !important; border-color: #6A6C74 !important; margin-top: -20px;
    .title{display:flex; align-items:center; height: 30px;}
    .el-select-dropdown__item{ height: 30px; line-height: 30px; padding: 0 10px;}
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{background: #50525D; }
  }
.editor-formatting .box{ border-bottom: 1px solid #4B4E59; padding-bottom: 10px; margin-bottom: 10px;}
.editor-formatting  .el-input--small .el-input__inner{ color:transparent; }
.formattingTabs { color: #FFF;}
.formattingTabs  .el-tabs__item{ height: 20px; line-height: 20px; font-size: 12px !important; padding-left: 10px;}
.formattingTabs  .el-tabs__header{ padding: 0 !important;}
.formattingTabs .is-active{ background:#50525D ;}
.reverseBox .el-switch__core{ height: 16px; }
.reverseBox .el-switch__core:after{ width: 14px; height: 14px; top: 0; left:0}
.reverseBox  .el-switch.is-checked .el-switch__core::after{ margin-left: -14px;}
.el-popper .popper__arrow{ display: none;}
.preset-style-selector-subitem{ height: 20px; width: 100%; display: flex; align-items: center; justify-content:space-between; }
.subtitle{ color: #FFFF; line-height: 28px; padding: 0 10px;}
.quickStyleTab{ padding-left: 10px;}
</style>
