<template>
  <div>
    <div class="editor-object-container">
      <div
        v-if="option.show"
        style="display: flex"
        class="color-row"
      >
        <el-checkbox
          v-model="option.check"
          style="margin-right:8px"
          @change="handleSeriesMark"
        >显示标记点</el-checkbox>
        <el-select
          v-model="option.markType"
          placeholder="请输入内容"
          popper-class="setting-select"
          :disabled="!option.check"
          :class="{'box-disabled':!option.check}"
        >
          <svg-icon
            slot="prefix"
            :icon-class="`${option.markType}-mark`"
          />
          <el-option
            v-for="(item,index) in markTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">
              <svg-icon :icon-class="`${item.value}-mark`" />
            </span>

            <span style="float: right">{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>

    </div>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'SeriesMark',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      markTypes: [
        {
          label: '圆形',
          value: 'circle'
        },
        {
          label: '空心圆',
          value: 'emptyCircle'
        },
        {
          label: '菱形',
          value: 'diamond'
        }
        // {
        //   label: '空心菱形',
        //   value: 'hollowDiamond'
        // }
      ]
    }
  },
  mounted () {
  },
  methods: {
    // 联动改变 系列选择中的显示标记点复选框值
    handleSeriesMark (val) {
      store.state.app.layout.forEach(item => {
        if (item.id === store.state.app.currentLayoutId) {
          if (item.option.theme.SeriesSetting.SeriesSelect.SeriesMark) {
            item.option.theme.SeriesSetting.SeriesSelect.seriesOption.map((item) => {
              item.showMark = val
            })
            item.option.theme.SeriesSetting.SeriesSelect.SeriesMark.check = val
          }
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
