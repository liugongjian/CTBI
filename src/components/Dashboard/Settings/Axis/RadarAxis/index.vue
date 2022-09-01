<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 16:16:36
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <div class="flex-align-center">
      <div class="editor-item-title">最大值</div>
      <el-input-number
        v-model="option.maxValue"
        controls-position="right"
        :disabled="option.autoMaxValue"
        style="width: 100px"
      />
      <el-checkbox
        v-model="option.autoMaxValue"
        class="m-l-8"
        label="自动"
      />
    </div>
    <div class="flex-align-center m-t-12">
      <div class="editor-item-title">最小值</div>
      <el-input-number
        v-model="option.minValue"
        controls-position="right"
        :disabled="option.autoMinValue"
        style="width: 100px"
      />
      <el-checkbox
        v-model="option.autoMinValue"
        class="m-l-8"
        label="自动"
      />
    </div>
    <el-checkbox
      v-model="option.showCoordinates"
      class="m-t-12"
      label="显示轴标签"
    />
  </div>

</template>

<script>
export default {
  name: 'RadarAxis',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      coordinatesIcon: 'packup'
    }
  },
  methods: {
    changeCoordinates () {
      this.coordinatesIcon = this.coordinatesIcon === 'packup' ? 'an' : 'packup'
    }
  }
}
</script>

<style lang="scss" scoped>
.coordinates {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.75);
  // background-color: #eee;
}
</style>
