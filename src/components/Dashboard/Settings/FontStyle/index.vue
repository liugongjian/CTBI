<!--
 * @Author: 黄璐璐
 * @Date: 2022-07-29 14:25:17
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-07-29 15:51:05
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <div>
      <el-checkbox v-if="option.show" v-model="option.check">{{ option.label }}</el-checkbox>
      <div
        v-for="(item,index) in option.data"
        :key="index"
      >
        <div class="editor-item-container dimension">
          <div class="editor-item-title">{{ item.name }}</div>
          <el-color-picker
            v-model="item.color"
          />
          <el-select
            v-model="item.fontSize"
            placeholder="请选择"
            popper-class="setting-select"
          >
            <el-option
              v-for="data in fontSizeOptions"
              :key="data"
              :label="data"
              :value="data"
            />
          </el-select>
        </div>
      </div>
      <div v-if="option.mainIndicatorShow">
        <div class="editor-item-container">主指标</div>
        <div class="editor-item-container dimension">
          <div class="editor-item-title">名称</div>
          <el-color-picker
            v-model="option.target.nameColor"
            :disabled="!option.show"
          />
          <el-select
            v-model="option.target.nameFontSize"
            placeholder="请选择"
            popper-class="setting-select"
          >
            <el-option
              v-for="data in fontSizeOptions"
              :key="data"
              :label="data"
              :value="data"
            />
          </el-select>
        </div>

        <div class="editor-item-container dimension">
          <div class="editor-item-title">数值</div>
          <el-color-picker
            v-model="option.target.valColor"
            :disabled="!option.show"
          />
          <el-select
            v-model="option.target.valFontSize"
            placeholder="请选择"
            popper-class="setting-select"
          >
            <el-option
              v-for="data in fontSizeOptions"
              :key="data"
              :label="data"
              :value="data"
            />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FontStyle',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      fontSizeOptions: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dimension {
  display: flex;
  align-items: center;
  .el-color-picker {
    margin: 0 5px;
  }
}
</style>
