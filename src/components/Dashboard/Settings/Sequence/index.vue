<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">显示序号</el-checkbox>
    <el-input v-if="option.show" placeholder="序号" />
  </div>
</template>

<script>
export default {
  name: 'Sequence',
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
