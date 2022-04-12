<template>
  <div class="editor-object-container">
    X轴
    <div>轴标题
      <el-input v-model="option.title" />
    </div>
    <el-checkbox
      v-model="option.showTitle"
      label="显示标题和单位"
      @change="changeHandler"
    />
  </div>
</template>

<script>
export default {
  name: 'XAxis',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  methods: {
    changeHandler () {
      console.log(this.option.showTitle)
    }
  }
}
</script>
