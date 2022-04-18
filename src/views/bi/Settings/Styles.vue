<template>
  <div class="tab-pane-content">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="基础信息"
        name="1"
      >
        <div
          v-for="(item,name,key) in option['Basic']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['Basic'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['ComponentOption']"
        title="图表样式"
        name="2"
      >
        <div
          v-for="(item,name,key) in option['ComponentOption']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['ComponentOption'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['Axis']"
        title="坐标轴"
        name="3"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="(item,name,key) in option['Axis']" :key="key" :label="item.cname" :name="key.toString()">
            <component
              :is="name"
              :option="option['Axis'][name]"
            />
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['DisplayConfig']"
        title="展示型配置"
        name="4"
      >
        <div
          v-for="(item,name,key) in option['DisplayConfig']"
          :key="key"
        >
          <component
            :is="name"
            :option="option['DisplayConfig'][name]"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        v-if="option['FunctionalOption']"
        title="功能设置"
        name="5"
      >
        <component
          :is="'FunctionalOption'"
          :option="option['FunctionalOption']"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      activeNames: '1',
      activeName: '0'
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__nav-scroll{
    display: flex;
    justify-content: center;
}
</style>
