<template>
  <div>
    <el-checkbox
      v-model="options.data.testShow"
      label="改变Title组件的多选框"
      @change="updateOption('Basic','TestTitle',options)"
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
    options () {
      const id = this.option.id
      const data = this.option['Basic']['TestTitle']
      return { id, data }
    }
  }
}
</script>

<style>
</style>
