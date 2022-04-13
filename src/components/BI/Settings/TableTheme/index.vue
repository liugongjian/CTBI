<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.checked">自定义表格主题</el-checkbox>
    <div>
      <span>
        <img src="./image/table1.png" alt="">
      </span>
      <span>
        <img src="./image/table2.png" alt="">
      </span>
      <span>
        <img src="./image/table3.png" alt="">
      </span>
      <span>
        <img src="./image/table4.png" alt="">
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableTheme',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>

</style>
