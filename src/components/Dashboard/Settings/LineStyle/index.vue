<template>
  <div>
    <div class="editor-object-container">
      <div>线条样式</div>
      <el-radio
        v-model="option.type"
        :label="1"
      >曲线</el-radio>
      <el-radio
        v-model="option.type"
        :label="2"
      >直线</el-radio>
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
