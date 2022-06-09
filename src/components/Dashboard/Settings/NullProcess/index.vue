<template>
  <div class="editor-object-container">
    <div class="editor-item-title">空值处理</div>
    <div class="editor-item-container">
      <el-radio-group v-model="option.emptyResolve">
        <el-radio label="skip">直接跨过</el-radio>
        <el-radio label="zero">置为0,不断开</el-radio>
        <el-radio label="break" class="m-t-12">线条断开</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NullProcess',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      seriesOption: null
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
