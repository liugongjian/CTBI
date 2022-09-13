<template>
  <div class="editor-object-container">
    <div class="editor-item-title">主题色填充</div>
    <!-- <el-popover
        placement="bottom-end"
        trigger="click"
      >
        <color-inner :option="option" />
        <div
          slot="reference"
          class="color-container"
          @click="handleArrow"
        >
          <div class="color-block">
            <span v-for="(item, index) in colorTheme[option.theme]" :key="index" class="color-row" :style="`background-color: ${item.value}`" />
          </div>
          <span class="label">{{ option.theme }}</span>
          <i
            v-if="arrowDown"
            class="el-icon-arrow-down el-icon--right"
          />
          <i
            v-else
            class="el-icon-arrow-up el-icon--right"
          />
        </div>
      </el-popover> -->
    <!-- <el-select
      v-model="option.colorClass"
      placeholder="请输入内容"
      popper-class="setting-select"
    >
      <el-option
        v-for="(item,index) in selectOptions"
        :key="index"
        class="select-option"
        :label="item.label"
        :value="item.label"
      >
        <div class="option-block" :style="{background: `linear-gradient(90deg, ${item.value[0]} 0%, ${item.value[1]} 100%)`}" />
      </el-option>
    </el-select> -->
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
  computed: {
    selectOptions() {
      return MapVisualColorOptions
    }
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
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
