<template>
  <div class="editor-object-container">
    <div class="box">
      每行最多个数
      <el-input v-model="option.line" placeholder="请输入内容" />
    </div>
    <div>
      <el-checkbox v-model="option.style">设置主指标字体样式</el-checkbox>
      <div v-for="(data,index) in option.fontSizeStyle" :key="index" class="editor-item-container box">
        {{ data.name }}
        <el-color-picker v-model="data.color" />
        <el-select v-model="data.fontSize" placeholder="请选择">
          <el-option
            v-for="item in fontSizeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div>
      <span>主/副指标组合指标块内位置</span>
      <div class="editor-item-container">
        <el-radio-group v-model="option.position">
          <el-radio label="center">横向居左</el-radio>
          <el-radio label="left">航向居中</el-radio>
        </el-radio-group>
      </div>
      <div class="editor-item-container">
        与指标对齐方式
        <el-radio-group v-model="option.align">
          <el-radio label="center">横向居左</el-radio>
          <el-radio label="left">航向居中</el-radio>
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
.box {
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
</style>
