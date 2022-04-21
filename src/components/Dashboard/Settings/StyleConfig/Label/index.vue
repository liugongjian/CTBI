<template>
  <div class="editor-object-container">
    数据主标签展示
    <el-radio-group v-model="option.format">
      <el-radio :label="true">显示指针值</el-radio>
      <el-radio :label="false">显示百分比</el-radio>
    </el-radio-group>
    <div class="box">
      <label>名称</label>
      <el-color-picker v-model="option.name.color" />
      <el-select v-model="option.name.fontSize" class="font-select" placeholder="请选择">
        <el-option
          v-for="(item,index) in fontSizeOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="box">
      <label>数值</label>
      <el-color-picker v-model="option.value.color" />
      <el-select v-model="option.value.fontSize" class="font-select" placeholder="请选择">
        <el-option
          v-for="(item,index) in fontSizeOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div v-show="!option.format" class="box">
      <label>设置完成占比小数位数</label>
      <el-select v-model="option.decimal" class="font-select" placeholder="请选择">
        <el-option
          v-for="(item,index) in decimalOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div>
      <el-checkbox v-model="option.deputy.show">显示数据副标签</el-checkbox>
      <div class="box">
        <label>样式</label>
        <el-color-picker v-model="option.deputy.color" />
        <el-select v-model="option.deputy.fontSize" class="font-select" placeholder="请选择">
          <el-option
            v-for="(item,index) in fontSizeOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div v-show="option.format" class="box">
        <label>设置完成占比小数位数</label>
        <el-select v-model="option.deputy.decimal" class="font-select" placeholder="请选择">
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
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  .font-select {
    width: 80px;
  }
  label {
    margin-left: 10px;
  }
  .el-color-picker {
    margin: 0 5px;
  }
}
</style>
