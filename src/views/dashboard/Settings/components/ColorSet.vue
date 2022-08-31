<!--
 * @Author: 黄璐璐
 * @Date: 2022-08-29 16:40:18
 * @LastEditors: 黄璐璐
 * @LastEditTime: 2022-08-29 16:41:35
 * @Description:
-->
<template>
  <div>
    <div class="editor-object-container">
      <span class="title">
        色系选择
      </span>
      <el-dropdown>
        <div class="color-select">
          <series-color :colors="themes[activeIndex].colors" />
          <span class="title colors">{{ themes[activeIndex].name }}</span>
          <i class="el-icon-arrow-down el-icon--right" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in themes"
            :key="item.name"
            :label="item.name"
            :value="item.color"
          >
            <series-color :colors="item.colors" />
            <span class="label">{{ item.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="customize" @click="selfDefined">
        <svg-icon icon-class="customize" />
        自定义
      </el-button>
    </div>
    <div v-if="isSelfDefined" class="color-customize">
      <span class="title">自定义</span>
      <div
        v-for="(color, index) in themes[activeIndex].colors"
        :key="index"
        class="color-panel"
      >
        <el-color-picker :value="color" size="small" @active-change="changeSelfColor" />
      </div>
    </div>
  </div>
</template>

<script>
import SeriesColor from './SeriesColor.vue'

export default {
  name: 'ColorSet',
  components: { SeriesColor },
  data () {
    return {
      value: '#fff',
      activeIndex: 0,
      activeIndex2: 0,
      isSelfDefined: false,
      themes: [
        {
          name: '官方',
          colors: ['#3369FF', '#FF6A00', '#35D2B8', '#8B8AE6', '#47B359', '#FFD119', '#FFCA80', '#BEB8EA', '#A2D95E', '#8C7BC2', '#A1B0E6', '#E8DC99']
        }, {
          name: '商务',
          colors: ['#4886FF', '#49B0F5', '#47B359', '#83EEF4', '#4987E9', '#F8D300', '#FFCA80', '#BEB8EA', '#A2D95E', '#8C7BC2', '#A1B0E6', '#E8DC99']
        },
        {
          name: '经典',
          colors: ['#2F8AE6', '#35AEE4', '#19D8E6', '#3ECC9C', '#8ADD7A', '#BFE673', '#FEDF66', '#FEB267', '#FA7D64', '#E7678F', '#B45FBB', '#717CDC']
        }
      ]
    }
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (val) {
      this.option.shape = val
    },
    selfDefined() {
      this.isSelfDefined = !this.isSelfDefined
    },
    changeSelfColor(val, index) {
      console.log(val, index)
      this.activeIndex2 = index
      this.themes[this.activeIndex].colors[index] = val
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-object-container {
  display: flex;
  align-items: center;
  .title{
      color: rgba(255,255,255,0.75);
      font-weight: 500;
      font-size: 12px;
      margin-right: 10px;
  }
  .customize {
    background: #424550;
    color:#C7C6CA;
    border: 1px solid rgba(221,221,221,0.25);
  }
  ::v-deep .el-color-picker__trigger{
      border: none;
  }
  .color-select{
      padding-left: 10px;
      margin-right: 10px;
      border: 1px solid rgba(221,221,221,0.25);
      .colors {
        margin-left: 15px;
      }
      i {
        color: white;
        margin-left:110px;
      }
  }
  .el-button{
      height: 24px;
      display: flex;
      align-items: center;
  }
  ::v-deep .el-color-picker__trigger{
    .el-icon-arrow-down{
        display: none !important;
    }
  }
  // .color-panel{
  //     box-sizing: border-box;
  //     height: 27px;
  // }
}
.el-dropdown-menu__item {
    display: flex;
    align-items: center;
    .label{
      margin-left: 5px;
    }
}
.color-select{
    display: flex;
    align-items: center;
    border: 1px solid #DDDDDD;
    border-radius: 2px;
    width: 230px;
    height: 24px;
}
.el-dropdown-menu {
    width: 244px;
}
.active{
    border: 1px solid #FA8334;
}
.color-customize {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
}
</style>
