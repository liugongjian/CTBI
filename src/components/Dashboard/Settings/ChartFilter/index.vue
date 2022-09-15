<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-15 17:54:45
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
        :class="{
          disabled : option.selectedIndicator.length<=1,
        }"
        @remove-tag="handleRemove"
      >
        <el-option
          v-for="item in option.indicatorOption"
          :key="item.value"
          :disabled="option.selectedIndicator.length<=1 && option.selectedIndicator[0]==item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div style=" height: 30px;">
      <p v-if="option.selectedIndicator.length<=1" style="padding:8px 24px;opacity: 0.7;" class="editor-item-title"><i
        class="el-icon-warning-outline"
        style="font-size:12px;margin: 0 8px 8px -3px;"
      />最少选择一个</p>
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
  watch: {
  },
  mounted() {

  },
  methods: {
    handleRemove(e) {
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .disabled .el-tag__close{ display: none !important;}
</style>
