<template>
  <div class="editor-object-container">
    <div class="flex-align-center">
      <div class="editor-item-title">每行展示个数设置(最多)</div>
      <el-select v-model="option.showNum" popper-class="setting-select" placeholder="请选择">
        <el-option
          v-for="item in showNumOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="m-t-12">
      <div class="editor-item-title">主指标</div>
      <div v-for="(item, index) in option.indicators" :key="index" class="editor-item-container flex-align-center">
        <div class="editor-item-title">{{ item.name }}</div>
        <el-color-picker v-model="item.color" class="m-r-8" />
        <el-select v-model="item.fontSize" popper-class="setting-select" placeholder="请选择">
          <el-option
            v-for="data in fontSizeOptions"
            :key="data"
            :label="data"
            :value="data"
          />
        </el-select>
      </div>
    </div>
    <div class="m-t-12">
      <el-checkbox v-model="option.value.show">显示当前值/目标值</el-checkbox>
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title" style="width: 95px">当前值-展示名称</div>
        <div style="flex: 1">
          <el-input v-model="option.value.current" placeholder="请输入内容" />
        </div>
      </div>
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title" style="width: 95px">目标值-展示名称</div>
        <div style="flex: 1">
          <el-input v-model="option.value.target" placeholder="请输入内容" />
        </div>
      </div>
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title">样式</div>
        <el-color-picker v-model="option.value.style.color" class="m-r-8" />
        <el-select v-model="option.value.style.fontSize" popper-class="setting-select" placeholder="请选择">
          <el-option
            v-for="data in fontSizeOptions"
            :key="data"
            :label="data"
            :value="data"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressStyle',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      showNumOptions: [1, 2, 3, 4],
      fontSizeOptions: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
