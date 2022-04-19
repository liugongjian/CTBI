<template>
  <div class="editor-object-container">
    <div>数据点大小</div>
    <div class="slider-container">
      <el-slider
        v-model="option.symbolSize"
        :min="option.minSize"
        :max="option.maxSize"
        @change="changeValue"
      />
    </div>
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
.slider-container {
  padding: 0 15px;
}
</style>
