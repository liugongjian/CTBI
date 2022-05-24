<template>
  <el-dialog
    title="选择数据集"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="75%"
  >
    <div class="content">
      <div class="cube-tree-panel">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="全部"
            name="1"
          >
            <div class="tree-box-input">
              <el-input
                v-model="filterText"
                placeholder="输入关键词搜索"
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-search"
                />
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-close"
                  @click="filterText=''"
                />
              </el-input>
            </div>
            <div class="tree-box-option">
              <el-tree
                ref="tree"
                node-key="_id"
                :data="treeData"
                :current-node-key="dataSet.id"
                highlight-current
                :props="defaultProps"
                :filter-node-method="filterNode"
                :default-expanded-keys="defaultExpand"
                @node-click="clickTreeNode"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="已使用"
            name="2"
          >
            <ul class="cube-box-list">
              <li
                v-for="(item,index) in selectOption"
                :key="index"
                @click="hanldClickOption(item.id,item.name)"
              ><span class="cube-list-caption">{{ item.name }}</span>
                <i
                  v-if="item.id===dataSetValue.id"
                  class="el-icon-check"
                />
              </li>
            </ul>

          </el-tab-pane>
        </el-tabs>
        <div class="oper-panel">
          <el-button>新建数据集</el-button>
        </div>
      </div>
      <div class="cube-data-panel">
        <div
          v-loading="dataLoading"
          class="cube-table-container"
        >
          <el-table
            v-if="dimensionMeasureTableData.length"
            :data="dimensionMeasureTableData"
            :height="500"
            style="width: 100%"
            stripe
          >
            <el-table-column
              v-for="(parent, i) in dimensionMeasure"
              :key="`column-p-${i}`"
              :label="parent.displayColumn"
              :class-name="`m-column-${parent._id}`"
            >
              <el-table-column
                v-for="(v, index) in parent.children"
                :key="`column-child-${index}`"
                class-name="display-none"
              >
                <el-table-column
                  :prop="v.displayColumn"
                  width="95"
                  class-name="column-child"
                  :label="v.displayColumn"
                  show-overflow-tooltip
                >
                  <template #header="{ column }">
                    <b-tooltip
                      :content="column.label"
                      width="80px"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer-box">
          <el-button @click="closeSilence()">取 消</el-button>
          <el-button
            type="primary"
            @click="close(dataSetValue)"
          >确 定</el-button>
        </div>
      </div>
    </div>

  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixins/dialogMixin'
import { getDataSetsInfo, getPreviewData } from '@/api/dataSet'
export default {
  name: 'DataSetPreviewDialog',
  mixins: [dialogMixin],
  data () {
    return {
      dataSetValue: {}, // 当前显示的数据集
      activeName: '1', // 当前显示的tab
      filterText: '', // 树过滤值
      defaultExpand: [], // 树形默认展开节点
      dimensionMeasure: [{
        _id: 1,
        displayColumn: '维度',
        index: 'dimension_p_1',
        children: []
      }, {
        _id: 2,
        index: 'measure_p_1',
        displayColumn: '度量',
        children: []
      }],
      dimensionMeasureTableData: [],
      dataLoading: false
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    // 初始化
    if (this.dataSet.id) {
      this.dataSetValue = JSON.parse(JSON.stringify(this.dataSet))
      this.getTableData(this.dataSet.id)
      this.$nextTick(() => {
        this.defaultExpand = []
        this.defaultExpand.push(this.dataSet.id)
        this.$refs.tree.setCurrentKey(this.dataSet.id)
      })
    }
  },
  methods: {
    // 过滤数据
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击树节点
    clickTreeNode (node) {
      // 判断是否点击的不是文件夹
      if (!node.isFolder) {
        this.dataSetValue.id = node._id
        this.dataSetValue.name = node.name
        this.getTableData(node._id)
      } else {
        return
      }
    },
    // 点击已使用选项
    hanldClickOption (id, name) {
      this.dataSetValue.id = id
      this.dataSetValue.name = name
      this.getTableData(id)
    },

    // 获取表格数据
    async getTableData (id) {
      try {
        this.dataLoading = true
        const res = await getDataSetsInfo(id)
        const body = {
          sql: res?.sql,
          sqlVarData: res?.sql.sqlVarData,
          fields: res?.fields
        }
        this.dimensionMeasure = this.getDimensionMeasureData(res.fields)
        const data = await getPreviewData(body)
        this.dimensionMeasureTableData = data.data
        this.dataLoading = false
      } catch (error) {
        console.log(error)
      }
    },

    // 获取table data
    getDimensionMeasureData (fields) {
      if (!fields) return []
      const res = [{
        _id: 1,
        displayColumn: '维度',
        index: 'dimension_p_1',
        children: []
      }, {
        _id: 2,
        index: 'measure_p_1',
        displayColumn: '度量',
        children: []
      }]
      fields.forEach((item, index) => {
        item.index = item.type + '_' + index
        if (item.type === 'Dimension') {
          res[0].children.push(item)
        } else {
          res[1].children.push(item)
        }
      })
      if (res[1].children.length === 0) {
        res.splice(1, 1)
      }
      if (res[0].children.length === 0) {
        res.splice(0, 1)
      }
      this.dimensionMeasure = res
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
$base-bgc: #2e74ff;
::v-deep .el-dialog__body {
  padding: 0;
}
// 维度样式
::v-deep .m-column-1 {
  background-color: #919ff8 !important;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
// 度量样式
::v-deep .m-column-2 {
  background-color: #63cd9f !important;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
::v-deep .column-child {
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  background-color: #fff !important;
}
::v-deep .display-none {
  height: 0px;
  display: none !important;
}
* {
  box-sizing: border-box;
}
.content {
  display: flex;
  height: 460px;
}
.cube-tree-panel {
  height: 100%;
  width: 280px;
  overflow: hidden;
  border-right: 1px solid #e8e8e8;
  background: #fff;
  padding: 0 10px 52px 10px;
  .oper-panel {
    position: absolute;
    width: 280px;
    bottom: 0;
    left: 0;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e8e8e8;
    .el-button {
      width: 232px;
      height: 32px;
    }
  }
}
.tree-box-input {
  padding: 0 8px;
  margin-bottom: 4px;
  position: relative;
  i {
    cursor: pointer;
  }
}
.cube-box-list {
  li {
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cube-list-caption {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    i {
      color: $base-bgc;
    }
  }
  li:hover {
    background-color: rgba(196, 211, 255, 0.2);
  }
}
.cube-data-panel {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .cube-table-container {
    flex: 1;
    overflow: hidden;
  }
}
.footer-box {
  padding: 10px 16px;
  text-align: right;
  height: 52px;
  border-top: 1px solid #e8e8e8;
  .el-button {
    min-width: 108px;
  }
}
</style>
