<template>
  <div class="data-panel-tree">
    <el-input
      v-model="filterText"
      prefix-icon="el-icon-search"
      placeholder="输入关键字搜索"
    />
    <div class="tree-wrapper">
      <div class="data-panel-dimension-tree">
        <div class="data-panel-tree-title">
          <div>维度<i class="el-icon-warning-outline m-l-10" /></div>
        </div>
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="dimension"
          :props="defaultProps"
          default-expand-all
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :filter-node-method="filterNode"
          draggable
          @node-drag-start="handleDragStart"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
            style="width:100%;"
            @dblclick="addItem(data)"
          >
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div class="data-panel-measure-tree">
        <div class="data-panel-tree-title">
          <div>度量<i class="el-icon-warning-outline m-l-10" /></div>
        </div>
        <el-tree
          ref="tree"
          class="filter-tree"
          :data="measure"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          draggable
          @node-drag-start="handleDragStart"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
            style="width:100%;"
            @dblclick="addItem(data)"
          >
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'DataPanel',
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      filterText: '',
      dimension: [{ // 维度
        id: 1,
        type: 'dimension',
        label: '一级 1'
      }, {
        label: '一级 2',
        children: [{
          id: 2,
          type: 'dimension',
          label: '二级 2-1'
        }, {
          id: 3,
          type: 'dimension',
          label: '二级 2-2'
        }]
      }, {
        label: '一级 3',
        children: [{
          id: 4,
          type: 'dimension',
          label: '二级 3-1'
        }, {
          id: 5,
          type: 'dimension',
          label: '二级 3-2'
        }]
      }
      ],
      measure: [{ // 度量
        label: '一级 1',
        children: [{
          id: 6,
          type: 'measure',
          label: '二级 1-1'
        }]
      }, {
        label: '一级 2',
        children: [{
          id: 7,
          type: 'measure',
          label: '二级 2-1'
        }, {
          id: 8,
          type: 'measure',
          label: '二级 2-2'
        }]
      }, {
        label: '一级 3',
        children: [{
          id: 9,
          type: 'measure',
          label: '二级 3-1'
        }, {
          id: 10,
          type: 'measure',
          label: '二级 3-2'
        }]
      }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {

  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点拖拽
    allowDrop (draggingNode, dropNode, type) {
      // 让所有节点都无法放置
      return false
    },
    allowDrag (node) {
      if (node.data.level === 1) {
        return false
      }
      return true
    },
    handleDragStart (node, ev) {
      const dt = ev.dataTransfer
      ev.dataTransfer.effectAllowed = 'copy'
      dt.setData('data', JSON.stringify(node.data))
    },
    // 添加字段
    addItem (data) {
      const that = this
      const addData = function () { // 添加字段
        // 判断是否已经存在
        const dataIndex = that.option[data.type].value.findIndex(el => {
          return el.id === data.id
        })
        if (dataIndex !== -1) {
          that.$message({
            message: `已存在该对象 ${data.label}`,
            type: 'warning'
          })
        } else {
          that.option[data.type].value.push(data)
        }
      }

      if (this.option.dimension) {
        addData()
      } else { // 当维度不存在时
        if (data.type === 'dimension') {
          this.$message({
            message: `不支持添加维度到[${this.option.measure.name}]上`,
            type: 'warning'
          })
        } else {
          addData()
        }
      }
    }
  }
}
</script>

<style>
</style>
