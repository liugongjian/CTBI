/*
 * @Author: sihaiyang
 * @Date: 2022-09-28 17:19:38
 * @Last Modified by: sihaiyang
 * @Last Modified time: 2022-09-28 17:53:43
 */

<template>
  <div class="editor-object-container">
    <div class="editor-item-size">内容样式</div>
    <div
      class="editor-item-container flex-align-center"
      :class="{'box-disabled':!option.show}"
    >
      <div class="editor-item-title">字体尺寸</div>
      <el-input-number v-model="option.size" style="width: 100px;" :precision="0" controls-position="right" label="标题尺寸" :min="14" :max="32" />
      <div style="margin-left: 10px;font-size: 14px;">px</div>
    </div>
    <!-- 字体颜色 -->
    <div
      class="editor-item-container flex-align-center"
      :class="{'box-disabled':!option.show}"
    >
      <div class="editor-item-title">字体颜色</div>
      <div class="flex-align-center">
        <el-color-picker v-model="option.color" />
      </div>
    </div>
    <!-- 背景颜色 -->
    <div
      class="editor-item-container flex-align-center"
      :class="{'box-disabled':!option.show}"
    >
      <div class="editor-item-title">背景颜色</div>
      <div class="flex-align-center">
        <el-color-picker v-model="option.background" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextAreaStyle',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style>
.editor-item-size{
  display: flex;
  font-size: 12px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  align-items: center;
  padding-left: 20px;
}
</style>
