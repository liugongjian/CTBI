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
            @click="activeTagName = 1;refreshPreview();"
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
              <div :class="[{ 'hide-tree-node': (data.attributes && data.attributes[0].isHidden) }, 'd-f']">
                <svg-icon
                  v-if="data.attributes"
                  style="width: 20px;height: 18px;margin-right: 6px;"
                  :icon-class="typeTransform(data)"
                />
                <b-tooltip
                  :content="data.displayColumn"
                  width="100px"
                />
              </div>
              <div
                v-if="node.isLeaf"
                class="p-r-10 gear-btn"
              >
                <gear-btn
                  :active-tag-name="activeTagName"
                  :data="data"
                  :fields="fields"
                  @reset="getDimensionMeasureData(fields);refreshPreview();"
                />
              </div>
            </div>
          </el-tree>
        </div>

        <!-- right -->
        <!-- gutter-th 由于表头与表体不对齐，el-table会默认追加gutter，这边选择隐藏 -->
        <div class="data-preview-right">
          <el-table
            v-loading="previewLoading"
            element-loading-text="拼命加载中"
            :data="dimensionMeasureTableData"
            class="gutter-th"
            :height="tableHeight"
            empty-text=" "
            stripe
          >
            <template v-for="(parent, i) in dimensionMeasure">
              <el-table-column
                v-if="!parent.isHidden"
                :key="`column-p-${i}`"
                :label="parent.displayColumn"
                :class-name="`m-column-${parent._id}`"
              >
                <template #header="{ column }">
                  <div class="d-f">
                    <div>
                      <svg-icon
                        style="width: 12px; height: 12px;margin-right: 6px;"
                        :icon-class="parent.icon"
                      />
                    </div>
                    <div>
                      {{ column.label }}
                    </div>
                  </div>
                </template>
                <template v-for="(v) in parent.children">
                  <el-table-column
                    v-if="(v.attributes && !v.attributes[0].isHidden)"
                    :key="`column-child-${v.index}-${v.$treeNodeId}`"
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
                      <div class="d-f f-b-c">
                        <div>
                          <svg-icon
                            style="width: 20px;"
                            :icon-class="typeTransform(v)"
                          />
                        </div>
                        <gear-btn
                          :active-tag-name="activeTagName"
                          :data="v"
                          :fields="fields"
                          @reset="getDimensionMeasureData(fields);refreshPreview();"
                        />
                      </div>
                    </template>
                    <template slot-scope="{ row, column }">
                      {{ row[column.property] | strEmptyFilter }}
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div
          v-if="dimensionMeasureTableData.length === 0"
          style="position: absolute; top: 40%; left: 40%;"
        >
          <div style="text-align: center;margin-top: 38px; width: 100%;">
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
        </div>
      </div>
      <div v-show="activeTagName === 2">
        <el-table
          :data="dimensionMeasure"
          :height="tableHeight"
          row-key="index"
          default-expand-all
          :row-class-name="tableRowClassName"
          style="width: 100%"
          header-row-class-name="m-table-header"
          :tree-props="{children: 'children'}"
        >
          <el-table-column
            label="名称字段"
            prop="displayColumn"
            min-width="360"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row._id === 1 || scope.row._id === 2"
                style="display: inline-block;"
              >
                <div class="left-divider" />
                {{ scope.row.displayColumn }}
              </div>
              <span
                v-else
                style="display: inline-block;width: calc(100% - 60px);"
              >
                <re-input
                  v-model="scope.row.displayColumn"
                  :max-length="50"
                  :blur-fun="(newVal, oldVal) => {return handlerBlur(newVal, oldVal, scope.row.index)}"
                  @blur="(val) => { handleBlur(val, scope.row) }"
                />
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
              <span v-if="scope.row._id !== 1 && scope.row._id !== 2">
                <!-- value选中值， valueItem选中值对象 -->
                <b-select
                  :value="resetDataType(scope.row)"
                  :options="dataTypeOptions"
                  @change="(value, valueItem) => {handleChangeDataType(value, valueItem, scope.row);}"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="默认聚合"
            min-width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row._id !== 1 && scope.row._id !== 2 && scope.row.type === 'Measure'">
                <b-select
                  v-model="scope.row.attributes[0].aggregator"
                  :options="aggFunctions"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数值展示格式"
            min-width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row._id !== 1 && scope.row._id !== 2 && scope.row.type === 'Measure'">
                <b-select
                  v-model="scope.row.attributes[0].format"
                  :options="formatMap[scope.row.attributes[0].dataType]"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="字段描述"
            min-width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row._id !== 1 && scope.row._id !== 2">
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
            min-width="150"
          >
            <template slot-scope="scope">
              <div v-if="scope.row._id !== 1 && scope.row._id !== 2">
                <gear-btn
                  :active-tag-name="activeTagName"
                  :data="scope.row"
                  :fields="fields"
                  @reset="getDimensionMeasureData(fields);refreshPreview();"
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
import regex from '@/constants/regex'
import { transformDataTypeIcon, getFieldsTable, getFieldsTree } from '@/utils/optionUtils'
import GearBtn from '@/views/dataManage/dataSet/dataSetEdit/GearBtn'
import ReInput from '@/views/dataManage/dataSet/dataSetEdit/ReInput'
import { DataTypeOptions, FormatMap, AggFunctionOptions } from '@/constants/constants'

