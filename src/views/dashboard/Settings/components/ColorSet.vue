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
      <el-button @click="selfDefined">自定义</el-button>
    </div>
    <div v-if="isSelfDefined" class="editor-object-container">
      <span class="title">自定义</span>
      <div v-for="(color,index) in themes[activeIndex].colors" :key="index" :class="{'active' : activeIndex2 === index}" class="color-panel">
        <el-color-picker :value="color" size="small" @change="val => changeSelfColor(val,index)" />
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
          name: '浅色',
          color: '#fff',
          colors: ['#1A7DFF', '#FF751A', '#16CAD6', '#7067F5', '#66A3CC', '#FFAE0F', '#DB7972', '#96B1FA', '#34AD8D', '#F593AD', '#8C90B8', '#CCB18F']
        }, {
          name: '深色',
          color: '#2C3040',
          colors: ['#1A7DFF', '#FF751A', '#16CAD6', '#7067F5', '#66A3CC', '#FFAE0F', '#DB7972', '#96B1FA', '#34AD8D', '#F593AD', '#8C90B8', '#CCB18F']
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
      this.activeIndex2 = index
      this.themes[this.activeIndex].colors[index] = val
    }
  }

}
</script>

<style lang="scss" scoped>
.editor-object-container {
  display: flex;
  .title{
      color: white;
      margin-right: 10px;
  }
  ::v-deep .el-color-picker__trigger{
      border: none;
  }
  .color-select{
      padding-left: 10px;
      margin-right: 10px;
      .colors{
          margin-left: 15px;
      }
      i{
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
  .color-panel{
      box-sizing: border-box;
      height: 27px;
  }
}
.el-dropdown-menu__item{
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
.el-dropdown-menu{
    width: 244px;
}
.active{
    border: 1px solid #FA8334;
}
</style>
