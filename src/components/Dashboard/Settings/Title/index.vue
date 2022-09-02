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
</style>
