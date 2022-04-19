<template>
  <x-axis :option="option">
    <template v-slot:unit>
      <span>最大值</span>
      <div class="row" @keydown.8.stop="">
        <el-input v-model="option.max" :disabled="option.autoMax" />
        <el-checkbox
          v-model="option.autoMax"
          label="自动"
        />
      </div>
      <span>最小值</span>
      <div class="row" @keydown.8.stop="">

        <el-input v-model="option.min" :disabled="option.autoMin" />
        <el-checkbox
          v-model="option.autoMin"
          label="自动"
        />
      </div>
      <el-checkbox
        label="自动放大数值差异"
      />
    </template>
    <template v-slot:format>
      <div>轴标签显示格式设置</div>
      <el-radio-group v-model="option.formatType" size="small">
        <el-radio v-for="type in formatTypes" :key="type.label" :label="type.label">{{ type.cname }}</el-radio>
      </el-radio-group>
      <el-select v-if="option.formatType === '1'" v-model="option.lang" placeholder="请选择">
        <el-option v-for="item in lang" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div v-if="option.formatType === '2'">
        <el-radio-group v-model="option.numberFormat">
          <el-radio-button v-for="formt in numberFormats" :key="formt.label" :label="formt.label">{{ formt.cname }} </el-radio-button>
        </el-radio-group>
        <el-input-number v-model="option.numberDigit" controls-position="right" label="小数位数" :min="0" />
        <el-checkbox v-model="option.kSeperator" label="使用千分位分隔符" />
      </div>
      <el-input v-if="option.formatType === '3'" v-model="option.formatRegx" />
    </template>
  </x-axis>
</template>

<script>
import XAxis from '../XAxis/index.vue'
import { formatTypes, lang, numberFormats } from '../dics/constants'

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
      formatTypes: formatTypes,
      lang: lang,
      numberFormats: numberFormats
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
        max-width: 150px;
    }
}
</style>
