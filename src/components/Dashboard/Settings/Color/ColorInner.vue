<template>
  <div class="color-inner">
    <div class="color-innner-header">
      <el-popover
        placement="top"
        trigger="click"
        popper-class="color-popover"
      >
        <div v-for="(val,key,index) in colorTheme" :key="index" class="color-container" :class="key===option.theme?'active':''">
          <div class="color-block">
            <span v-for="(item, i) in val" :key="i" class="color-row" :style="`background-color: ${item.value}`" />
          </div>
          <span class="label" :class="key===option.theme?'active':''">{{ key }}</span>
        </div>
        <div
          slot="reference"
          class="color-container"
        >
          <div class="color-block">
            <span v-for="(item, index) in colorTheme[option.theme]" :key="index" class="color-row" :style="`background-color: ${item.value}`" />
          </div>
          <span class="label">{{ option.theme }}</span>
        </div>
      </el-popover>
    </div>
    <div class="color-innner-content">
      1111
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
      colorTheme
    }
  },
  mounted () {
  },
  methods: {
  }

}
</script>
<style lang="scss" scoped>
.color-inner {
    margin: -12px;
  .color-innner-header{
    border-bottom: 1px solid rgba(0,0,0,.15);
    padding: 8px 16px 8px 16px;
    position: relative;
  }
  .label {
    display: inline-block;
    margin-right: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
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
}

</style>
