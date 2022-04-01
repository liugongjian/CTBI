<template>
  <div class="header-tool">
    <div
      v-for="(item,name, index) in toolList"
      :key="name + index"
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @click.stop="addItem(name,item)"
      @drag.stop="drag($event, name,item)"
      @dragend="dragend($event, name,item)"
    >
      <svg-icon
        :icon-class="name"
        style="font-size: 30px;"
      />
    </div>
  </div>
</template>

<script>
const DragPos = { 'x': 1, 'y': 1, 'w': 1, 'h': 1, 'i': null }
const mouseXY = { 'x': 1, 'y': 1 }
import store from '@/store'
import { getToolList } from './getToolList'
export default {
  name: 'Tools',
  components: {},
  data () {
    return {
      layoutIndex: 100,
      toolList: {}
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

    // 获取json文件中的配置项信息
    this.toolList = getToolList()
  },
  methods: {
    // 图标点击添加组件到画布
    addItem (name, item) {
      const i = name + this.layoutIndex + new Date().getTime()
      // 防止指向问题
      const option = JSON.parse(JSON.stringify(item))
      this.addLayout({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: 12,
        h: 2,
        i,
        is: name,
        option
      })
      this.layoutIndex++
    },
    addLayout (obj) {
      const temp = JSON.parse(JSON.stringify(obj))
      // 更新当前id
      store.dispatch('app/updateLayoutId', temp.i)
      this.layout.push(temp)
      // 呼叫右侧设置栏变更
      this.$bus.$emit('reloadOption', obj.i)
    },
    // 画布拖拽中事件
    drag (e, name, item) {
      // 获取画布节点
      let parentGridLayout = null
      this.$emit('getGridLayout', val => {
        parentGridLayout = val
      })
      let parentRect = null
      this.$emit('getParentRect', val => {
        parentRect = val
      })
      // ///////////////////////

      // 判断拖拽点是否在画布内
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      // 防止指向问题
      const option = JSON.parse(JSON.stringify(item))

      // 生成画布上的虚拟节点
      if (mouseInGrid === true && (this.layout.findIndex(item => item.i === 'drop')) === -1) {
        this.layout.push({
          x: this.layout.length > 0 ? (this.layout.length * 2) % (this.colNum || 12) : 0,
          y: this.layout.length > 0 ? this.layout.length + (this.colNum || 12) : 0, // puts it at the bottom
          w: 12,
          h: 2,
          is: name,
          option,
          i: 'drop'
        })
      }

      // 虚拟节点在画布上拖拽
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
    dragend (e, name, item) {
      // 获取画布节点
      let parentGridLayout = null
      this.$emit('getGridLayout', val => {
        parentGridLayout = val
      })
      let parentRect = null
      this.$emit('getParentRect', val => {
        parentRect = val
      })
      // ///////////////////////

      // 判断拖拽是否在节点内部
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      if (mouseInGrid === true) {
        parentGridLayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 2, 12)
        this.layout = this.layout.filter(obj => obj.i !== 'drop')
        const i = name + String(DragPos.i) + new Date().getTime()
        // 防止指向问题
        const option = JSON.parse(JSON.stringify(item))
        this.addLayout({
          x: DragPos.x,
          y: DragPos.y,
          w: 12,
          h: 2,
          i,
          is: name,
          option
        })
        parentGridLayout.dragEvent('dragend', i, DragPos.x, DragPos.y, 2, 12)
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
