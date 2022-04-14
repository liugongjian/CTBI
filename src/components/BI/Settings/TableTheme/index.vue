<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">自定义表格主题</el-checkbox>
    <div :class="{'box-disabled':!option.show}">
      <div class="table-theme">
        <div class="table-theme_type">
          <div><img src="./image/table1.png" alt=""></div>
          <div>斑马线</div>
        </div>
        <div class="table-theme_type">
          <div><img src="./image/table2.png" alt=""></div>
          <div>线框</div>
        </div>
      </div>
      <div class="table-theme">
        <div class="table-theme_type">
          <div><img src="./image/table3.png" alt=""></div>
          <div>简版</div>
        </div>
        <div class="table-theme_type">
          <div><img src="./image/table4.png" alt=""></div>
          <div>极简</div>
        </div>
      </div>
      <div><span>主色系</span></div>
      <el-radio-group v-model="option.colorType">
        <el-radio label="themeColor">主题色</el-radio>
        <el-radio label="gray">灰色</el-radio>
        <el-radio label="custom">自定义</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableTheme',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>
.table-theme {
  display: flex;
}
.table-theme_type {
  flex: 1;
  text-align: center;
}
</style>
