<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-31 17:53:12
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <el-checkbox
      v-model="option.showFilter"
      label="开启指标筛选展示"
    />
    <!-- 数据字段名 -->
    <div class="editor-item-container" :class="{'box-disabled':!option.showFilter}">
      <el-select
        v-model="option.selectedIndicator"
        :disabled="!option.showFilter"
        :multiple="option.isMultiple"
        popper-class="setting-select"
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
