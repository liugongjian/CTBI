<template>
  <div class="editor-object-container">
    <div><span class="edition">版本切换</span>
      <el-radio-group v-model="option.edition">
        <el-radio label="newEdition" @change="dialogVisible = true">新版明细表</el-radio>
        <el-radio label="oldEdition">旧版</el-radio>
      </el-radio-group>
    </div>
    <el-dialog
      title="切换提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>
        <p>旧版交叉表(明细)和新版明细表在以下方面存在差异，请确认是否要切换？</p>
        <p>1、总计计算逻辑差异，新版本采用回推到原始数据算总计的方式，对于率指标、计数去重类指标、自定义复杂指标等的总计结果计算更为精确</p>
        <p>2、新版明细表支持计算百分比，例如占总计的百分比、占父级汇总的百分比等</p>
        <p>3、条件格式配置的差异，新版本条件格式展示样式更好看、条件配置更灵活、新增色阶配置</p>
        <p>4、新版明细表列宽调整支持自适应、输入固定值和手动拖拽</p>
        <p>5、其他样式上的调整差异</p>
        <p>以上差异，导致切换后需要重新配置相关内容，建议切换前手动另存为副本</p>
      </span>
      <span slot="footer">
        <el-button @click="dialogVisible = false">确定</el-button>
        <el-button type="primary" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Edition',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
  }
}
</script>

<style>
.edition {
    margin: 20px
}
</style>
