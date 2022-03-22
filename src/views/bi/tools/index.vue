<template>
  <div class="header-tool">
    <div
      v-for="(item, index) in toolList"
      :key="item.type + index"
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @click.stop="addItem(item.type, item.is)"
      @drag.stop="drag($event, item.type, item.is)"
      @dragend="dragend($event, item.type, item.is)"
    >
      <svg-icon
        :icon-class="`chart_${item.type}`"
        style="font-size: 30px;"
      />
    </div>
  </div>
</template>

<script>
const DragPos = { 'x': 1, 'y': 1, 'w': 1, 'h': 1, 'i': null }
const mouseXY = { 'x': 1, 'y': 1 }
import template from '@/views/bi/template'
import store from '@/store'

export default {
  components: {},
  data () {
    return {
      layoutIndex: 100,
      toolList: [{ is: 'v-chart', type: 'bar' }, { is: 'v-chart', type: 'line' }, { is: 'v-chart', type: 'pie' }, { is: 'TableChart', type: 'table' }]
    }
  },
  computed: {
    layout: {
      get () {
        return store.state.app.layout
      },
      set (n) {
        store.dispatch('app/updateLayout', n)
      }
    }
  },
  watch: {},
  created () { },
  mounted () {
    document.addEventListener('dragover', function (e) {
      mouseXY.x = e.clientX
      mouseXY.y = e.clientY
    }, false)
  },
  methods: {
    // 图标点击添加组件到画布
    addItem: function (type, is) {
      const i = type + this.layoutIndex + new Date().getTime()
      // 防止指向问题
      const option = JSON.parse(JSON.stringify(template[type]))
      this.layout.push({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: 12,
        h: 2,
        i,
        is: is,
        option
      })
      // 呼叫右侧设置栏变更
      this.$bus.$emit('reloadOption', i)
      this.layoutIndex++
    },
    // 画布拖拽中事件
    drag: function (e, type, is) {
      let parentGridLayout = null
      this.$emit('getGridLayout', val => {
        parentGridLayout = val
      })
      let parentRect = null
      this.$emit('getParentRect', val => {
        parentRect = val
      })
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      // 防止指向问题
      const option = JSON.parse(JSON.stringify(template[type]))
      if (mouseInGrid === true && (this.layout.findIndex(item => item.i === 'drop')) === -1) {
        this.layout.push({
          x: this.layout.length > 0 ? (this.layout.length * 2) % (this.colNum || 12) : 0,
          y: this.layout.length > 0 ? this.layout.length + (this.colNum || 12) : 0, // puts it at the bottom
          w: 12,
          h: 2,
          is,
          option,
          i: 'drop'
        })
      }
      const index = this.layout.findIndex(item => item.i === 'drop')
      if (index !== -1) {
        const el = parentGridLayout.$children[index]
        el.dragging = { 'top': mouseXY.y - parentRect.top, 'left': mouseXY.x - parentRect.left }
        const new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left)
        if (mouseInGrid === true) {
          parentGridLayout.dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 2, 12)
          DragPos.i = String(index)
          DragPos.x = this.layout[index].x
          DragPos.y = this.layout[index].y
        }
        if (mouseInGrid === false) {
          parentGridLayout.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 2, 12)
          this.layout = this.layout.filter(obj => obj.i !== 'drop')
        }
      }
    },
    // 拖拽结束后事件
    dragend: function (e, type, is) {
      let parentGridLayout = null
      this.$emit('getGridLayout', val => {
        parentGridLayout = val
      })
      let parentRect = null
      this.$emit('getParentRect', val => {
        parentRect = val
      })
      let mouseInGrid = false
      // 判断拖拽是否在节点内部
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      if (mouseInGrid === true) {
        parentGridLayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 2, 12)
        this.layout = this.layout.filter(obj => obj.i !== 'drop')
        const i = type + String(DragPos.i) + new Date().getTime()
        // 防止指向问题
        const option = JSON.parse(JSON.stringify(template[type]))
        this.layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: 12,
          h: 2,
          i,
          is,
          option
        })
        parentGridLayout.dragEvent('dragend', i, DragPos.x, DragPos.y, 2, 12)
        // 呼叫右侧设置栏变更
        this.$bus.$emit('reloadOption', i)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.header-tool {
  display: flex;
  align-items: center;
  .droppable-element {
    margin: 0px 5px;
  }
}
</style>
