<template>
  <div class="main-bar">
    <div class="main-preview bg-c-fff">
      <div
        class="m-tab"
        style="justify-content: space-between;"
      >
        <div class="d-f">
          <div
            :class="[{'active': activeTagName === 1}, 'tab-block']"
            @click="activeTagName = 1"
          >数据预览</div>
          <div
            :class="[{'active': activeTagName === 2}, 'tab-block']"
            @click="activeTagName = 2"
          >批量配置</div>
        </div>
        <div class="d-f">
          <el-input
            v-model="inputFieldName"
            placeholder="请输入字段名称"
            prefix-icon="el-icon-search"
            style="margin-right: 24px;height: 32px;"
            @change="filterColumns"
          />
          <el-button
            type="primary"
            icon="el-icon-refresh"
            style="height: 32px;"
            @click="refreshPreview"
          >刷新预览</el-button>
        </div>
      </div>
      <div
        v-show="activeTagName === 1"
        class="data-preview d-f"
      >
        <!-- left -->
        <div
          class="data-preview-left"
          :style="{ height: tableHeight + 'px' }"
        >
          <el-tree
            style="width: 200px"
            :data="dimensionMeasure"
            :props="defaultProps"
            default-expand-all
          >
            <div
              slot-scope="{ node, data }"
              class="custom-tree-node d-f f-b-c w-100p"
            >
              <div :class="{ 'hide-tree-node': (data.attributes && data.attributes[0].isHidden) }">
                <b-tooltip :content="data.displayColumn" />
              </div>
              <div
                v-if="node.isLeaf"
                class="p-r-10 gear-btn"
              >
                <gear-btn
                  :active-tag-name="activeTagName"
                  :data="data"
                  :fields="fields"
                  @reset="getDimensionMeasureData(fields)"
                />
              </div>
            </div>
          </el-tree>
        </div>

        <!-- right -->
        <div class="data-preview-right">
          <el-table
            :data="dimensionMeasureTableData"
            :height="tableHeight"
            style="width: 100%"
            stripe
          >
            <el-table-column
              v-for="(parent, i) in dimensionMeasure"
              :key="`column-p-${i}`"
              :label="parent.displayColumn"
              :class-name="`m-column-${i}`"
            >
              <el-table-column
                v-for="(v, index) in parent.children"
                :key="`column-child-${index}`"
                class-name="display-none"
              >
                <el-table-column
                  v-if="!v.attributes[0].isHidden"
                  :prop="v.column"
                  width="120"
                  class-name="column-child"
                  :label="v.displayColumn"
                  show-overflow-tooltip
                >
                  <template #header="{ column }">
                    <b-tooltip
                      :content="column.label"
                      :width="'100px'"
                    />
                    <div class="d-f f-b-c">
                      <div>{{ v.attributes[0].dataType }}</div>
                      <gear-btn
                        :active-tag-name="activeTagName"
                        :data="v"
                        :fields="fields"
                        @reset="getDimensionMeasureData(fields)"
                      />
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>

            <template slot="empty">
              <div style="text-align: center;margin-top: 38px;">
                <svg-icon
                  style="width: 371px; height: 200px;"
                  icon-class="refresh-preview"
                />
                <div
                  class="result-bg-tip"
                  style="line-height: 20px;"
                >
                  <div>
                    你可以点击右侧的
                    <span style="font-weight: 400;color: #595959; font-size:14px;">
                      <i class="el-icon-refresh" /> 刷新预览
                    </span>
                  </div>
                  <div>
                    来预览并配置数据
                  </div>
                </div>
              </div>
            </template>
          </el-table>
        </div>
      </div>
      <div v-show="activeTagName === 2">
        <el-table
          :data="dimensionMeasure"
          :height="tableHeight"
          row-key="index"
          default-expand-all
          style="width: 100%"
          header-row-class-name="m-table-header"
          :tree-props="{children: 'children', hasChildren: 'isFolder'}"
        >
          <el-table-column
            label="名称字段"
            prop="displayColumn"
            min-width="360"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'">
                {{ scope.row.displayColumn }}
              </span>
              <span
                v-else
                style="display: inline-block;width: calc(100% - 60px);"
              >
                <el-input v-model="scope.row.displayColumn" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="column"
            label="物理字段名"
            min-width="180"
          />
          <el-table-column
            label="字段类型"
            min-width="180"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
              <span v-else>
                <el-select
                  v-model="scope.row.attributes[0].dataType"
                  placeholder="请选择"
                  @change="scope.row.attributes[0].format = ''"
                >
                  <el-option
                    v-for="item in dataTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="数值展示格式"
            min-width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
              <div v-else-if="scope.row.type === 'Measure'">
                <el-select
                  v-model="scope.row.attributes[0].format"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in formatMap[scope.row.attributes[0].dataType]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="字段描述"
            min-width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
              <div v-else>
                <el-input
                  v-model="scope.row.comment"
                  placeholder="请输入内容"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            min-width="200"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
              <div v-else>
                <gear-btn
                  :active-tag-name="activeTagName"
                  :data="scope.row"
                  :fields="fields"
                  @reset="getDimensionMeasureData(fields)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getPreviewData } from '@/api/dataSet'
