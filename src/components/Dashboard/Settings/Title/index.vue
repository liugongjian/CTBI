<!--
 * @Author: 黄璐璐
 * @Date: 2022-09-01 14:07:39
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-02 17:45:20
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="显示主标题"
    />
    <div
      class="editor-item-container"
      :class="{'box-disabled':!option.show}"
      style="display: flex"
    >
      <el-input v-model="option.text" maxlength="50" type="text" />
      <el-color-picker v-model="option.color" />
    </div>
    <div
      class="editor-item-size"
    >
      <div>尺寸：</div>
      <el-input-number v-model="option.size" style="width: 120px;" :precision="0" controls-position="right" label="标题尺寸" :min="14" :max="32">
        <template slot="append">.com</template>
      </el-input-number>
      <div style="margin-left: 10px;font-size: 14px;">px</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Title',
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
