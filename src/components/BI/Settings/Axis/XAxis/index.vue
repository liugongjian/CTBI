<template>
  <div class="editor-object-container">
    <div @keydown.8.stop="">轴标题
      <el-input v-model="option.title" />
    </div>
    <div @keydown.8.stop="">单位
      <el-input v-model="option.unit" />
    </div>
    <slot name="unit" />
    <el-checkbox
      v-model="option.showTitle"
      label="显示标题和单位"
    />
    <el-checkbox
      v-model="option.show"
      label="显示坐标轴"
    />
    <div class="color-row">
      <el-dropdown :disabled="!option.show" @command="handleAxisType">
        <div class="dropdown-link" :class="!option.show ? 'disabled' : ''">
          <svg-icon
            :icon-class="`${option.lineType}-line`"
            style="font-size: 15px;"
          />
          <i class="el-icon-arrow-down el-icon--right" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(type,index) in lineTypes" :key="index" :command="type">
            <svg-icon
              :icon-class="`${type}-line`"
              style="font-size: 15px;"
            />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-select v-model="option.lineWidth" :disabled="!option.show">
        <el-option
          v-for="(item,key) in pixels"
          :key="key"
          :value="item"
          :label="item+'px'"
        />
      </el-select>
      <el-color-picker v-model="option.lineColor" :disabled="!option.show" />
    </div>
    <slot name="format" />
    <el-checkbox
      v-model="option.showAxisLabel"
      label="显示轴标签"
    />
    <el-checkbox
      v-model="option.showSplit"
      label="显示网格线"
    />
    <div class="color-row">
      <el-dropdown :disabled="!option.showSplit" @command="handleSplitType">
        <div class="dropdown-link" :class="!option.showSplit ? 'disabled' : ''">
          <svg-icon
            :icon-class="`${option.lineType}-line`"
            style="font-size: 15px;"
          />
          <i class="el-icon-arrow-down el-icon--right" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(type,index) in lineTypes" :key="index" :command="type">
            <svg-icon
              :icon-class="`${type}-line`"
              style="font-size: 15px;"
            />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-select v-model="option.splitWidth" :disabled="!option.showSplit">
        <el-option
          v-for="(item,key) in pixels"
          :key="key"
          :value="item"
          :label="item+'px'"
        />
      </el-select>
      <el-color-picker v-model="option.splitColor" :disabled="!option.showSplit" />
    </div>
    <el-checkbox
      v-model="option.showTicks"
      label="显示刻度线"
    />
  </div>
</template>

<script>
import { pixels, lineTypes } from '../dics/constants'
export default {
  name: 'XAxis',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      pixels: pixels,
      lineTypes: lineTypes
    }
  },
  methods: {
    handleAxisType (type) {
      this.option.lineType = type
    },
    handleSplitType (type) {
      this.option.splitType = type
    }
  }
}
</script>
<style lang="scss" scoped>
.color-row{
    display: flex;
    &>div{
        margin: 2px 5px;
    }
    .el-dropdown{
        min-width: 50px;
        .disabled{
            background: #F5F7FA;
        }
    }
    .dropdown-link{
        display: flex;
        justify-content: center;
        align-items:center;
        border: 1px solid #DCDFE6;
        padding: 0 2px;
        border-radius: 5px;
        height: 100%;
        width: 100%;
        i {
            font:#DCDFE6
        }
    }
}
</style>
