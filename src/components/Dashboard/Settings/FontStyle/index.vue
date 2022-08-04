<!--
 * @Author: 黄璐璐
 * @Date: 2022-07-29 14:25:17
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-03 16:22:40
 * @Description:
-->
<template>
  <div class="editor-object-container">
    <div>
      <el-checkbox v-if="option.show" v-model="option.check">{{ option.label }}</el-checkbox>
      <div
        v-for="(item,index) in option.data"
        :key="index"
        :class="!option.check ? 'box-disabled' : ''"
      >
        <div v-if="getDimensionFontSize(item.name)" class="editor-item-container dimension">
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
      <div v-if="getParataxis" :class="!option.check ? 'box-disabled' : ''">
        <div class="editor-item-container">主指标</div>
        <div class="editor-item-container">
          <div class="editor-item-title">指标名称</div>
          <el-color-picker
            v-model="option.target.nameColor"
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
        <div class="editor-item-container">
          <div class="editor-item-title">指标数值</div>
          <el-color-picker
            v-model="option.target.valColor"
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
      <div v-if="getDeputy" :class="!option.check ? 'box-disabled' : ''">
        <div class="editor-item-container">主指标</div>
        <div class="editor-item-container dimension" style="padding-left: 48px">
          <div class="editor-item-title">名称</div>
          <el-color-picker
            v-model="option.target.nameColor"
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

        <div class="editor-item-container dimension" style="padding-left: 48px">
          <div class="editor-item-title">数值</div>
          <el-color-picker
            v-model="option.target.valColor"
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

        <div class="editor-item-container">副指标</div>
        <div class="editor-item-container dimension" style="padding-left: 48px">
          <el-select
            v-model="option.secTarget.fontSize"
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

        <div class="editor-item-container dimension" style="padding-left: 48px">
          <div class="editor-item-title">名称</div>
          <el-color-picker
            v-model="option.secTarget.nameColor"
          />
          <div class="editor-item-title">数值</div>
          <el-color-picker
            v-model="option.secTarget.valColor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
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
  computed: {
    getParataxis() {
      return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)?.option.theme.StyleConfig.IndicatorDisplay?.relation === 'parataxis' || false
    },
    getDeputy() {
      return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)?.option.theme.StyleConfig.IndicatorDisplay?.relation === 'deputy' || false
    }
  },
  methods: {
    getDimensionFontSize(name) {
      if (name === '维度') {
        return store.state.app.layout.find(item => item.id === store.state.app.currentLayoutId)?.option.dataSource.Dimension.value.length > 0
      } else {
        return true
      }
    }
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
