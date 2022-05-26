<template>
  <div class="editor-object-container">
    <div class="editor-item-title">线条样式</div>
    <div class="editor-item-container">
      <el-radio-group v-model="option.type">
        <el-radio :label="1">
          <svg-icon icon-class="curve" style="margin-right:5px" />曲线
        </el-radio>
        <el-radio :label="2">
          <svg-icon icon-class="straightLine" style="margin-right:5px" />直线
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineStyle',
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
