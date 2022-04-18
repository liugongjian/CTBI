<template>
  <div>
    <div class="editor-object-container">
      <div>请选择系列</div>
      <el-select
        v-model="option.selectValue"
        placeholder="请选择"
        @change="selectSeries"
      >
        <el-option
          v-for="item in option.seriesOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-if="option.remarkShow" class="editor-object-container" style="display: flex;align-items: center">
      <span>别名</span>
      <el-input v-model="option.remark" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeriesSelect',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      seriesOption: []
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    // 选中某个系列名
    selectSeries () {
      this.option.remark = this.option.selectValue
    }
  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px ;
}
</style>
