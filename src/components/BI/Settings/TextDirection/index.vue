<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.vertical"
      label="文字纵向显示"
    />
  </div>
</template>

<script>
export default {
  name: 'TextDirection',
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
