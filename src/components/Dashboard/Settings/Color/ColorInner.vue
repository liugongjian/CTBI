<template>
  <div class="color-inner">
    <div class="color-innner-header">
      <el-popover
        placement="top"
        trigger="click"
        popper-class="color-popover"
      >
        <div v-for="(val,key,index) in colorTheme" :key="index">
          <div class="color-container" :class="key===option.theme?'active':''" @click="changeTheme(key)">
            <div class="color-block">
              <span v-for="(item, i) in val" :key="i" class="color-row" :style="`background-color: ${item.value}`" />
            </div>
            <span class="label" :class="key===option.theme?'active':''">{{ key }}</span>
          </div>
        </div>
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
    <div class="color-innner-content">
      <div v-for="(item,index) in option.color" :key="index">
        <div v-if="item.name" class="item">
          <el-color-picker v-model="item.color" />
          <span class="label">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { colorTheme } from '@/constants/color.js'
export default {
  name: 'ColorInner',
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
  mounted () {
  },
  methods: {
    handleArrow() {
      this.arrowDown = !this.arrowDown
    },
    // 改变主题
    changeTheme (key) {
      this.option.theme = key
      this.option.color = this.option.color.map((item, index) => {
        item.color = colorTheme[key][index].value
        return item
      })
      this.$forceUpdate()
    }
  }

}
</script>
<style lang="scss" scoped>
.color-inner {
  margin: -12px;
  .color-innner-header{
    border-bottom: 1px solid rgba(0,0,0,.15);
    padding: 8px 16px;
    position: relative;
  }
  .label {
    display: inline-block;
    margin-right: 8px;
    font-size: 12px;
    font-weight: 500;
    font-size: 12px;
    color: rgba(0,0,0,0.65);
    font-weight: 400;
  }
  .color-container{
    display: flex;
    align-items: center;
    border: 1px solid rgb(217, 217, 217);
    border-radius: 2px;
    padding: 5px 8px;
    padding-right: 0px;
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
  .color-innner-content{
    padding: 8px 16px;
    .item{
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .el-color-picker--small{
      height: 24px;
      width: 24px;
      margin-right: 8px;
      ::v-deep .el-color-picker__trigger{
        height: 24px;
        width: 24px;
      }
    }
  }
}

</style>
