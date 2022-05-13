<template>
  <div>
    <div class="cube-switch">
      <div class="j-select-cube">
        <div class="guid-tip-container">
          <data-set-select @reflashValue="reflashValue" />
        </div>
        <div
          v-show="Dimension.length>0||Measure.length>0"
          title="编辑数据集"
          class="edit-cube"
          @click="editDataSet"
        >
          <i class="el-icon-edit-outline" />
        </div>
      </div>
    </div>
    <div
      v-show="Dimension.length>0||Measure.length>0"
      v-loading="dataSetLoading"
      class="data-panel-tree"
    >
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
            :data="Dimension"
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
            :data="Measure"
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
  </div>

</template>

<script>
import DataSetSelect from './components/DataSetSelect.vue'
import { getDataSetData } from '@/api/dataSet'
export default {
  name: 'DataPanel',
  components: { DataSetSelect },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dataSetID: '', // 数据集ID
      filterText: '',
      Dimension: [], // 度量
      Measure: [], // 度量
      defaultProps: {
        children: 'children',
        label: 'displayColumn'
      },
      value: '', // 树形过滤关键字
      dataSetLoading: false
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 更新数据
    async reflashValue (id) {
      this.dataSetLoading = true
      try {
        const res = await getDataSetData(id)
        if (res) {
          this.dataSetID = id
          const dataList = res.fields
          this.Dimension = []
          this.Measure = []
          dataList.forEach(item => {
            item.dataSetID = id
            if (item.type === 'Dimension') {
              this.Dimension.push(item)
            } else {
              this.Measure.push(item)
            }
          })
          const option = this.option
          for (const i in option) {
            option[i]['value'] = []
          }
          this.dataSetLoading = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 过滤树形数据
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
          return el._id === data._id
        })
        if (dataIndex !== -1) {
          that.$message({
            message: `已存在该对象 ${data.displayColumn}`,
            type: 'warning'
          })
        } else {
          that.option[data.type].value.push(data)
        }
      }

      if (this.option.Dimension) {
        addData()
      } else { // 当维度不存在时
        if (data.type === 'Dimension') {
          this.$message({
            message: `不支持添加维度到[${this.option.Measure.name}]上`,
            type: 'warning'
          })
        } else {
          addData()
        }
      }
    },

    // 跳转到编辑数据集页面
    editDataSet () {
      const query = { _id: this.dataSetID }
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
    }
  }
}
</script>

<style>
</style>
