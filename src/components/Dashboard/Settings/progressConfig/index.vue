<template>
  <div class="editor-object-container">
    <span>设置目标值</span>
    <div v-for="(data,index) in option.cfgTargetOption" :key="index" class="item">
      <div>{{ data.name }}</div>
      <div class="box">
        <span>目标类型</span>
        <el-select v-model="data.type" class="w-select" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="box">
        <span>目标值</span>
        <el-input v-if="data.type === 1" v-model="data.fixedVal" class="w-input" placeholder="请输入内容" />
        <el-select v-else v-model="data.dynamicVal" class="w-select" placeholder="请选择">
          <el-option
            v-for="(item,i) in option.cfgTargetOption"
            :key="i"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-if="data.type === 2" class="box">
        <span>聚合方式</span>
        <el-select v-model="data.aggregation" class="w-select" placeholder="请选择">
          <el-option
            v-for="(item, i) in aggregationOptions"
            :key="i"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <span>
      完成占比计算方式
      <el-tooltip effect="dark" content="仅当目标值为负数时，选择的计算方式才生效" placement="top">
        <svg-icon
          icon-class="tooltip"
          style="font-size: 16px;"
        />
      </el-tooltip>
    </span>
    <el-select v-model="option.proportion.type" placeholder="请选择">
      <el-option
        v-for="item in proportionOptions"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      />
    </el-select>
    <div class="decimal">
      <span>
        设置完成占比小数位数
      </span>
      <el-select v-model="option.proportion.decimal" class="decimal-select" placeholder="请选择">
        <el-option
          v-for="item in decimalOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressConfig',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      decimalOptions: [0, 1, 2],
      proportionOptions: [
        { name: '[1-(实际值/目标值-1)]*100%', value: 1 },
        { name: '(实际值/目标值)*100%', value: 2 }
      ],
      typeOptions: [
        { name: '固定值', value: 1 },
        { name: '动态值', value: 2 }
      ],
      aggregationOptions: [
        { name: '求和', value: 1 },
        { name: '最大值', value: 2 },
        { name: '最小值', value: 3 },
        { name: '平均值', value: 4 },
        { name: '计数', value: 5 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  padding: 5px 0;
  margin-bottom: 5px;
  background-color: #c6cddb;
  .box {
    text-align: right;
  }
  .w-select, .w-input {
    margin-left: 5px;
    margin-right: 5px;
    width: 150px;
  }
}
.decimal {
    display: flex;
    align-items: center;
    .decimal-select {
      flex: 1;
      margin-top: 5px;
    }
  }
</style>
