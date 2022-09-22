<template>
  <div class="preset-bar-box">
    <el-select v-model="val" placeholder="请选择" popper-class="quickStyleContrast" @change="changeSelected">
      <el-option value="">
        <span class="preset-style-selector-subitem">
          <span class="preset-sample-title-element"><i style="color: #FFF;">无</i></span>
        </span>
      </el-option>
      <div class="subtitle">
        渐变
      </div>
      <el-option value="opt11">
        <div class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="background: linear-gradient(90deg, rgb(147, 203, 248) 0%, rgb(24, 149, 248) 100%); width: 100%;" />
          </span>
        </div>
      </el-option>
      <el-option value="opt12">
        <div class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="background: linear-gradient(90deg, rgb(104, 160, 255) 0%, rgb(255, 111, 111) 100%); width: 100%;" />
          </span>
        </div>
      </el-option>
      <el-option value="opt13">
        <div class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="background: linear-gradient(90deg, rgb(109, 224, 160) 0%, rgb(255, 203, 104) 50%, rgb(255, 116, 132) 100%); width: 100%;" />
          </span>
        </div>
      </el-option>
      <div class="subtitle">
        二阶
      </div>
      <el-option value="opt21">
        <div class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="width: 50%; background-color: rgb(255, 219, 78);" />
            <span class="color-gradation-item-sub" style="width: 50%; background-color: rgb(255, 173, 40);" />
          </span>
        </div>
      </el-option>
      <div class="subtitle">
        三阶
      </div>
      <el-option value="opt31">
        <div class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="width: 33.3333%; background-color: rgb(179, 231, 255);" />
            <span class="color-gradation-item-sub" style="width: 33.3333%; background-color: rgb(124, 185, 255);" />
            <span class="color-gradation-item-sub" style="width: 33.3333%; background-color: rgb(68, 139, 255);" />
          </span>
        </div>
      </el-option>

      <span slot="prefix">
        <!-- {{ option.reverse }} -->
        <span v-if="option.selected == 'opt11'" class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="background: linear-gradient(90deg, rgb(147, 203, 248) 0%, rgb(24, 149, 248) 100%); width: 100%;" />
          </span>
        </span>
        <span v-else-if="option.selected == 'opt12'" class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="background: linear-gradient(90deg, rgb(104, 160, 255) 0%, rgb(255, 111, 111) 100%); width: 100%;" />
          </span>
        </span>
        <span v-else-if="option.selected == 'opt21'" class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="width: 50%; background-color: rgb(255, 219, 78);" />
            <span class="color-gradation-item-sub" style="width: 50%; background-color: rgb(255, 173, 40);" />
          </span>
        </span>
        <span v-else-if="option.selected == 'opt31'" class="preset-style-selector-subitem">
          <span class="color-gradation-item">
            <span class="color-gradation-item-sub" style="width: 33.3333%; background-color: rgb(179, 231, 255);" />
            <span class="color-gradation-item-sub" style="width: 33.3333%; background-color: rgb(124, 185, 255);" />
            <span class="color-gradation-item-sub" style="width: 33.3333%; background-color: rgb(68, 139, 255);" />
          </span>
        </span>
        <span v-else class="preset-sample-title">无</span>
      </span>
    </el-select>
  </div>
</template>

<script>
// import { boolean } from 'yargs'

export default {
  name: 'Title',
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      val: ''
    }
  },
  methods: {
    // 检查多选状态
    changeSelected(val) {
      this.$emit('update:option', {
        ...this.option,
        selected: val
      })
    }
  }
}
</script>

<style lang="scss">

.preset-bar-box .el-input__prefix{ width: calc(100% - 30px); background: #424550; height: 22px; margin: 1px; }

.quickStyleContrast{background: #424550; border-color: #6A6C74; width:240px; margin-left: -89px;
  .el-select-dropdown__item{ height: 24px;line-height: 24px;  padding: 0 10px; display: flex; align-items: center; width: 100%;justify-content:space-between; }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{background: #50525D; }
  .subtitle{ display: flex; justify-content: space-between;}
}
.text-bg-item {display:inline-block;width:32px;height:12px;color:#fff;font-size:12px;line-height:12px;text-align:center;}
.text-bg-item i{ transform: scale(.7);display: inline-block;}

.preset-sample-title {display:flex;justify-content:space-between;align-items:center; width: 100%;}
.preset-style-selector-subitem{ width: 100%;}
.preset-style-selector-sublist{ width: 100%;}

.color-gradation-item {display:flex;width:calc(100% - 16px);margin:0 8px;padding:9px 0}
.color-gradation-item-sub {display:inline-block;height:6px}
</style>
