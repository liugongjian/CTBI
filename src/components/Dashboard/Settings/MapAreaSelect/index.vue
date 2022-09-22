<!--
 * @Author: 何晋升
 * @Date: 2022-09-22 09:24:58
 * @LastEditors: 何晋升
 * @LastEditTime: 2022-09-22 09:24:58
 * @Description:
-->
<template>
  <div class="editor-object-container editor-fix">
    <div>
      <div class="editor-item-title">显示范围</div>
      <el-select v-model="option.area" placeholder="请选择" class="m-t-12" popper-class="setting-select">
        <el-option
          v-for="(item,index) in selectOptions"
          :key="index"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapAreaSelect',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      selectOptions: []
    }
  },
  mounted() {
    const mapJsons = require.context('../../mapJson', false, /\.js/)
    mapJsons.keys().forEach(file_name => {
      const label = file_name.replace('./', '').replace('.json', '')
      this.selectOptions.push({ label })
    })
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 24px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  .el-input {
    flex: 1;
    margin-left: 8px;
  }
}
</style>