import GearBtn from '@/views/dataManage/dataSet/dataSetEdit/GearBtn'

export default {
  components: { GearBtn },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    sql: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      activeTagName: 1,
      inputFieldName: '',
      defaultProps: {
        children: 'children',
        label: 'displayColumn'
      },
      dimensionMeasure: [],
      dimensionMeasureTableData: [],
      dataTypeOptions: [
        {
          value: 'number',
          label: '数字'
        },
        {
          value: 'text',
          label: '文本'
        },
        {
          value: 'time',
          label: '时间'
        }
      ],
      formatMap: {
        text: [],
        number: [
          {
            label: '整数',
            value: '#,##0'
          },
          {
            label: '保留1位小数',
            value: '#,##0.0'
          },
          {
            label: '保留2位小数',
            value: '#,##0.00'
          },
          {
            label: '百分比',
            value: '#,##0%'
          },
          {
            label: '百分比1位小数',
            value: '#,##0.0%'
          },
          {
            label: '百分比2位小数',
            value: '#,##0.00%'
          }
        ],
        time: [
          {
            label: '年-月-日 时-分秒',
            value: 'YYYY-MM-DD HH:mm:ss'
          }
        ]
      },
      tableHeight: 320
    }
  },
  watch: {
    fields: {
      handler (n, o) {
        this.getDimensionMeasureData(n)
      },
      deep: true
    }
  },
  methods: {
    filterColumns () {
      if (this.inputFieldName) {
        const filter = this.fields.filter(field => field.displayColumn.indexOf(this.inputFieldName) > -1)
        this.getDimensionMeasureData(filter)
      } else {
        this.getDimensionMeasureData(this.fields)
      }
    },
    getRowKey (row) {
      return row._id + row.displayColumn + row.$treeNodeId
    },
    setTableHeight (h) {
      if (h === '0px') return
      try {
        const height = Number.parseInt(h.replace('px'))
        this.tableHeight = height - 80
      } catch (err) {
        console.error('传入高度需为带px结尾的字符串')
      }
    },
    // 刷新预览
    async refreshPreview () {
      const body = {
        sql: this.sql,
        sqlVarData: this.sql.sqlVarData,
        fields: this.fields
      }
      try {
        const data = await getPreviewData(body)
        this.dimensionMeasureTableData = data.data.slice()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取tree data
    getDimensionMeasureData (fields) {
      if (!fields) return []
      const res = [{
        _id: 1,
        displayColumn: '维度',
        children: []
      }, {
        _id: 2,
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
      this.dimensionMeasure = res
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.main-bar {
  width: 100%;
  height: calc(100vh - 166px);
  display: inline-block;
  position: relative;

  .main-edit {
    height: 40%;
  }

  .main-preview {
    position: relative;
    padding: 16px;
    height: auto;

    .m-tab {
      border-bottom: 1px solid #dddddd;
      display: flex;
      margin-bottom: 16px;

      .tab-block {
        line-height: 20px;
        background-color: #f4f5f6;
        padding: 10px 22px;
        border: 1px solid #ddd;
        position: relative;
        top: 1px;
        border-bottom-width: 1px;
        color: rgba(0, 0, 0, 0.65);
        border-radius: 2px 2px 0px 0px;
        cursor: pointer;

        &:first-of-type {
          border-right-width: 0px;
        }

        &.active {
          background-color: #fff;
          border-bottom-color: #fff;
          color: #fa8334;
        }
      }
    }

    .data-preview {
      .data-preview-left {
        width: 200px;
        flex: 0 0 200px;
        overflow-y: auto;
        overflow-x: hidden;

        .custom-tree-node {
          .hide-tree-node {
            color: #ccc;
          }

          &:hover > .gear-btn {
            display: block;
          }
          .gear-btn {
            display: none;
          }
        }
      }

      .data-preview-right {
        overflow: auto;
      }
    }
  }
}
// 维度样式
::v-deep .m-column-0 {
  background-color: #919ff8 !important;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
// 度量样式
::v-deep .m-column-1 {
  background-color: #63cd9f !important;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
::v-deep .m-table-header > th {
  background-color: #fafafa !important;
  color: rgba(0, 0, 0, 0.9);
}
::v-deep .column-child {
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  background-color: #fff !important;
}
::v-deep .display-none {
  display: none !important;
}
</style>
