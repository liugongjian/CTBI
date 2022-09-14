<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-04 12:46:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-09-14 13:58:54
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <el-checkbox v-model="option.show">冻结</el-checkbox>
    <div :class="{'box-disabled':!option.show}" class="editor-item-container">
      <el-radio-group v-model="option.freezeChoose">
        <div>
          <el-radio label="head">智能(表头)</el-radio>
          <el-radio label="arrange">列</el-radio>
        </div>
      </el-radio-group>
    </div>
    <div class="arrange editor-item-container" :class="{'box-disabled': !(option.show&& option.freezeChoose==='arrange')}">
      <div class="arrange-type">
        <div>第一列到</div>
        <el-input-number v-model="option.positive" controls-position="right" class="m-t-8" />
      </div>
      <div class="arrange-type">
        <div>和从后往前到</div>
        <el-input-number v-model="option.reverse" controls-position="right" class="m-t-8" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Freeze',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return { }
  }
}
</script>

<style lang="scss" scoped>
.arrange {
  display: flex;
}
.arrange-type {
  flex: 1
}
::v-deep .el-input-number {
  width:80px
}
</style>
