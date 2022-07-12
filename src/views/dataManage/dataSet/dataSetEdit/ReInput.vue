<!-- 支持失焦事件判断是否回滚数据 -->
<template>
  <el-input
    v-model="modelValue"
    :maxlength="maxLength"
    @blur="handlerBlur"
  />
</template>

<script>
export default {
  name: 'ReInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    blurFun: {
      type: Function,
      default: null
    },
    maxLength: {
      type: Number,
      default: 150
    }
  },
  data () {
    return {
      modelValue: ''
    }
  },
  watch: {
    value () {
      this.modelValue = this.value
    }
  },
  created () {
    this.modelValue = this.value
  },
  methods: {
    handlerBlur () {
      let flag = true
      if (typeof this.blurFun === 'function') {
        flag = this.blurFun(this.modelValue, this.value)
      }
      if (flag) {
        this.$emit('input', this.modelValue)
        this.$emit('blur', this.modelValue)
      } else {
        this.modelValue = this.value
      }
    }
  }
}
</script>
