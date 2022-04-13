<template>
  <div class="editor-object-container">
    <div @keydown.8.stop="">轴标题
      <el-input v-model="option.title" />
    </div>
    <div @keydown.8.stop="">单位
      <el-input v-model="option.unit" />
    </div>
    <el-checkbox
      v-model="option.showTitle"
      label="显示标题和单位"
    />
    <el-checkbox
      v-model="option.show"
      label="显示坐标轴"
    />
    <div class="color-row">
      <el-select v-model="option.lineWidth" :disabled="!option.show">
        <el-option
          v-for="(item,key) in pixels"
          :key="key"
          :value="item"
          :label="item+'px'"
        />
      </el-select>
      <el-color-picker v-model="option.lineColor" :disabled="!option.show" />
    </div>
    <el-checkbox
      v-model="option.showAxisLabel"
      label="显示轴标签"
    />
    <el-checkbox
      v-model="option.showSplit"
      label="显示网格线"
    />
    <div class="color-row">
      <el-select v-model="option.splitWidth" :disabled="!option.showSplit">
        <el-option
          v-for="(item,key) in pixels"
          :key="key"
          :value="item"
          :label="item+'px'"
        />
      </el-select>
      <el-color-picker v-model="option.splitColor" :disabled="!option.showSplit" />
    </div>
    <el-checkbox
      v-model="option.showTicks"
      label="显示刻度线"
    />
  </div>
</template>

<script>
import { pixels } from '../dics/constants'
export default {
  name: 'XAxis',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      pixels: pixels
    }
  },
  methods: {
    handleChange (val) {
      this.option.title = val
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.color-row{
    display: flex;
    &>div{
        margin: 2px 5px;
    }
}
</style>
