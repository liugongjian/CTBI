<template>
  <span>
    <span class="series-colors">
      <span v-for="color in colors" :key="color" class="series-colors-cell" :style="`background: ${color};`" />
    </span>
  </span>
</template>

<script>
export default {
  name: 'SeriesColor',
  props: {
    colors: {
      type: Array,
      default: () => ['']
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 图标点击添加组件到画布
    changeHandler (val) {
      this.option.shape = val
    }
  }

}
</script>

<style lang="scss" scoped>
.series-colors{
    box-sizing: border-box;
    font-size: 12px!important;
    display: flex;
    flex-wrap: wrap;
    height: 16px;
    width: 48px;
    &-cell{
        display: block;
        box-sizing: border-box;
        width: 8px;
        height: 8px;
    }

}

</style>
