<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.Basic.Title.show"
      label="显示主标题"
    />
    <el-checkbox
      v-if="option.Basic.TestTitle.testShow"
      label="测试显示"
    />
    <div
      class="editor-item-container"
      :class="{'box-disabled':!option.Basic.Title.show}"
    >
      <el-input v-model="option.Basic.Title.text" />
      <el-input v-model="option.Basic.Title.color" />
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
