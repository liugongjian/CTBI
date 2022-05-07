<template>
  <div>
    <span>轴标签显示格式设置</span>
    <div class="box">
      <el-radio-group v-model="data.type">
        <el-radio label="auto">自动适配</el-radio>
        <el-radio label="hand">手动输入</el-radio>
        <el-radio label="custom">自定义适配</el-radio>
      </el-radio-group>
    </div>
    <el-select v-if="data.type === 'auto'" v-model="data.auto" class="box" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      />
    </el-select>
    <div v-else-if="data.type === 'custom'" class="box">
      <div class="custom">
        <div :class="{pitch: data.custom === 'number'}" @click="handleCustom('number')">#数值</div>
        <div :class="{pitch: data.custom === 'percent'}" @click="handleCustom('percent')">%百分比</div>
      </div>
      <div class="decimal">
        小数位
        <el-input v-model="data.decimal" placeholder="请输入内容" />
      </div>
      <el-checkbox v-model="data.separate">使用千分位分隔符</el-checkbox>
    </div>
    <div v-else style="margin-left:15px;">
      <el-input v-model="data.hand" placeholder="请输入内容" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AxisFormat',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      options: [
        { name: '自动适配(中文)', value: 'chinese' },
        { name: '自动适配(繁体)', value: 'traditional' },
        { name: '自动适配(英文)', value: 'english' }
      ]
    }
  },
  methods: {
    handleCustom(val) {
      this.data.custom = val
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin-left: 15px;
  .custom {
    display: flex;
    height: 25px;
    line-height: 25px;
    border: 1px solid #616571;
    div {
      flex: 1;
      padding-left: 10px;
    }
    .pitch {
      background-color: #2e74ff;
    }
  }
  .decimal {
    display: flex;
    align-items: center;
    .el-input {
      flex: 1;
      margin-top: 5px;
      margin-left: 5px;
    }
  }
}

</style>
