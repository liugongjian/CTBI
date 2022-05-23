<template>
  <div class="editor-object-container">
    <div class="flex-align-center m-t-12" @keydown.8.stop="">
      <div class="editor-item-title" style="width: 36px">轴标题</div>
      <el-input v-model="option.title" style="flex: 1" />
    </div>
    <div class="flex-align-center m-t-12" @keydown.8.stop="">
      <div class="editor-item-title" style="width: 36px">单位</div>
      <el-input v-model="option.unit" style="flex: 1" />
    </div>
    <slot name="unit" />
    <el-checkbox
      v-model="option.showTitle"
      class="m-t-12"
      label="显示标题和单位"
    />
    <el-checkbox
      v-model="option.show"
      class="m-t-12"
      label="显示坐标轴"
    />
    <div class="color-row m-t-12">
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
      class="m-t-12"
    />
    <div class="m-t-12">
      <el-checkbox
        v-model="option.showSplit"
        label="显示网格线"
      />
    </div>
    <div class="color-row m-t-12">
      <el-dropdown :disabled="!option.showSplit" @command="handleSplitType">
        <div class="dropdown-link" :class="!option.showSplit ? 'box-disabled' : ''">
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
      class="m-t-12"
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
  }
  .dropdown-link{
    display: flex;
    justify-content: center;
    align-items:center;
    border: 1px solid rgba(221,221,221,0.25);
    padding: 0 2px;
    border-radius: 2px;
    height: 100%;
    width: 100%;
    i {
      font:#DCDFE6
    }
  }
}
</style>
