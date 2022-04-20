<template>
  <div>
    <el-checkbox
      v-model="option.showFilter"
      label="开启指标筛选展示"
    />
    <!-- TODO: 得到数据字段名 -->
    <el-select v-model="option.filteredSery" :disabled="!option.showFilter">
      <el-option label="1" value="1" />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'ChartFilter',
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
