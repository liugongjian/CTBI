<template>
  <div class="container">
    <div class="color" @click="handleShowColor">
      <span class="label">{{ title }}</span>
      <div class="color-select">
        <span>自定义</span>
        <svg-icon
          :icon-class="colorIcon"
          style="font-size: 20px"
        />
      </div>
    </div>
    <div v-show="showColorConfig" class="color-config">
      <div class="field">
        <label>字段项</label>
        <div>
          <div v-for="(item,index) in colorData" :key="index" class="item" :class="{active: active === index}" @click="changeActive(index)">
            <span class="box" :style="{backgroundColor: item.color}" />
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="color-container">
        <div>
          <label>色系</label>
        </div>
        <div class="color-box">
          <div v-for="(item,index) in defaultColor" :key="index" class="box" style="cursor:pointer;" :style="{backgroundColor: item}" @click="handleColor(item)">
            <svg-icon
              v-show="showSelected(item)"
              icon-class="selected"
              style="font-size: 16px; z-index:1"
            />
          </div>
        </div>
        <div class="setting">
          自定义 <el-color-picker v-model="colorValue" size="mini" @change="changeColorValue" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/optionUtils'
export default {
  name: 'ColorConfig',
  props: {
    colorData: {
      type: Array,
      default: () => ([]) // {name,color}
    },
    title: {
      type: String,
      default: '颜色设置'
    }
  },
  data () {
    return {
      colorIcon: 'down',
      showColorConfig: false,
      colorValue: null,
      active: 0,
      // 默认颜色
      defaultColor: ['#1a7dff', '#ff751a', '#16cad6', '#ffae0f', '#34ad8d', '#f593ad', '#8c90b8', '#96b1fa', '#ccb18f']
    }
  },
  methods: {
    showSelected (item) {
      return this.colorData[this.active]?.color === item
    },
    async handleShowColor () {
      this.colorIcon = this.colorIcon === 'down' ? 'upward' : 'down'
      this.showColorConfig = this.colorIcon === 'upward'
      await this.$emit('showColor')
      this.setActiveColor()
    },
    handleColor (item) {
      const data = deepClone(this.colorData)
      data[this.active].color = item
      this.$emit('update:color-data', data)
    },
    changeActive (index) {
      this.colorValue = null
      this.active = index
      this.setActiveColor()
    },
    // 将选中的字段颜色 添加到展示中
    setActiveColor () {
      if (!this.defaultColor.find(item => item === this.colorData[this.active].color)) {
        if (this.defaultColor.length >= 9) {
          this.defaultColor.shift()
        }
        this.defaultColor.unshift(this.colorData[this.active]?.color)
      }
    },
    changeColorValue (val) {
      this.handleColor(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
.color {
  display: flex;
  margin-top: 10px;
  .label {
    display: inline-block;
    min-width: 56px;
    margin-right: 5px;
  }
  .color-select {
    height: 24px;
    flex: 1;
    display: flex;
    align-items: center;
    border: 1px solid #5c606a;
    margin-right: 5px;
    padding-right: 5px;
    span {
      margin-left: 8px;
      flex: 1;
    }
  }

}
.color-config {
    display: flex;
    padding: 10px 5px;
    position: absolute;
    z-index: 999;
    width: 160px;
    left: 56px;
    background-color: #ffffff;
    .field {
      min-width: 77px;
      .item {
        display: flex;
      }
      .active {
        background-color: #e1e5ea;
      }
      .item:hover {
        background-color: #e1e5ea;
      }
    }
    .box {
      display: block;
      margin: 5px;
      width: 15px;
      height: 15px;
      background-color: #5c606a;
    }
    .color-box {
      display: flex;
      flex-wrap: wrap;
    }
    .color-container {
      flex: 1;
      .setting {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