export default {
  components: { GearBtn, ReInput },
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
      // tab标识 1：数据预览； 2：批量配置
      activeTagName: 1,
      // 数据预览中搜索输入框值
      inputFieldName: '',
      defaultProps: {
        children: 'children',
        label: 'displayColumn'
      },
      previewLoading: false,
      // 维度&度量 表头
      dimensionMeasure: [],
      // 维度&度量 表格数据
      dimensionMeasureTableData: [],
      fieldsTable: [],
      fieldsTree: [],

      dataTypeOptions: DataTypeOptions,
      formatMap: FormatMap,
      aggFunctions: AggFunctionOptions,
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
    tableRowClassName ({ row, rowIndex }) {
      if (row._id === 1) {
        return 'dimension-column-row'
      } else if (row._id === 2) {
        return 'measure-column-row'
      }
      return ''
    },
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
        fields: this.fields
      }
      try {
        this.previewLoading = true
        const data = await getPreviewData(body)
        this.dimensionMeasureTableData = data.data.slice()
      } catch (error) {
        console.log(error)
      } finally {
        this.previewLoading = false
      }
    },
    getDimensionMeasureData (fields) {
      this.dimensionMeasure = getFieldsTable(fields)
      this.fieldsTable = getFieldsTable(fields)
      this.fieldsTree = getFieldsTree(fields)
    },
    typeTransform (data) {
      const temp = this.resetDataType(data)
      return transformDataTypeIcon(temp)
    },
    handlerBlur (newVal, oldVal, index) {
      if (regex.DATASET_NAME_REGEX.test(newVal)) {
        const temp = this.fields.find(item => { return (item.displayColumn === newVal && item.index !== index) })
        if (temp) {
          this.$message.error('字段名称和其他对象存在重名，请检查！')
          return false
        } else {
          return true
        }
      } else {
        this.$message.error('字段名称只能由中英文、数字及下划线、斜线、反斜线、竖线、小括号、中括号组成！')
        return false
      }
    },
    // 转换字段类型
    // 从attributes中获取，若存在二级、三级字段类型，获取第三级
    resetDataType (row) {
      const { attributes } = row
      if (attributes) {
        const { secondeDataType, dataType } = attributes[0]
        if (secondeDataType) {
          return attributes[0][secondeDataType]
        }
        return dataType
      }
      return ''
    },
    handleChangeDataType (value, item, row) {
      row.attributes[0].format = ''
      row.attributes[0].aggregator = 'sum'
      const { originValue, parentValue } = item
      if (originValue) {
        row.attributes[0].dataType = originValue
      } else {
        row.attributes[0].dataType = value
      }
      if (parentValue) {
        row.attributes[0].secondeDataType = parentValue
        row.attributes[0][parentValue] = value
      }
    },
    handleBlur (val, item) {
      item.attributes[0].displayColumn = val
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
        border-right: 1px solid #dddddd;
        border-left: 1px solid #dddddd;
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
        padding-left: 16px;
        width: 100%;
      }
    }
  }
}

// 由于表头与表体不对齐，el-table会默认追加gutter，这边选择隐藏
::v-deep .gutter-th {
  .is-group.has-gutter {
    tr th.gutter {
      display: none !important;
      width: 0px !important;
    }
  }
}

.left-divider {
  position: absolute;
  width: 4px;
  background-color: #fa8334;
  height: calc(100% + 2px);
  left: 0px;
  top: -1px;
}

::v-deep .dimension-column-row > td,
.dimension-column-row:hover > td {
  background: rgba(145, 159, 248, 0.11) !important;
}

::v-deep .measure-column-row > td,
.measure-column-row:hover > td {
  background: rgba(99, 205, 159, 0.11) !important;
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
  height: 0px;
  display: none !important;
}
</style>
