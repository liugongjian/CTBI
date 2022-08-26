<template>
  <div>
    <div class="cube-switch">
      <div class="j-select-cube">
        <div class="guid-tip-container">
          <data-set-select
            :data-set="dataSet"
            :option="option"
            @refreshValue="refreshValue"
          />
        </div>
        <div
          v-show="(Dimension.length>0||Measure.length>0)&&(!(dataSet.mold===2&&role==='simpleUser'))"
          title="编辑数据集"
          class="edit-cube"
          @click="editDataSet"
        >
          <i class="el-icon-edit-outline" />
        </div>
      </div>
    </div>
    <div
      v-loading="dataSetLoading"
      element-loading-background="#323541"
    >
      <div
        v-show="Dimension.length>0||Measure.length>0"
        class="data-panel-tree"
      >
        <div class="tree-box-input-wrapper">
          <span class="d-f">
            <div>
              <i class="el-icon-search" />
            </div>
            <div class="tree-box-input">
              <input
                v-model="filterText"
                placeholder="输入关键词搜索"
              >
              <i
                class="el-icon-close"
                @click="filterText = ''"
              />
            </div>
          </span>
        </div>
        <div class="tree-wrapper">
          <div class="data-panel-dimension-tree">
            <div class="data-panel-tree-title">
              <div>维度</div>
              <!-- <i class="el-icon-warning-outline m-l-10" /> -->
            </div>
            <el-tree
              ref="dimension_tree"
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
                <svg-icon
                  style="width: 20px;height: 18px;margin-right: 2px;position: relative;top: 4px;"
                  :icon-class="typeTransform(data.attributes)"
                />
                <span v-if="data.attributes[0].comment">
                  <el-tooltip
                    :content="data.attributes[0].comment"
                    placement="top"
                  >
                    <span>{{ data.displayColumn }}</span>
                  </el-tooltip>

                </span>
                <span v-else>{{ data.displayColumn }}</span>
              </span>
            </el-tree>
          </div>
          <div class="data-panel-measure-tree">
            <div class="data-panel-tree-title">
              <div>度量</div>
              <!-- <i class="el-icon-warning-outline m-l-10" /> -->
            </div>
            <el-tree
              ref="measure_tree"
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
                <svg-icon
                  style="width: 20px;height: 18px;margin-right: 2px;position: relative;top: 3px;"
                  :icon-class="typeTransform(data.attributes)"
                />
                <span v-if="data.attributes[0].comment">
                  <el-tooltip
                    :content="data.attributes[0].comment"
                    placement="top"
                  >
                    <span>{{ data.displayColumn }}</span>
                  </el-tooltip>

                </span>
                <span v-else>{{ data.displayColumn }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import DataSetSelect from './DataSetSelect.vue'
import { getDataSet } from '@/api/dataSet'
import { transformDataTypeIcon } from '@/utils/optionUtils'
import { mapGetters } from 'vuex'
export default {
  name: 'DataPanel',
  components: { DataSetSelect },
  props: {
    option: {
      type: Object,
      default: () => { }
    },
    dataSet: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
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
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  watch: {
    filterText (val) {
      this.$refs.dimension_tree.filter(val)
      this.$refs.measure_tree.filter(val)
    }
  },
  methods: {
    typeTransform (data) {
      return transformDataTypeIcon(data)
    },
    // 更新数据
    async refreshValue (id) {
      if (id) {
        this.dataSetLoading = true
        try {
          const res = await getDataSet(id)
          if (res) {
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
          }
        } catch (error) {
          console.log(error)
        }
        this.dataSetLoading = false
      } else {
        this.Dimension = []
        this.Measure = []
      }
    },
    // 过滤树形数据
    filterNode (value, data) {
      if (!value) return true
      return data.displayColumn.indexOf(value) !== -1
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
      this.$emit('changeActiveName', '1')
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
      this.$emit('changeActiveName', '1')
    },

    // 跳转到编辑数据集页面
    editDataSet () {
      const query = { _id: this.dataSet.id }
      this.$router.push({
        path: '/dataManage/dataSet/edit',
        query
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-box-input-wrapper {
  padding: 0 8px;
  margin-bottom: 4px;
  position: relative;
  i {
    cursor: pointer;
    position: relative;
    top: 2px;
  }
  .tree-box-input {
    position: relative;
    padding-right: 12px;
    width: 100%;
    input {
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
      color: #fff;
      padding: 0 8px;
      // 去除input聚焦时的边框
      outline: none;
      border: 0px;
      height: 24px;
      line-height: 24px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    i {
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
}
</style>
