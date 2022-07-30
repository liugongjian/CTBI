<!--
 * @Author: 黄璐璐
 * @Date: 2022-05-06 22:42:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-07-29 11:16:02
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <div>
      <div class="editor-item-title">请选择系列</div>
      <el-select v-model="option.series" placeholder="请选择" class="m-t-12">
        <el-option
          v-for="(item,index) in option.dataSeries"
          :key="index"
          :label="item.title"
          :value="item.title"
        />
      </el-select>
    </div>
    <div class="m-t-12">
      <div class="editor-item-title">指标数据值前后缀</div>
      <div class="box">
        前缀
        <el-input v-model="prefix" placeholder="请输入内容" />
      </div>
      <div class="box">
        后缀
        <el-input v-model="suffix" placeholder="请输入内容" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndicatorSeries',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    suffix: {
      get() {
        return this.option.dataSeries.find(item => item.title === this.option.series)?.suffix || ''
      },
      set(value) {
        const data = this.option.dataSeries.find(item => item.title === this.option.series)
        data.suffix = value
      }
    },
    prefix: {
      get() {
        return this.option.dataSeries.find(item => item.title === this.option.series)?.prefix || ''
      },
      set(value) {
        const data = this.option.dataSeries.find(item => item.title === this.option.series)
        data.prefix = value
      }
    }
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
