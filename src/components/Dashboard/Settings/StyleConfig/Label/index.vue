<template>
  <div class="editor-object-container">
    <div class="editor-item-title">数据主标签展示</div>
    <div class="editor-item-container">
      <el-radio-group v-model="option.format">
        <el-radio :label="true">显示指针值</el-radio>
        <el-radio :label="false">显示百分比</el-radio>
      </el-radio-group>
    </div>
    <div class="editor-item-container flex-align-center">
      <div class="editor-item-title">名称</div>
      <el-color-picker v-model="option.name.color" class="m-r-8" />
      <el-select v-model="option.name.fontSize" popper-class="setting-select" class="font-select" placeholder="请选择">
        <el-option
          v-for="(item,index) in fontSizeOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="editor-item-container flex-align-center">
      <div class="editor-item-title">数值</div>
      <el-color-picker v-model="option.value.color" class="m-r-8" />
      <el-select v-model="option.value.fontSize" popper-class="setting-select" class="font-select" placeholder="请选择">
        <el-option
          v-for="(item,index) in fontSizeOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div v-show="!option.format" class="editor-item-container flex-align-center">
      <div class="editor-item-title">设置完成占比小数位数</div>
      <el-select v-model="option.decimal" popper-class="setting-select" class="font-select" placeholder="请选择">
        <el-option
          v-for="(item,index) in decimalOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div>
      <div class="m-t-12">
        <el-checkbox v-model="option.deputy.show">显示数据副标签</el-checkbox>
      </div>
      <div class="editor-item-container flex-align-center">
        <div class="editor-item-title">样式</div>
        <el-color-picker v-model="option.deputy.color" class="m-r-8" />
        <el-select v-model="option.deputy.fontSize" popper-class="setting-select" class="font-select" placeholder="请选择">
          <el-option
            v-for="(item,index) in fontSizeOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div v-show="option.format" class="editor-item-container flex-align-center">
        <div class="editor-item-title">设置完成占比小数位数</div>
        <el-select v-model="option.deputy.decimal" popper-class="setting-select" placeholder="请选择">
          <el-option
            v-for="(item,index) in decimalOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Label',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      fontSizeOptions: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
      decimalOptions: [0, 1, 2]
    }
  }
}
</script>

<style lang="scss" scoped>
.color {
  color: rgba(255, 255, 255, 0.75);
}
</style>
