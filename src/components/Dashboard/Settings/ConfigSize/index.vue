<template>
  <div>
    <div class="coordinates" @click="changeCoordinates">功能设置
      <svg-icon
        :icon-class="coordinatesIcon"
        style="font-size: 20px;"
      />
    </div>
    <div
      v-show="coordinatesIcon === 'packup'"
      class="editor-item-container"
    >
      <div>设置起点值</div>
      <div style="display: flex; align-items: center">
        <el-input-number
          v-model="option.start"
          controls-position="right"
          style="width: 100px"
        />
        固定值
      </div>
      <div>设置终点值</div>
      <div style="display: flex; align-items: center">
        <el-input-number
          v-model="option.end"
          controls-position="right"
          style="width: 100px"
        />
        固定值
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfigSize',
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
  background-color: #eee;
}
</style>
