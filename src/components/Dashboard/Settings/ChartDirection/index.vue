<template>
  <div>
    <div class="editor-object-container">
      <div class="editor-item-title">图表展示方向</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.direction">
          <el-radio :label="1">水平</el-radio>
          <el-radio :label="2">垂直</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div v-if="option.direction===2" class="editor-object-container">
      <div class="editor-item-title">图表对齐方式</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.alignment">
          <el-radio label="left">左对齐</el-radio>
          <el-radio label="right">右对齐</el-radio>
        </el-radio-group>
      </div>
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
