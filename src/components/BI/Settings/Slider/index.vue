<template>
  <div>
    <div>数据点大小</div>
    <el-slider
      v-model="option.symbolSize"
      :min="option.minSize"
      :max="option.maxSize"
      @change="changeValue"
    />
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    changeValue (val) {
      this.option.symbolSize = val
    }
  }
}
</script>

<style scoped>

</style>
