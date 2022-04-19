<template>
  <el-table
    :data="optionValue.detailsData"
    border
  >
    <el-table-column
      v-for="(item,index) in optionValue.labelProp"
      :key="index"
      :prop="item.prop"
      :label="item.label"
    />
  </el-table>
</template>

<script>
export default {
  name: 'TableChart',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      optionValue: { ...this.option }
    }
  },
  methods: {
    getValue () {
      return this.optionValue
    },
    setValue (val) {
      this.optionValue = Object.assign(this.optionValue, val)
    }
  }
}
</script>
<style scoped>
</style>
