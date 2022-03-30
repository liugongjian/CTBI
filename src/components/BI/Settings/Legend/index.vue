<template>
  <div class="editor-object-container">
    <div>
      显示图例
    </div>
    <div class="editor-item-container">
      <el-button
        type="text"
        @click="changeHandler('none')"
      >无</el-button>
      <el-button
        type="text"
        @click="changeHandler('top')"
      >上</el-button>
      <el-button
        type="text"
        @click="changeHandler('bottom')"
      >下</el-button>
      <el-button
        type="text"
        @click="changeHandler('left')"
      >左</el-button>
      <el-button
        type="text"
        @click="changeHandler('right')"
      >右</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Legend',
  components: {},
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
  },
  methods: {
    changeHandler (type) {
      if (type === 'none') {
        this.option.show = false
      } else if (type === 'top') {
        this.option.show = true
        this.option.top = 'auto'
        this.option.left = 'center'
        this.option.orient = 'horizontal'
      } else if (type === 'bottom') {
        this.option.show = true
        this.option.top = 'bottom'
        this.option.left = 'center'
        this.option.orient = 'horizontal'
      } else if (type === 'left') {
        this.option.show = true
        this.option.top = 'center'
        this.option.left = 'auto'
        this.option.orient = 'vertical'
      } else if (type === 'right') {
        this.option.show = true
        this.option.top = 'center'
        this.option.left = 'right'
        this.option.orient = 'vertical'
      }
    }
  }
}
</script>
