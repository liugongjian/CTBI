<template>
  <grid-layout
    :layout.sync="layout"
    :col-num="48"
    :row-height="20"
    :is-draggable="true"
    :is-mirrored="false"
    :vertical-compact="true"
    :use-css-transforms="true"
    :prevent-collision="false"
    :is-bounded="true"
    :margin="[10, 10]"
  >
    <div
      v-for="item in layout"
      :key="item.i"
      @click.stop="clickHandler(item.i)"
    >
      <grid-item
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :resize-option="resizeOption"
      >
        <ComponentBlock
          :option="item"
          :style="chartsStyles"
        >
          <component
            :is="item.is"
            :identify="item.i"
          />
        </ComponentBlock>
      </grid-item>
    </div>
  </grid-layout>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import store from '@/store'
export default {
  name: 'Widget',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data () {
    return {
      resizeOption: {
        edges: { left: true, right: true, top: false, bottom: true },
        listeners: {
          move: function (event) {
            const { target: { dataset: { x, y } }, deltaRect, rect } = event
            console.log(x, y, deltaRect, rect)
            // console.log(x, y, event.deltaRect.left, event.deltaRect.top, event.target.dataset)

            // x = (parseFloat(x) || 0) + event.deltaRect.left
            // y = (parseFloat(y) || 0) + event.deltaRect.top

            // Object.assign(event.target.style, {
            //   width: `${event.rect.width}px`,
            //   height: `${event.rect.height}px`,
            //   transform: `translate(${x}px, ${y}px)`
            // })

            // Object.assign(event.target.dataset, { x, y })

            // var endX = e.clientX
            // var moveLen = resize[i].left + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            // var maxT = box[i].clientWidth - resize[i].offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

            // if (moveLen < 32) moveLen = 32 // 左边区域的最小宽度为32px
            // if (moveLen > maxT - 150) moveLen = maxT - 150 // 右边区域最小宽度为150px

            // resize[i].style.left = moveLen // 设置左侧区域的宽度

            // for (let j = 0; j < left.length; j++) {
            //   left[j].style.width = moveLen + 'px'
            //   mid[j].style.width = (box[i].clientWidth - moveLen - 10) + 'px'
            // }
          }
        }
      }
    }
  },
  computed: {
    layout () {
      // 去除属于tab组件的layout
      return store.state.app.layout.filter(item => !item.containerId)
    },
    chartsStyles () {
      return this.$store.state.settings.chartsStyles
    }
  },
  mounted () {
    const that = this
    document.onkeydown = function (e) {
      const { target: { tagName, className } } = e
      if ((e.code === 'Backspace' || e.code === 'Delete') && ((tagName === 'BODY' && !className) || tagName === 'svg')) {
        const id = store.state.app.currentLayoutId
        if (id) {
          // 删除vuex的layout中对应的组件信息
          that.$store.dispatch('app/deleteLayoutById', id)
        }
      }
    }
  },
  methods: {
    layoutMountedEvent (newLayout) {
      console.log('Mounted layout: ', newLayout)
    },
    layoutUpdatedEvent: function (newLayout) {
      console.log('Updated layout: ', newLayout)
    },
    clickHandler (id) {
      // 更新当前id
      console.log(id)
      this.$store.dispatch('app/updateLayoutId', id)
    }
  }
}
</script>
<style scoped>
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #fff;
  box-sizing: border-box;
  touch-action: none;
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
  touch-action: none;
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
