<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">显示列标题</el-checkbox>
    <div class="flex-align-center m-t-12" @keydown.8.stop="">
      <div class="editor-item-title" style="width: 65px">top3样式</div>
      <el-select
        v-model="option.selectValue"
        class="m-t-12"
        popper-class="setting-select"
        placeholder="请选择"
      >
        <el-option
          v-for="item in option.seriesOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="flex-align-center m-t-12" @keydown.8.stop="">
      <div class="editor-item-title" style="width: 65px">排序列名称</div>
      <el-input v-model="option.title" style="flex: 1" />
    </div>
    <div class="editor-item-title">
      数据显示方式
    </div>
    <el-radio-group v-model="option.format">
      <el-radio label="all">全部显示</el-radio>
      <el-radio label="databar">仅数据条</el-radio>
      <el-radio label="number">仅数字</el-radio>
    </el-radio-group>
    <div class="editor-item-title">
      数值显示位置
    </div>
    <el-radio-group v-model="option.position">
      <el-radio label="right">数据条右侧</el-radio>
      <el-radio label="left">数据条左侧</el-radio>
    </el-radio-group>
    <div class="editor-item-title">
      数据相同时并列处理
    </div>
    <el-radio-group v-model="option.rank">
      <el-tooltip
        class="item"
        effect="dark"
        content="排名"
        placement="top"
      >
        <el-radio :label="true">排名</el-radio>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="占用名次"
        placement="top"
      >
        <i
          class="el-icon-warning-outline"
          style="font-size:12px; color: rgba(255, 255, 255, 0.75); margin: 0 8px 8px -3px;"
        />
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="密集排名"
        placement="top"
      >
        <el-radio :label="false">密集排名</el-radio>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="不占用名次"
        placement="top"
      >
        <i
          class="el-icon-warning-outline"
          style="font-size:12px; color: rgba(255, 255, 255, 0.75); margin: 0 8px 8px -3px;"
        />
      </el-tooltip>
    </el-radio-group>
    <div class="editor-item-title">
      数据条颜色
    </div>
    <el-color-picker
      v-model="option.color"
    />
  </div>
</template>

<script>
export default {
  name: 'Rank',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-left: 10px;
}
</style>
