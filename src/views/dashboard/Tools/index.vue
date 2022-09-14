<template>
  <div class="header-tool">
    <div class="tools-container">
      <!-- <div class="tool-btn">
        <svg-icon
          :icon-class="'tools-story-line'"
          style="font-size: 18px;"
        />
      </div> -->
      <div class="tool-btn">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ currentPercentage }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0.25">25%</el-dropdown-item>
            <el-dropdown-item command="0.5">50%</el-dropdown-item>
            <el-dropdown-item command="0.75">75%</el-dropdown-item>
            <el-dropdown-item command="1">100%</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="divider" />
    <div class="tools-container">
      <div
        v-for="(item,name, index) in controls"
        :key="name + index"
        class="droppable-element tool-btn chart-tool"
        draggable="true"
        unselectable="on"
        @click.stop="addItem(name,item)"
        @drag.stop="drag($event, name,item)"
        @dragend="dragend($event, name,item)"
      >
        <el-tooltip
          effect="dark"
          :content="item.title"
          placement="top"
        >
          <img
            style="width: 18px; height: 17px; margin-left:12px;"
            :src="require(`../../../assets/Image/dashboard/${name}.png`)"
          >
        </el-tooltip>
      </div>
    </div>
    <div class="divider" />
    <!-- <div class="tools-container">
      <div class="tool-btn">
        <icon-dropdown
          :drop-downs="queryList"
          :main="'tools-query'"
          @resolve="resolveDropdown"
        />
      </div>
      <div class="tool-btn">
        <icon-dropdown
          :drop-downs="richEditorList"
          :main="'tools-rich'"
          @resolve="resolveDropdown"
        />
      </div>
    </div> -->
    <div class="tools-container">
      <div
        v-for="(item,name, index) in briefTooList"
        :key="name + index"
        class="droppable-element tool-btn chart-tool"
        draggable="true"
        unselectable="on"
        @click.stop="addItem(name,item)"
        @drag.stop="drag($event, name,item)"
        @dragend="dragend($event, name,item)"
      >
        <el-tooltip
          effect="dark"
          :content="item.title"
          placement="top"
        >
          <svg-icon
            :icon-class="name"
            style="font-size: 22px;"
          />
        </el-tooltip>
      </div>
      <div
        class="tool-btn horizontal chart-panel-controller"
        @click.stop="panelShow"
      >
        <svg-icon
          :icon-class="'tools-more'"
          style="font-size: 22px;"
        />
        <svg-icon
          :icon-class="'tools-arrow'"
          style="font-size: 8px;margin-left: 8px;"
        />
      </div>
    </div>
    <div class="setting-container">
      <div
        class="tool-setting"
        @click.stop
      >
        <svg-icon
          icon-class="tools-setting"
          style="font-size: 14px;margin-left: 16px;"
        />
      </div>
    </div>
    <chart-list-panel
      v-if="showPanel"
      :tool-list="toolList"
      @addItem="addItem"
      @drag="drag"
      @dragend="dragend"
      @hidePanel="hideChartList"
    />
    <!-- <div
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
    </div> -->
  </div>
</template>

