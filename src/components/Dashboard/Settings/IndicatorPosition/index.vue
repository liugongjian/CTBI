<!--
 * @Author: 黄璐璐
 * @Date: 2022-07-29 14:45:36
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-07-29 18:15:22
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <div>
      <div class="editor-item-title">{{ option.title }}</div>
      <div class="editor-item-container">
        <el-radio-group v-model="option.position">
          <el-radio label="left">横向居左</el-radio>
          <el-radio label="center">横向居中</el-radio>
        </el-radio-group>
        <template v-if="option.position === 'center'">
          <div class="m-t-12">与指标对齐方式</div>
          <div class="editor-item-container">
            <el-radio-group v-model="option.align">
              <el-radio label="left">左对齐</el-radio>
              <el-radio label="center">居中对齐</el-radio>
            </el-radio-group>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndicatorPosition',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
