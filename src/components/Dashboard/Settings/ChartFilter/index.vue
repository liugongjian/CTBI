<template>
  <div>
    <el-checkbox
      v-model="option.showFilter"
      label="开启指标筛选展示"
    />
    <!-- 数据字段名 -->
    <el-select v-model="option.filteredSery" :disabled="!option.showFilter">
      <el-option
        v-for="item in option.indicatorOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
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
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
