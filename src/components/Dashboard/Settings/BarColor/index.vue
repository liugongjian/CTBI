<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-05 16:06:54
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-08 10:03:06
 * @Description:
-->
<template>
  <div
    class="editor-object-container"
  >
    <div class="flex-align-center m-t-12">
      <div class="editor-item-title">起始值</div>
      <el-color-picker
        v-model="option.startValueColor"
      />
    </div>
    <div class="flex-align-center m-t-12">
      <div class="editor-item-title">累计值</div>
      <el-color-picker
        v-model="option.cumulativeValueColor"
      />
    </div>
    <div class="flex-align-center m-t-12">
      <div class="editor-item-title">增加</div>
      <el-color-picker
        v-model="option.increaseValueColor"
      />
    </div>
    <div class="flex-align-center m-t-12">
      <div class="editor-item-title">减少</div>
      <el-color-picker
        v-model="option.decreaseValueColor"
      />
    </div>

  </div>
</template>

<script>
export default {
  name: 'BarColor',
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
