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
      <p class="title-box formatting-title">快捷样式</p>
      <!-- 如果是显示三种 -->
      <div v-if="quickStyle.styleType == 'all'">
        <el-tabs tab-position="left" style="height: 200px;" class="formattingTabs">
          <el-tab-pane label="对比">
            <div>
              <div class="reverseBox">颜色翻转 <el-switch v-model="quickStyle.reverse" active-color="#13ce66" inactive-color="#393F4D" :width="30" /></div>
              <div v-if="quickStyle">
                <quickStyleContrast :option.sync="quickStyle" />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="数据条">TODO</el-tab-pane>
          <el-tab-pane label="色阶">TODO</el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="quickStyle.styleType == 'contrast'">
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
import quickStyleContrast from './quickStyleContrast'
import Title from './formattingTitle'
export default {
  name: 'Formatting',
  components: { Title, quickStyleContrast },
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
        console.log('111')
        return this.option.field.find(item => item.name === this.option.selected.name)?.quickStyle || ''
      },
      set(value) {
        console.log(value)
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
  .formattingSelect{background: #424550; border-color: #6A6C74; margin-top: -20px;
    .title{display:flex; align-items:center; height: 30px;}
    .el-select-dropdown__item{ height: 30px; line-height: 30px; padding: 0 10px;}
    // .el-select-dropdown__item.selected{ background: #50525D; }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{background: #50525D; }
  }
    // ::v-deep .el-input__prefix { left: 0; width: calc(100% - 28px);}
.editor-formatting .box{ border-bottom: 1px solid #4B4E59; padding-bottom: 10px; margin-bottom: 10px;}
.editor-formatting .box .title-box{}
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
</style>
