<template>
  <div>
    <div class="coordinates editor-item-title" @click="changeCoordinates">坐标轴
      <svg-icon
        :icon-class="coordinatesIcon"
        style="font-size: 20px;"
      />
    </div>
    <div
      v-show="coordinatesIcon === 'packup'"
      class="editor-item-container"
    >
      <div style="display: flex; align-items: center; color: rgba(255, 255, 255, 0.75)">
        <span>最大值</span>
        <el-input-number
          v-model="option.maxValue"
          controls-position="right"
          :disabled="option.autoMaxValue"
          style="width: 100px"
        />
        <el-checkbox
          v-model="option.autoMaxValue"
          label="自动"
        />
      </div>
      <div style="display: flex;align-items: center;color: rgba(255, 255, 255, 0.75)">
        最小值
        <el-input-number
          v-model="option.minValue"
          controls-position="right"
          :disabled="option.autoMinValue"
          style="width: 100px"
        />
        <el-checkbox
          v-model="option.autoMinValue"
          label="自动"
        />
      </div>
      <el-checkbox
        v-model="option.showCoordinates"
        label="显示轴标签"
      />
    </div>
  </div>

</template>

<script>
export default {
  name: 'RadarCoordinates',
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
