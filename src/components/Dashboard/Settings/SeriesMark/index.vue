<template>
  <div>
    <div class="editor-object-container">
      <div v-if="option.show" style="display: flex" class="color-row">
        <span>显示标记点</span>
        <el-select
          v-model="option.markType"
          placeholder="请输入内容"
        >
          <svg-icon
            slot="prefix"
            :icon-class="`${option.markType}-mark`"
          />
          <el-option
            v-for="(item,index) in markTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">
              <svg-icon
                :icon-class="`${item.value}-mark`"
              /></span>

            <span style="float: right">{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'SeriesMark',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      markTypes: [{
        label: '圆形',
        value: 'circle'
      }, {
        label: '空心圆',
        value: 'emptyCircle'
      }, {
        label: '菱形',
        value: 'diamond'
      }, {
        label: '空心菱形',
        value: 'hollowDiamond'
      }]
    }
  },
  mounted () {
  },
  methods: {
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
        .disabled{
            background: #F5F7FA;
        }
    }
    .dropdown-link{
        display: flex;
        justify-content: center;
        align-items:center;
        border: 1px solid #DCDFE6;
        padding: 0 2px;
        border-radius: 5px;
        height: 100%;
        width: 100%;
        i {
            font:#DCDFE6
        }
    }
}
</style>
