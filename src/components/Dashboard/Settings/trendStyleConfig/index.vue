<!--
  指标趋势图配置
 -->
<template>
  <div class="editor-object-container">
    <div class="box">
      <p class="title-box">每行最多个数</p>
      <el-input-number v-model="option.lineNum" :min="1" :step-strictly="true" :max="10" :step="1" class="ml5" placeholder="请输入内容" controls-position="right" />
    </div>
    <div class="editor-object-container">
      <p class="title-box mt8"><el-checkbox v-model="option.style">设置主指标字体样式</el-checkbox></p>
      <div v-for="(data,index) in option.fontSizeStyle" :key="index" class="editor-item-container box">
        {{ data.name }}
        <el-color-picker v-model="data.color" class="pl10" />
        <el-select v-model="data.size" placeholder="请选择">
          <el-option
            v-for="item in fontSizeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div class="editor-object-container">
      <p class="title-box">主/副指标组合指标块内位置</p>
      <div class="editor-item-container">
        <el-radio-group v-model="option.position">
          <el-radio label="left">横向居左</el-radio>
          <el-radio label="center">横向居中</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="editor-object-container">
      <p class="title-box">与指标对齐方式</p>
      <div class="editor-item-container">
        <el-radio-group v-model="option.align">
          <el-radio label="left">横向居左</el-radio>
          <el-radio label="center">横向居中</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrendStyleConfig',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      fontSizeOptions: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    }
  }
}
</script>

<style lang="scss" scoped>
  .title-box{  display: block;    font-size: 12px;    color: rgba(255, 255, 255, 0.75);}
  .mt8{ margin-top: 8px;}
.box {
  color: #FFF;
  display: flex;
  align-items: center;
  .el-input {
    margin: 0 5px;
    flex: 1
  }
  .el-select {
    margin: 0 5px;
    flex: 1;
  }
}
.ml5{ margin-left: 5px ;}
</style>
