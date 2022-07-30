<!--
 * @Author: 黄璐璐
 * @Date: 2022-07-29 14:14:40
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-07-29 17:48:47
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <div class="editor-item-title">多指标展示形式</div>
    <div class="editor-item-container">
      <el-radio-group v-model="option.moreRelation">
        <el-radio label="line">左右滑动</el-radio>
        <el-radio label="lineBreak">换行平铺</el-radio>
      </el-radio-group>
    </div>
    <div class="lineNum">
      <div class="editor-item-title">每行最多</div>
      <el-input-number
        v-model="option.lineNum"
        controls-position="right"
        :min="1"
        :max="99"
      />
    </div>
    <div v-if="option.dimensionShow" class="m-t-12">
      <el-checkbox v-model="option.dimension">显示维度名称</el-checkbox>
    </div>
    <div v-if="option.indicatorsShow" class="m-t-12">
      <el-checkbox v-model="option.indicators">显示主指标名称</el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndicatorDisplay',
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
.lineNum {
  display: flex;
  align-items: center;
  margin-top: 12px;
  .el-input-number {
    flex: 1;
  }
}
.dimension {
  display: flex;
  align-items: center;
  .el-color-picker {
    margin: 0 5px;
  }
  .w-select {
    flex: 1;
  }
}
.svgValue {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 24px;
  margin-left: 5px;
  background-color: #686e6e;
}
</style>
