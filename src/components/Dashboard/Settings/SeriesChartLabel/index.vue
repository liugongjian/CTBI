<template>
  <div>
    <div class="editor-object-container">
      <div style="display: flex; align-items: center">
        <el-checkbox
          v-model="option.check"
          label="显示图表标签"
        />
        <el-color-picker
          v-model="option.color"
          show-alpha
          :predefine="predefineColors"
          :disabled="!option.check"
        />
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'SeriesChartLabel',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      // 颜色集合
      predefineColors: ['#1a7dff', '#ff751a', '#16cad6', '#ffae0f', '#34ad8d', '#f593ad', '#8c90b8', '#96b1fa', '#ccb18f']
    }
  },
  mounted () {
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px;
}
</style>
