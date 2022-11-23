<!--
 * @Author: 黄璐璐
 * @Date: 2022-05-06 22:42:01
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-02 09:24:58
 * @Description:
-->
<template>
  <div class="editor-object-container editor-fix">
    <div v-if="!option.hiddenSelect">
      <div class="editor-item-title">请选择系列</div>
      <el-select v-model="option.series" placeholder="请选择" class="m-t-12" popper-class="setting-select">
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
        <el-input v-model="prefix" placeholder="请填写(如¥)" />
      </div>
      <div class="box">
        后缀
        <el-input v-model="suffix" placeholder="请填写(如元)" />
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
        if (this.option.hiddenSelect) {
          return this.option.dataSeries[1]
        }
        return this.option.dataSeries.find(item => item.title === this.option.series)?.suffix || ''
      },
      set(value) {
        if (this.option.hiddenSelect) {
          this.option.dataSeries.splice(1, 1, value)
        } else {
          const data = this.option.dataSeries.find(item => item.title === this.option.series)
          data.suffix = value
        }
      }
    },
    prefix: {
      get() {
        if (this.option.hiddenSelect) {
          return this.option.dataSeries[0]
        }
        return this.option.dataSeries.find(item => item.title === this.option.series)?.prefix || ''
      },
      set(value) {
        if (this.option.hiddenSelect) {
          this.option.dataSeries.splice(0, 1, value)
        } else {
          const data = this.option.dataSeries.find(item => item.title === this.option.series)
          data.prefix = value
        }
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
