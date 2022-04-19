<template>
  <div class="editor-object-container">
    <div>
      样式模板
    </div>
    <div class="editor-item-container flex-align-center">
      <div
        v-for="(item, index) in typeOption"
        :key="index"
        style="cursor: pointer;margin-right:20px;"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.name"
          placement="top"
        ><div style="display:flex;flex-direction:column;align-items:center">
          <svg-icon
            :icon-class="item.value"
            style="font-size: 30px;"
            @click="changeHandler(item.value)"
          />
          <span>{{ item.name }}</span>
        </div>

        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapStyleTemplates',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      typeOption: [
        {
          name: '默认',
          value: 'defaultMap'
        },
        {
          name: '极简底图',
          value: 'simpleMap'
        },
        {
          name: '3D填充',
          value: '3DMap'
        }
      ]
    }
  },
  computed: {
  },
  watch: {},
  created () { },
  mounted () {
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (type) {
      this.option.type = type
    }
  }

}
</script>

<style>
</style>
