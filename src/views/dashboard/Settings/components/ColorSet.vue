<template>
  <div class="editor-object-container">
    <span style="color:white;">
      色系选择
    </span>
    <el-dropdown>
      <div class="color-select">
        <series-color :colors="themes[activeIndex].colors" />
        <span class="label">{{ themes[activeIndex].name }}</span>
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
    <el-button>自定义</el-button>
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
    }
  }

}
</script>

<style lang="scss" scoped>
.editor-object-container {
  display: flex;
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
    width: 244px;
    height: 24px;
}
.el-dropdown-menu{
    width: 244px;
}
</style>
