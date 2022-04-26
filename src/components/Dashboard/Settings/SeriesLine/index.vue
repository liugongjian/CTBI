<template>
  <div>
    <div class="editor-object-container">
      <div v-if="option.show" style="display: flex" class="color-row">
        <span>线条样式</span>
        <el-select
          v-model="option.lineType"
          placeholder="请输入内容"
        >
          <svg-icon
            slot="prefix"
            :icon-class="`${option.lineType}-line`"
          />
          <el-option
            v-for="(item,index) in lineTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <svg-icon
              :icon-class="`${item.value}-line`"
            />
          </el-option>
        </el-select>
      </div>

    </div>
  </div>
</template>

<script>
// import { lineTypes } from '../Axis/dics/constants'
export default {
  name: 'SeriesLine',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
    //   lineTypes: lineTypes
      lineTypes: [{
        label: 'solid',
        value: 'solid'
      }, {
        label: 'dashed',
        value: 'dashed'
      }, {
        label: 'dotted',
        value: 'dotted'
      }]
    }
  },
  mounted () {
  },
  methods: {
    // handleAxisType (type) {
    //   this.option.lineType = type
    // }
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
