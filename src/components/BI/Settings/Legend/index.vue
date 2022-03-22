<template>
  <div>
    <div>
      显示图例
    </div>
    <div>
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
        this.option.ComponentOption.Legend.show = false
      } else if (type === 'top') {
        this.option.ComponentOption.Legend.show = true
        this.option.ComponentOption.Legend.top = 'auto'
        this.option.ComponentOption.Legend.left = 'center'
        this.option.ComponentOption.Legend.orient = 'horizontal'
      } else if (type === 'bottom') {
        this.option.ComponentOption.Legend.show = true
        this.option.ComponentOption.Legend.top = 'bottom'
        this.option.ComponentOption.Legend.left = 'center'
        this.option.ComponentOption.Legend.orient = 'horizontal'
      } else if (type === 'left') {
        this.option.ComponentOption.Legend.show = true
        this.option.ComponentOption.Legend.top = 'center'
        this.option.ComponentOption.Legend.left = 'auto'
        this.option.ComponentOption.Legend.orient = 'vertical'
      } else if (type === 'right') {
        this.option.ComponentOption.Legend.show = true
        this.option.ComponentOption.Legend.top = 'center'
        this.option.ComponentOption.Legend.left = 'right'
        this.option.ComponentOption.Legend.orient = 'vertical'
      }
    }
  }
}
</script>
