<template>
  <div id="popup_tree_input">
    <el-popover
      ref="popover"
      v-model="visible"
      :placement="placement"
      trigger="click"
      :disabled="disabled"
    >
      <el-input
        v-model="filterText"
        placeholder="请输入关键字"
      />
      <el-tree
        ref="popupTree"
        style="width: 300px;"
        class="selectMultipleClass"
        :data="data"
        :props="props"
        :indent="indent"
        node-key="_id"
        :default-expand-all="defaultExpandAll"
        :accordion="accordion"
        :highlight-current="highlightCurrent"
        :expand-on-click-node="false"
        check-strictly
        :filter-node-method="filterNode"
        @node-click="nodeClickHandle"
      >
        <span
          slot-scope="{ node }"
          class="custom-tree-node"
        >
          <span>
            <svg-icon
              v-if="node.isLeaf && leafIcon !== ''"
              style="margin-right: 8px;"
              :icon-class="leafIcon"
            />
            <svg-icon
              v-else-if="parentIcon !== ''"
              style="margin-right: 8px;"
              :icon-class="parentIcon"
            />
          </span>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </el-popover>
    <el-input
      v-model="inputText"
      v-popover:popover
      :readonly="true"
      :placeholder="placeholder"
      style="cursor: pointer;"
      @click="visible = true"
    />
  </div>
</template>
<script>
export default {
  name: 'BSelectTree',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'name', // 根据name渲染tree列表
          children: 'children' // 代表children为子级
        }
      }
    },
    value: {
      type: String,
      default: ''
    },
    indent: {
      type: Number,
      default: 16
    },
    nodeKey: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '点击选择内容'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    accordion: {
      type: Boolean,
      default: true
    },
    highlightCurrent: {
      type: Boolean,
      default: true
    },
    leafIcon: {
      type: String,
      default: ''
    },
    parentIcon: {
      type: String,
      default: ''
    },
    closeOnClick: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      inputText: '',
      filterText: ''
    }
  },
  watch: {
    // 监听输入框的内容（进行搜索）
    filterText (val) {
      this.$refs.popupTree.filter(val)
    },
    data: {
      handler (n) {
        const key = this.value || ''
        const currentItem = this.getCurrentTreeNode(this.data, key)
        if (currentItem) {
          this.$refs.popupTree.setCurrentKey(currentItem._id)
          this.inputText = currentItem.name
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getCurrentTreeNode (arr, key) {
      if (!arr && arr.length === 0) {
        return null
      }
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item._id === key) {
          return item
        } else if (item.children) {
          return this.getCurrentTreeNode(item.children, key)
        }
      }
      return null
    },
    // 对树节点进行筛选时执行的方法
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClickHandle (data, node, $el) {
      this.inputText = data.name
      this.$emit('input', data._id)
      if (this.closeOnClick) {
        this.visible = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: 30px;
}
</style>
