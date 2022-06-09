<template>
  <div class="editor-object-container">
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
      <div class="color">设置起点值</div>
      <el-radio-group v-model="option.startType">
        <el-radio label="fixed">固定值</el-radio>
        <el-radio label="dynamic">动态值</el-radio>
      </el-radio-group>
      <div style="display: flex; align-items: center">
        <el-input-number
          v-if="option.startType === 'fixed'"
          v-model="option.start"
          controls-position="right"
          style="width: 100px"
        />
        <template v-else>
          <el-select v-model="value" popper-class="setting-select" placeholder="请选择">
            <el-option
              v-for="item in fieldOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="option.dynamicStart.type" popper-class="setting-select" placeholder="请选择">
            <el-option
              v-for="item in aggregationOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </template>
      </div>
      <div class="color">设置终点值</div>
      <el-radio-group v-model="option.endType">
        <el-radio label="fixed">固定值</el-radio>
        <el-radio label="dynamic">动态值</el-radio>
      </el-radio-group>
      <div style="display: flex; align-items: center">
        <el-input-number
          v-if="option.endType === 'fixed'"
          v-model="option.end"
          controls-position="right"
          style="width: 100px"
        />
        <template v-else>
          <el-select v-model="value" popper-class="setting-select" placeholder="请选择">
            <el-option
              v-for="item in fieldOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="option.dynamicEnd.type" popper-class="setting-select" placeholder="请选择">
            <el-option
              v-for="item in aggregationOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </template>
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
      fieldOptions: [],
      coordinatesIcon: 'packup',
      aggregationOptions: [
        { name: '求和', value: 1 },
        { name: '最大值', value: 2 },
        { name: '最小值', value: 3 },
        { name: '平均值', value: 4 },
        { name: '计数', value: 5 }
      ],
      value: ''
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
.color {
    color: rgba(255, 255, 255, 0.75);
  }
</style>