<script>
const DragPos = { 'x': 1, 'y': 1, 'w': 1, 'h': 1, 'i': null }
const mouseXY = { 'x': 1, 'y': 1 }
import store from '@/store'
import { getToolList, getBriefToolList, getControlsList } from './getToolList'
import { deepClone, createNanoId } from '@/utils/optionUtils'
import ChartListPanel from './component/ChartListPanel.vue'
export default {
  name: 'Tools',
  components: {
    // IconDropdown,
    ChartListPanel
  },
  data () {
    // this.controls = [{ name: 'query', text: '查询控件' }, { name: 'TabChart', text: 'Tab控件' }, { name: 'text', text: '文本控件' }]
    return {
      layoutIndex: 100,
      toolList: {},
      briefTooList: {},
      showPanel: false,
      queryList: [
        { svg: 'tools-story-line', command: 'composite-query-component' }
      ],
      richEditorList: [
        { svg: 'tools-story-line', command: 'picture' },
        { svg: 'tools-story-line', command: 'iframe' }
      ],
      controls: {}
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
    },
    currentPercentage () {
      const scaleStyles = store.state.settings.scaleStyles
      const num = scaleStyles.transform.slice(6, -1)
      return num * 100 + '%'
    }
  },
  mounted () {
    document.addEventListener('dragover', function (e) {
      mouseXY.x = e.clientX
      mouseXY.y = e.clientY
    }, false)

    // 获取json文件中的配置项信息
    this.toolList = getToolList()
    this.briefTooList = getBriefToolList()
    this.controls = getControlsList()
    store.dispatch('app/updateToolList', this.toolList)
  },
  methods: {
    // 百分比切换
    handleCommand (command) {
      console.log('command', command)
      const scaleStyles = {
        transform: `scale(${command})`,
        transformOrigin: 'center top'
      }
      store.dispatch('settings/changeSetting', { key: 'scaleStyles', value: scaleStyles })
    },
    // 图标点击添加组件到画布
    addItem (name, item, submenu) {
      // 点击展开菜单的图标 收起菜单
      if (submenu) {
        this.panelShow()
      }
      const nanoId = createNanoId()
      // 防止指向问题
      const option = deepClone(item)
      const currentLayoutId = store.state.app.currentLayoutId
      const currentLayout = this.layout.find(item => item.i === currentLayoutId)
      const newLayout = {
        x: (this.layout.length * 2) % (this.colNum || 48),
        y: this.layout.length + (this.colNum || 48), // puts it at the bottom
        w: 48,
        h: 10,
        width: 900,
        height: 200,
        id: nanoId,
        i: nanoId,
        is: name,
        option
      }
      // 当前选中的是tab或者tab内的组件，则吧新增的放入tab内的画板中
      if (currentLayout && currentLayout.is === 'TabChart') {
        // 当前选中的是Tab组件，则新增的组件是该选中组件的子组件
        // 检测仪表板Tab组件仅支持两层嵌套
        if (newLayout.is === 'TabChart' && currentLayout.containerId) {
          this.$message.warning('仪表板Tab组件仅支持两层嵌套')
          return
        }
        newLayout.containerId = currentLayout.activeTabId
        // 添加tab id链，以用于深层删除
        newLayout.tabIdChains = (currentLayout.tabIdChains || []).concat([currentLayoutId, currentLayout.activeTabId])
      } else if (currentLayout && currentLayout.containerId) {
        // 当前选中的是位于Tab内的非Tab组件，则新增的组件是该选中组件的兄弟组件
        // 检测仪表板Tab组件仅支持两层嵌套
        if (newLayout.is === 'TabChart' && currentLayout.tabIdChains.length > 2) {
          this.$message.warning('仪表板Tab组件仅支持两层嵌套')
          return
        }
        newLayout.containerId = currentLayout.containerId
        newLayout.tabIdChains = [...(currentLayout.tabIdChains || [])]
      }
      this.addLayout(newLayout)
      this.layoutIndex++
    },
    addLayout (obj) {
      // tab组件类型添加一个含有一个tabpane的属性
      if (obj.is === 'TabChart') {
        const paneId = `${obj.i}-1`
        obj.tabPanels = [{ name: '1', title: 'tab1', paneId }]
        obj.activeTabId = paneId
      }
      const temp = deepClone(obj)
      // 更新当前id
      store.dispatch('app/updateLayoutId', temp.i)
      this.layout.push(temp)
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

      // 判断拖拽点是否在tab组件内
      const mouseInTab = this.testInTabsRect()

      // 判断拖拽点是否在画布内
      let mouseInGrid = false
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true
      }
      // 防止指向问题
      const option = deepClone(item)

      const dropLayout = this.layout.find(item => item.i === 'drop')
      // 生成画布上的虚拟节点
      if (mouseInGrid === true && !mouseInTab) {
        if (!dropLayout || dropLayout.containerId) {
          if (dropLayout && dropLayout.containerId) {
            this.layout = this.layout.filter(obj => obj.i !== 'drop')
          }
          this.layout.push({
            x: this.layout.length > 0 ? (this.layout.length * 2) % (this.colNum || 48) : 0,
            y: this.layout.length > 0 ? this.layout.length + (this.colNum || 48) : 0, // puts it at the bottom
            w: 48,
            h: 10,
            width: 900,
            height: 200,
            is: name,
            option,
            i: 'drop'
          })
        }
      }

      // 当在tab组件内则清除画布上的虚拟节点
      if (mouseInTab) {
        // this.layout = this.layout.filter(obj => obj.i !== 'drop')
        const hitLayout = this.layout.find(obj => obj.i === mouseInTab)
        const newContainerId = hitLayout.activeTabId
        if (!dropLayout || !dropLayout.containerId || newContainerId !== dropLayout.containerId) {
          if (dropLayout && (!dropLayout.containerId || newContainerId !== dropLayout.containerId)) {
            this.layout = this.layout.filter(obj => obj.i !== 'drop')
          }
          const newLayout = {
            x: this.layout.length > 0 ? (this.layout.length * 2) % (this.colNum || 48) : 0,
            y: this.layout.length > 0 ? this.layout.length + (this.colNum || 48) : 0, // puts it at the bottom
            w: 48,
            h: 10,
            width: 900,
            height: 200,
            is: name,
            option,
            i: 'drop'
          }
          newLayout.containerId = newContainerId
          // 添加tab id链，以用于深层删除
          // newLayout.tabIdChains = (hitLayout.tabIdChains || []).concat([hitLayout.i, hitLayout.activeTabId])
          this.layout.push(newLayout)
        }
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
      // 判断拖拽点是否在tab组件内
      const mouseInTab = this.testInTabsRect()
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
        const nanoId = createNanoId()
        // 防止指向问题
        const option = deepClone(item)
        const newLayout = {
          x: DragPos.x,
          y: DragPos.y,
          w: 12,
          h: 2,
          i: nanoId,
          id: nanoId,
          is: name,
          option
        }
        if (mouseInTab) {
          const hitLayout = this.layout.find(obj => obj.i === mouseInTab)
          // 检测仪表板Tab组件仅支持两层嵌套
          if (newLayout.is === 'TabChart' && hitLayout.containerId) {
            this.$message.warning('仪表板Tab组件仅支持两层嵌套')
            return
          }
          console.log(hitLayout)
          newLayout.containerId = hitLayout.activeTabId
          // 添加tab id链，以用于深层删除
          newLayout.tabIdChains = (hitLayout.tabIdChains || []).concat([hitLayout.i, hitLayout.activeTabId])
        }
        this.addLayout(newLayout)
        parentGridLayout.dragEvent('dragend', nanoId, DragPos.x, DragPos.y, 2, 12)
      }
    },
    resolveDropdown (command) {
      console.log('command:', command)
    },
    panelShow () {
      this.showPanel = !this.showPanel
    },
    testInTabsRect () {
      const tabs = document.getElementsByClassName('tab-chart-wrap')
      const rects = []
      if (tabs.length > 0) {
        Array.from(tabs).forEach(tab => {
          rects.push(tab.getBoundingClientRect())
        })
        // 判断拖拽点是否在tab组件内
        let mouseInTab = false
        let hitIndex = 0
        rects.forEach((rect, index) => {
          if (((mouseXY.x > rect.left) && (mouseXY.x < rect.right)) && ((mouseXY.y > rect.top) && (mouseXY.y < rect.bottom))) {
            mouseInTab = true
            hitIndex = index
          }
        })
        if (mouseInTab) {
          return tabs[hitIndex].id
        }
        return mouseInTab
      } else {
        return false
      }
    },
    hideChartList () {
      if (this.showPanel) {
        this.showPanel = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.header-tool {
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  .divider {
    width: 1px;
    height: 20px;
    background-color: rgba(113, 114, 118, 0.65);
    margin-left: 14px;
    margin-right: 4px;
  }
  .tools-container {
    display: flex;
    align-items: center;
    svg {
      cursor: pointer;
    }
    .tool-btn {
      margin: 0px 3px;
    }
  }
  .droppable-element {
    margin: 0px 3px;
    svg {
      padding: 5px;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
      }
    }
  }
  .horizontal {
    display: flex;
    margin-left: 8px;
    align-items: center;
    cursor: pointer;
  }
  .setting-container {
    svg {
      cursor: pointer;
    }
    position: absolute;
    right: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
