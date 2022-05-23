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
        margin: 0px 5px 0px 0px;
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
        // border: 1px solid #DCDFE6;
        border-radius: 5px;
        height: 100%;
        width: 100%;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.75);
        font-weight: 400;
        height: 24px;
        i {
            font:#DCDFE6
        }
    }
}
</style>
