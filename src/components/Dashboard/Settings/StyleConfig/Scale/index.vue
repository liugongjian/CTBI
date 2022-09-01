<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-25 16:24:41
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">显示内部刻度线</el-checkbox>
    <div class="editor-item-container">
      <el-radio-group v-model="option.type">
        <el-radio label="percentage">显示百分比</el-radio>
        <el-radio label="original">显示原值</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scale',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-left: 10px;
}
</style>
