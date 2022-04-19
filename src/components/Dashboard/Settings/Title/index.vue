<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.show"
      label="显示主标题"
    />
    <el-checkbox
      v-if="option.testShow"
      label="测试显示"
    />
    <div
      class="editor-item-container"
      :class="{'box-disabled':!option.show}"
    >
      <el-input v-model="option.text" />
      <el-input v-model="option.color" />
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
