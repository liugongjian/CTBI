<template>
  <div class="data-panel-tree">
    <el-input
      v-model="filterText"
      prefix-icon="el-icon-search"
      placeholder="输入关键字进行过滤"
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
        />
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
          draggable
        />
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'DataPanel',
  props: {
  },
  data () {
    return {
      filterText: '',
      dimension: [{
        id: 1,
        label: '一级 1',
        level: 1,
        children: [{
          id: 4,
          level: 2,
          label: '二级 1-1'
        }]
      }, {
        id: 2,
        level: 1,
        label: '一级 2',
        children: [{
          level: 2,
          id: 5,
          label: '二级 2-1'
        }, {
          level: 2,
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        level: 1,
        id: 3,
        label: '一级 3',
        children: [{
          level: 2,
          id: 7,
          label: '二级 3-1'
        }, {
          level: 2,
          id: 8,
          label: '二级 3-2'
        }]
      }
      ], // 维度
      measure: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1'
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }
      ], // 度量
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
    }
  }
}
</script>

<style>
</style>
