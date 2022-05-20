<template>
  <div class="editor-object-container">
    <div class="editor-item-title">
      显示图例
    </div>
    <div class="editor-item-container flex-align-center">
      <span
        v-for="(item, index) in typeOptions"
        :key="index"
        class="svg-container"
        :class="{'active': type===item.value}"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.name"
          placement="top"
        >
          <svg-icon
            :icon-class="item.value"
            @click="changeHandler(item.value, index)"
          />
        </el-tooltip>
      </span>
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
      typeOptions: [
        {
          name: '无',
          value: 'none'
        }, {
          name: '上',
          value: 'top'
        }, {
          name: '下',
          value: 'bottom'
        }, {
          name: '左',
          value: 'left'
        }, {
          name: '右',
          value: 'right'
        }
      ]
    }
  },
  computed: {
    type () {
      let type = 'none'
      if (!this.option.show) {
        type = 'none'
      } else if (this.option.show && this.option.top === 'auto' && this.option.left === 'center' && this.option.orient === 'horizontal') {
        type = 'top'
      } else if (this.option.show && this.option.top === 'bottom' && this.option.left === 'center' && this.option.orient === 'horizontal') {
        type = 'bottom'
      } else if (this.option.show && this.option.top === 'center' && this.option.left === 'auto' && this.option.orient === 'vertical') {
        type = 'left'
      } else if (this.option.show && this.option.top === 'center' && this.option.left === 'right' && this.option.orient === 'vertical') {
        type = 'right'
      }
      return type
    }
  },
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
<style lang="scss" scoped>
.svg-container {
  cursor: pointer;
  display: inline-block;
  height: 32px;
  width: 32px;
  margin-right: 8px;
  line-height: 32px;
  text-align: center;
}
.svg-container.active{
  border: 1px solid rgba(250,131,52,1);
}
</style>
