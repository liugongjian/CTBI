<!--
 * @Author: 黄璐璐
 * @Date: 2022-05-06 22:42:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-05 15:00:22
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="显示总计"
    />
    <!-- 自定义总计名 -->
    <div v-show="option.show" class="editor-item-container flex-align-center">
      <div class="editor-item-title">自定义总计名</div>
      <div class="flex-align-center">
        <el-input
          v-model="option.name"
          placeholder=""
          maxlength="50"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TotalShow',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dataSource: null
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
</style>
