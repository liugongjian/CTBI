<template>
  <div>
    <div class="editor-object-container">
      <div>图表展示方向</div>
      <el-radio
        v-model="option.direction"
        :label="1"
      >水平</el-radio>
      <el-radio
        v-model="option.direction"
        :label="2"
      >垂直</el-radio>
    </div>
    <div v-if="option.direction===2" class="editor-object-container">
      <div>图表对齐方式</div>
      <el-radio
        v-model="option.alignment"
        label="left"
      >左对齐</el-radio>
      <el-radio
        v-model="option.alignment"
        label="right"
      >右对齐</el-radio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartDirection',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
    }
  },
  computed: {
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
