<template>
  <div>
    <div class="editor-object-container">
      <div>图表展示方向</div>
      <el-radio
        v-model="option.funnelTransform"
        :label="1"
      >水平</el-radio>
      <el-radio
        v-model="option.funnelTransform"
        :label="2"
      >垂直</el-radio>
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
