<template>
  <div>
    <el-checkbox
      v-model="option['Basic']['Title'].isShow"
      label="显示主标题"
    />
    <el-checkbox
      v-if="option['Basic']['TestTitle'].testShow"
      label="测试显示"
    />
    <el-input
      v-model="option['Basic']['Title'].text"
      :disabled="!option['Basic']['Title'].isShow"
    />
    <el-input
      v-model="option['Basic']['Title'].color"
      :disabled="!option['Basic']['Title'].isShow"
    />
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
