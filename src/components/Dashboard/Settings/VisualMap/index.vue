<template>
  <div class="editor-object-container">
    <div class="editor-item-title">主题色填充</div>
    <el-select
      v-model="option.colorClass"
      placeholder="请输入内容"
      popper-class="setting-select"
    >
      <div slot="prefix">
        <div ref="selectedColor" class="selected-block" />
      </div>
      <el-option
        v-for="(item,index) in MapVisualColorOptions"
        :key="index"
        class="select-option"
        :label="item.label"
        :value="item.label"
      >
        <div class="option-block" :style="{background: `linear-gradient(90deg, ${item.value[0]} 0%, ${item.value[1]} 100%)`}" />
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { MapVisualColorOptions } from '@/constants/constants'

export default {
  name: 'VisualMap',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      MapVisualColorOptions,
      arrowDown: false
    }
  },
  watch: {
    'option.colorClass': {
      handler(val) {
        this.$nextTick(() => {
          const { value } = this.MapVisualColorOptions.find(item => { return item.label === val })
          if (value && value.length > 1) {
            this.$refs.selectedColor.style.background = `linear-gradient(90deg, ${value[0]} 0%, ${value[1]} 100%)`
          }
        })
      },
      deep: true,
      immediate: true
    }
  }

}
</script>

<style lang="scss" scoped>
.selected-block {
  width: 187px;
    height: 18px;
    top: 4px;
    position: absolute;
}
.select-option {
height: 24px;

.option-block {
  height: 18px;
  position: relative;
  top: 3px;
  width: 100%;
}
}
</style>
