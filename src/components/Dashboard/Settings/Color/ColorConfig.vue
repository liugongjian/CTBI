<template>
  <div ref="colorConfig" class="container">
    <div class="color">
      <span class="label">{{ option.title }}</span>
      <el-popover
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
      </el-popover>
    </div>
  </div>
</template>

<script>
import { colorTheme } from '@/constants/color.js'
import ColorInner from './ColorInner.vue'
export default {
  name: 'ColorConfig',
  components: { ColorInner },
  props: {
    option: {
      type: Object,
      default: () => { }

    }
  },
  data () {
    return {
      colorTheme,
      arrowDown: true
    }
  },
  methods: {
    handleArrow() {
      this.arrowDown = !this.arrowDown
    }
    // showSelected (item) {
    //   return this.colorData[this.active]?.color === item
    // },
    // async handleShowColor () {
    //   this.colorIcon = this.colorIcon === 'down' ? 'upward' : 'down'
    //   this.showColorConfig = this.colorIcon === 'upward'
    //   await this.$emit('showColor')
    //   this.setActiveColor()
    // },
    // handleColor (item) {
    //   const data = deepClone(this.colorData)
    //   data[this.active].color = item
    //   this.$emit('update:color-data', data)
    // },
    // changeActive (index) {
    //   this.colorValue = null
    //   this.active = index
    //   this.setActiveColor()
    // },
    // // 将选中的字段颜色 添加到展示中
    // setActiveColor () {
    //   if (!this.defaultColor.find(item => item === this.colorData[this.active].color)) {
    //     if (this.defaultColor.length >= 9) {
    //       this.defaultColor.shift()
    //     }
    //     this.defaultColor.unshift(this.colorData[this.active]?.color)
    //   }
    // },
    // changeColorValue (val) {
    //   this.handleColor(val)
    // }
  }
}
</script>

<style lang="scss" scoped>
.color {
  display: flex;
  align-items: center;
  .label {
    display: inline-block;
    margin-right: 8px;
    font-size: 12px;
    color: rgba(255,255,255,0.75);
    font-weight: 500;
  }
  .color-container{
    display: flex;
    align-items: center;
    border: 1px solid rgba(221,221,221,0.25);
    border-radius: 2px;
    padding: 5px 8px;
    padding-right: 0px;
    i{
      margin-right: 8px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.75);
      font-weight: 500;
    }
  }
  .color-block{
    width: 48px;
    height: 16px;
    line-height: 7px;
    margin-right: 8px;
    .color-row{
      display: inline-block;
      width: 8px;
      height: 8px
    }
  }
}
</style>
