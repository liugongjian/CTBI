<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.showFilter"
      label="开启指标筛选展示"
    />
    <!-- 数据字段名 -->
    <div class="editor-item-container" :class="{'box-disabled':!option.showFilter}">
      <el-select
        v-model="option.filteredSery"
        :disabled="!option.showFilter"
        :multiple="option.isMultiple"
      >
        <el-option
          v-for="item in option.indicatorOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartFilter',
  components: {},
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
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
