<template>
  <div>
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
      activeNames: '1'
    }
  }
}
</script>
