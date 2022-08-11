<template>
  <x-axis :option="option">
    <template v-slot:unit>
      <div class="flex-align-center row m-t-12" @keydown.8.stop="">
        <div class="editor-item-title" style="width: 36px" :class="option.autoMax ? 'box-disabled' : ''">最大值</div>
        <el-input v-model="option.max" :disabled="option.autoMax" :class="option.autoMax ? 'box-disabled' : ''" />
        <el-checkbox
          v-model="option.autoMax"
          label="自动"
          :disabled="option.autoEnlarge"
          :class="option.autoEnlarge ? 'box-disabled' : ''"
        />
      </div>
      <div class="flex-align-center row m-t-12" @keydown.8.stop="">
        <div class="editor-item-title" style="width: 36px" :class="option.autoMin ? 'box-disabled' : ''">最小值</div>
        <el-input v-model="option.min" :disabled="option.autoMin" :class="option.autoMin ? 'box-disabled' : ''" />
        <el-checkbox
          v-model="option.autoMin"
          label="自动"
          :disabled="option.autoEnlarge"
          :class="option.autoEnlarge ? 'box-disabled' : ''"
        />
      </div>
      <el-checkbox
        v-model="option.autoEnlarge"
        class="m-t-12"
        label="自动放大数值差异"
      />
    </template>
    <template v-slot:format>
      <div class="editor-object-container m-t-12">
        <div class="editor-item-title">轴标签显示格式设置</div>
        <div
          class="editor-item-container"
        >
          <el-radio-group v-model="option.formatType" size="small">
            <el-radio label="1">自动适配</el-radio>
            <el-radio label="2">自定义适配</el-radio>
            <el-radio label="3" class="m-t-12">手动输入</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="option.formatType === '1'" class="p-l-24">
        <el-select v-model="option.lang" placeholder="请选择" popper-class="setting-select">
          <el-option label="自动适配（中文）" value="chinese-simplified" />
          <el-option label="自动适配（繁体）" value="chinese-complicated" />
          <el-option label="自动适配（英文）" value="english" />
        </el-select>
      </div>

      <div
        v-if="option.formatType === '2'"
        class="editor-item-container m-t-12"
      >
        <el-radio-group v-model="option.numberFormat">
          <el-radio-button label="number">#数值 </el-radio-button>
          <el-radio-button label="percent">%百分比 </el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="option.formatType === '2'" class="editor-item-container flex-align-center">
        <span class="editor-item-title" style="width: 56px">小数位数</span>
        <el-input-number v-model="option.numberDigit" controls-position="right" label="小数位数" :min="0" :max="5" />
      </div>
      <div v-if="option.formatType === '2'" class="editor-item-container">
        <el-checkbox v-model="option.kSeperator" label="使用千分位分隔符" />
      </div>
      <el-input v-if="option.formatType === '3'" v-model="option.formatRegx" placeholder="例如 #,##0.00%" class="editor-item-container" />
    </template>
  </x-axis>
</template>

<script>
import XAxis from '../XAxis/index.vue'

export default {
  name: 'YAxis',
  components: { XAxis },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  methods: {}

}
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-input{
    width: 112px;
  }
}
</style>
