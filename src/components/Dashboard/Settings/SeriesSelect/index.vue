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
import store from '@/store'
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
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId && item.option.theme.SeriesSetting.SeriesMark && item.option.theme.SeriesSetting.SeriesLine) {
          // 是副轴 // 判断是否是主轴
          if (item.option.theme.SeriesSetting.SeriesSelect.selectValue.indexOf('-1') > -1) {
            item.option.theme.SeriesSetting.SeriesMark.show = true
            item.option.theme.SeriesSetting.SeriesLine.show = true
          } else {
            item.option.theme.SeriesSetting.SeriesMark.show = false
            item.option.theme.SeriesSetting.SeriesLine.show = false
          }
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px ;
}
</style>
