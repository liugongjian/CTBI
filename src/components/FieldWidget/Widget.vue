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
    >
      <LazyRender @click="getOptions(item.i)">
        <component
          :is="item.is"
          :ref="item.i"
          :option="item.option"
          autoresize
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
      this.$bus.$emit('reloadOption', { id: e, option: this.$refs[e][0].getOption() })
    },
    reflashChart (e) {
      const temp = store.state.app.layout.find(item => {
        return item.i === e
      })
      this.$refs[e][0].setOption(temp.option)
      console.log(this.$refs[e][0].getOption())
    }
  }
}
</script>
<style scoped>
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #fff;
  border: 1px solid black;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: #cce;
}
.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
