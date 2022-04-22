<template>
  <div class="editor-object-container">
    <el-checkbox
      v-if="option.show"
      v-model="option.check"
      label="显示双Y轴"
    />
    <span v-else>显示双Y轴</span>
    <div class="editor-item-container">
      <el-radio-group
        v-model="option.twisType"
        :disabled="option.show&&!option.check"
      >
        <div
          v-for="(item,index) in options"
          :key="index"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.name"
            placement="top"
          >
            <el-radio :label="item.label">{{ item.name }}</el-radio>
          </el-tooltip>
          <el-tooltip
            v-if="item.label==='syncNull'"
            class="item"
            effect="dark"
            content="不同步下可能导致左右轴刻度不一致，并且无法保证0刻度对齐"
            placement="top"
          >
            <i
              class="el-icon-warning-outline"
              style="font-size:14px"
            />
          </el-tooltip>
        </div>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwisYAxis',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      options: [
        {
          label: 'syncNull',
          name: '不同步'
        },
        {
          label: 'syncTicksNum',
          name: '刻度数量一致'
        },
        {
          label: 'syncAll',
          name: '刻度数量&数值一致'
        }
      ]
    }
  }
}
</script>

<style>
</style>
