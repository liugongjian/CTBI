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
    <div
      v-if="option.remarkShow"
      class="editor-object-container flex-align-center"
    >
      <span>别名</span>
      <el-input
        v-model="option.remark"
        @input="(e)=>{setSeriesOption(e,'remark')}"
      />
    </div>
    <div
      v-if="option.SeriesChartLabel"
      class="editor-object-container flex-align-center"
    >
      <el-checkbox
        v-model="option.SeriesChartLabel.check"
        label="显示图表标签"
        @change="(e)=>{setSeriesOption(e,'showLabel')}"
      />
      <el-color-picker
        v-model="option.color"
        show-alpha
        :predefine="predefineColors"
        :disabled="!option.SeriesChartLabel.check"
        @change="(e)=>{setSeriesOption(e,'labelColor')}"
      />
    </div>
    <div class="editor-object-container">
      <div v-if="option.SeriesMark&&option.SeriesMark.show" style="display: flex" class="color-row">
        <el-checkbox v-model="option.SeriesMark.check" @change="(e)=>{setSeriesOption(e,'showMark')}">显示标记点</el-checkbox>
        <el-select
          v-model="option.SeriesMark.markType"
          placeholder="请输入内容"
          :disabled="!option.SeriesMark.check"
          @change="(e)=>{setSeriesOption(e,'markType')}"
        >
          <svg-icon
            slot="prefix"
            :icon-class="`${option.SeriesMark.markType}-mark`"
          />
          <el-option
            v-for="(item,index) in markTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">
              <svg-icon
                :icon-class="`${item.value}-mark`"
              /></span>

            <span style="float: right">{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>

    </div>
    <div
      v-if="option.SeriesMaximum"
      class="editor-object-container"
    >
      <div>
        <el-checkbox
          v-model="option.SeriesMaximum.check"
          label="显示最值"
          @change="(e)=>{setSeriesOption(e,'showMax')}"
        />
      </div>
    </div>
    <div class="editor-object-container">
      <div v-if="option.SeriesLine&&option.SeriesLine.show" style="display: flex" class="color-row">
        <span>线条样式</span>
        <el-select
          v-model="option.SeriesLine.lineType"
          placeholder="请输入内容"
          @change="(e)=>{setSeriesOption(e,'lineType')}"
        >
          <svg-icon
            slot="prefix"
            :icon-class="`${option.lineType}-line`"
          />
          <el-option
            v-for="(item,index) in lineTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <svg-icon
              :icon-class="`${item.value}-line`"
            />
          </el-option>
        </el-select>
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
      predefineColors: ['#1a7dff', '#ff751a', '#16cad6', '#ffae0f', '#34ad8d', '#f593ad', '#8c90b8', '#96b1fa', '#ccb18f'],
      markTypes: [{
        label: '圆形',
        value: 'circle'
      }, {
        label: '空心圆',
        value: 'emptyCircle'
      }, {
        label: '菱形',
        value: 'diamond'
      }, {
        label: '空心菱形',
        value: 'hollowDiamond'
      }],
      lineTypes: [{
        label: 'solid',
        value: 'solid'
      }, {
        label: 'dashed',
        value: 'dashed'
      }, {
        label: 'dotted',
        value: 'dotted'
      }]
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    // 选中某个系列名
    selectSeries () {
      this.option.seriesOption.forEach((item) => {
        if (item.value === this.option.selectValue) {
          this.option.remark = item.remark || ''
          if (this.option.SeriesChartLabel) {
            this.option.SeriesChartLabel.check = item.showLabel || false
            this.option.SeriesChartLabel.color = item.labelColor || ''
          }
          if (this.option.SeriesMaximum) {
            this.option.SeriesMaximum.check = item.showMax || false
          }

          if (this.option.SeriesMark && this.option.SeriesLine) {
            // 是副轴 // 判断是否是主轴
            if (this.option.selectValue.indexOf('-1') > -1) {
              this.option.SeriesMark.show = true
              this.option.SeriesLine.show = true
              this.option.SeriesMark.check = item.showMark || false
              this.option.SeriesMark.markType = item.markType || 'circle'
              this.option.SeriesLine.lineType = item.lineType || 'solid'
            }
          }

          if (this.option.SeriesMark && this.option.SeriesLine && this.option.SeriesMark.show && this.option.SeriesLine.show) {
            // 普通折线图
            this.option.SeriesMark.check = item.showMark || false
            this.option.SeriesMark.markType = item.markType || 'circle'
            this.option.SeriesLine.lineType = item.lineType || 'solid'
          }
        }
      })
    },
    // 图表标签、标记点、最值、线条样式存入对应的系列中
    setSeriesOption (val, type) {
      this.option.seriesOption.forEach((item) => {
        if (item.value === this.option.selectValue) {
          item[type] = val
        }
      })
      // 如果是设置别名 需要把别名更新到 配置设置 组件的color集合中
      if (type === 'remark') {
        store.state.app.layout.forEach(item => {
          if (item.i === store.state.app.currentLayoutId) {
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

}
</script>

<style lang="scss" scoped>
.label {
  margin-top: 20px;
}
</style>
