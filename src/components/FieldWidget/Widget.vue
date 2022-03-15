<template>
  <grid-layout
    :layout.sync="layout"
    :col-num="12"
    :row-height="100"
    :is-draggable="true"
    :is-resizable="true"
    :is-mirrored="false"
    :vertical-compact="true"
    :margin="[10, 10]"
    :use-css-transforms="true"
  >

    <grid-item
      v-for="item in layout"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      class="grid-item-box"
      @resized="resizedEvent"
    >
      <LazyRender @click="getOptions(item.i)">
        <component
          :is="item.is"
          :ref="item.i"
          :option="item.option"
        />
      </LazyRender>
    </grid-item>
  </grid-layout>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import LazyRender from '@/components/LazyRender'
import store from '@/store'
export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    LazyRender
  },
  computed: {
    layout () {
      return store.state.app.layout
    }
  },
  mounted () {
    this.$bus.$on('reflashChart', this.reflashChart)
  },
  methods: {
    getOptions (e) {
      if (this.$refs[e] && this.$refs[e].length > 0) {
        this.$bus.$emit('reloadOption', { id: e, option: this.$refs[e][0].getOption() })
      }
    },
    reflashChart (e) {
      const temp = store.state.app.layout.find(item => {
        return item.i === e
      })
      this.$refs[e][0].setOption(temp.option)
    },
    resizedEvent (i, newH, newW, newHPx, newWPx) {
      this.$refs[i][0].resize()
    }
  }
}
</script>
<style scoped>
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #fff;
  border: 1px solid black;
}
.grid-item-box {
  box-sizing: border-box;
  touch-action: none;
  overflow: hidden;
}
</style>
