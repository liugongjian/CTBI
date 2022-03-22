<template>
  <div>
    <el-checkbox
      v-model="testShow"
      label="改变Title组件的多选框"
    />
  </div>
</template>

<script>

export default {
  name: 'TestTitle',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    testShow () {
      return this.$getParameter(this.option, 'Basic.TestTitle.testShow')
    }
  }
}
</script>

<style>
</style>
