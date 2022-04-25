<template>
  <div>
    <div class="editor-object-container">
      <div>请选择系列</div>
      <el-select
        v-model="option.selectValue"
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
    <div
      v-if="option.remarkShow"
      class="editor-object-container flex-align-center"
    >
      <span>别名</span>
      <el-input
        v-model="option.remark"
        @input="setRemark"
      />
    </div>
    <div
      v-if="option.SeriesChartLabel"
      class="editor-object-container flex-align-center"
    >
      <el-checkbox
        v-model="option.SeriesChartLabel.check"
        label="显示图表标签"
      />
      <el-color-picker
        v-model="option.color"
        show-alpha
        :predefine="predefineColors"
        :disabled="!option.SeriesChartLabel.check"
      />
    </div>
    <div
      v-if="option.SeriesMaximum"
      class="editor-object-container"
    >
      <div>
        <el-checkbox
          v-model="option.SeriesMaximum.check"
          label="显示最值"
        />
      </div>
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
      // 颜色集合
      predefineColors: ['#1a7dff', '#ff751a', '#16cad6', '#ffae0f', '#34ad8d', '#f593ad', '#8c90b8', '#96b1fa', '#ccb18f']
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    // 选中某个系列名
    selectSeries () {
      // this.option.remark = this.option.selectValue
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          item.option.theme.SeriesSetting.SeriesSelect.seriesOption.forEach((j) => {
            if (j.value === this.option.selectValue) {
              this.option.remark = j.remark
              this.option.SeriesChartLabel.check = j.labelShow
              this.option.SeriesMaximum.check = j.isMax
            }
          })
        }
      })
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
    },
    // 给选中的系列 设置别名
    setRemark (val) {
      store.state.app.layout.forEach(item => {
        if (item.i === store.state.app.currentLayoutId) {
          item.option.theme.SeriesSetting.SeriesSelect.seriesOption.forEach((j) => {
            if (j.value === this.option.selectValue) {
              j.remark = val
            }
          })
          item.option.theme.ComponentOption.Color.color.forEach((j) => {
            if (j.name === this.option.selectValue) {
              j.remark = val
            }
          })
        }
      })
    }

  }

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px;
}
</style>
