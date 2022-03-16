<template>
  <div>
    <div
      v-for="(item, index) in toolList"
      :key="item + index"
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @drag="drag"
      @dragend="dragend"
    >
      <svg-icon :icon-class="`chart_${item}`" />
    </div>
  </div>
</template>

<script>
const DragPos = { 'x': 1, 'y': 1, 'w': 1, 'h': 1, 'i': 1 }
const mouseXY = { 'x': 1, 'y': 1 }
export default {
  data () {
    return {
      toolList: ['bar', 'line', 'pie']
    }
  },
  mounted () {
    document.addEventListener('dragover', function (e) {
      mouseXY.x = e.clientX
      mouseXY.y = e.clientY
    }, false)
  },
  methods: {
    drag: function (e) {
      const parentRect = document.getElementById('content').getBoundingClientRect()
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      if (mouseInGrid === true && (this.layout.findIndex(item => item.i === 'drop')) === -1) {
        this.layout.push({
          x: this.layout.length > 0 ? (this.layout.length * 2) % (this.colNum || 12) : 0,
          y: this.layout.length > 0 ? this.layout.length + (this.colNum || 12) : 0, // puts it at the bottom
          w: 4,
          h: 2,
          i: 'drop'
        })
      }
      const index = this.layout.findIndex(item => item.i === 'drop')
      if (index !== -1) {
        const el = this.$refs.gridlayout.$children[0].$children[index]
        el.dragging = { 'top': mouseXY.y - parentRect.top, 'left': mouseXY.x - parentRect.left }
        const new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left)
        if (mouseInGrid === true) {
          this.$refs.gridlayout.$children[0].dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 4, 2)
          DragPos.i = String(index)
          DragPos.x = this.layout[index].x
          DragPos.y = this.layout[index].y
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.$children[0].dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 4, 2)
          this.layout = this.layout.filter(obj => obj.i !== 'drop')
        }
      }
    },
    dragend: function (e) {
      const parentRect = document.getElementById('content').getBoundingClientRect()
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      if (mouseInGrid === true) {
        this.$refs.gridlayout.$children[0].dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 4, 2)
        this.layout = this.layout.filter(obj => obj.i !== 'drop')
      }
      const List = { id: 'Doughnut' + DragPos.i, dataList: this.dataList }
      this.layout.push({
        x: DragPos.x,
        y: DragPos.y,
        w: 4,
        h: 2,
        i: DragPos.i,
        type: 'Doughnut',
        value: List
      })
      this.$refs.gridlayout.$children[0].dragEvent('dragend', DragPos.i, DragPos.x, DragPos.y, 4, 2)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>
