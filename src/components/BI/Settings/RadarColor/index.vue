<template>
  <div class="editor-object-container">
    <div>
      <el-checkbox v-model="checked" @change="changeChecked">节点之间面积填充</el-checkbox>
      <div class="container">
        <div class="color" @click="changeColor">
          <span class="label">颜色设置</span>
          <div class="color-select">
            <span>自定义</span>
            <svg-icon
              :icon-class="colorIcon"
              style="font-size: 20px"
            />
          </div>
        </div>
        <div v-show="colorConfig" class="color-config">
          <div class="field">
            <label>字段项</label>
            <div>
              <div v-for="(item,index) in option.color" :key="index" class="item" :class="{active: active === index}" @click="changeActive(index)">
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
              <div v-for="(item,index) in colorData" :key="index" class="box" style="cursor:pointer;" :style="{backgroundColor: item}" @click="handleColor(item)">
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
    </div>
  </div>
</template>
<script>
import store from '@/store'
export default {
  name: 'RadarColor',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      checked: false,
      colorIcon: 'down',
      colorConfig: false,
      active: 0,
      colorValue: null,
      colorData: ['#1a7dff', '#ff751a', '#16cad6', '#ffae0f', '#34ad8d', '#f593ad', '#8c90b8', '#96b1fa', '#ccb18f']
    }
  },
  methods: {
    showSelected (item) {
      return this.option.color[this.active]?.color === item
    },
    changeColorValue (val) {
      this.option.color[this.active].color = val
    },
    handleColor (item) {
      this.option.color[this.active].color = item
    },
    changeActive (index) {
      this.colorValue = null
      this.active = index
      this.setActiveColor()
    },
    setActiveColor () {
      if (!this.colorData.find(item => item === this.option.color[this.active]?.color)) {
        if (this.colorData.length >= 9) {
          this.colorData.shift()
        }
        this.colorData.unshift(this.option.color[this.active]?.color)
      }
    },
    changeColor () {
      // console.log(store.state.app.layout, 'layout')
      this.$bus.$emit('reloadOption', store.state.app.currentLayoutId)
      this.colorIcon = this.colorIcon === 'down' ? 'upward' : 'down'
      this.colorConfig = this.colorIcon === 'upward'
      this.setActiveColor()
    },
    changeChecked (val) {
      this.option.areaStyle = val
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
    width: 56px;
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
