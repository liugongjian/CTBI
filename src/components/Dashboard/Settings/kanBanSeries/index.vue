<template>
  <div class="editor-object-container">
    <div class="editor-item-container">
      请选择系列
      <el-select v-model="option.series" placeholder="请选择">
        <el-option
          v-for="(item,index) in option.dataSeries"
          :key="index"
          :label="item.title"
          :value="item.title"
        />
      </el-select>
    </div>
    <div class="editor-item-container">
      指标数据值前后缀
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
  name: 'KanBanSeries',
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  .el-input {
    flex: 1;
    margin-left: 5px;
  }
}
</style>
