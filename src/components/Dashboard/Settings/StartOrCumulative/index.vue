<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-05 16:06:54
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-08 11:16:07
 * @Description:
-->
<template>
  <div
    class="editor-object-container"
  >
    <el-checkbox
      v-model="option.startValueCheck"
      label="显示起始值"
    />
    <div class="editor-item-container" :class="!option.startValueCheck ? 'box-disabled' : ''">
      <div class="flex-align-center">
        <div class="editor-item-title">起始值别名</div>
        <div>
          <el-input
            v-model="option.startValueRemark"
            placeholder=""
          />
        </div>
      </div>
      <div class="flex-align-center m-t-12">
        <div class="editor-item-title">起始值取值</div>
        <div>
          <input
            v-model="option.startValue"
            type="number"
            class="number-input"
          >
        </div>
      </div>
    </div>
    <el-checkbox
      v-model="option.cumulativeValueCheck"
      label="显示累计值"
      class="m-t-12"
    />
    <div class="editor-item-container flex-align-center" :class="!option.cumulativeValueCheck ? 'box-disabled' : ''">
      <div class="editor-item-title">累计值别名</div>
      <div class="flex-align-center">
        <el-input
          v-model="option.cumulativeValueRemark"
          placeholder=""
        />
      </div>
    </div>
    <el-checkbox
      v-model="option.tipsCheck"
      label="显示起始值/累计值Tips"
      class="m-t-12"
    />
  </div>
</template>

<script>
export default {
  name: 'StartOrCumulative',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  }
}
</script>
<style lang="scss" scoped>
.number-input{
  box-sizing: border-box;
  background: transparent;
  color: #fff;
  padding: 0 8px;
  width: 50px;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 2px;
}
</style>
