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
            style="margin-right: 24px"
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
              <div
                :class="{'hide-tree-node': (data.attributes && (data.attributes[0] && data.attributes[0].isHidden))}">
                <b-tooltip :content="data.displayColumn" />
              </div>
              <div
                v-if="node.isLeaf"
                class="p-r-10 gear-btn"
              >
                <el-dropdown trigger="click">
                  <el-button type="text">
                    <svg-icon icon-class="gear" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      icon="el-icon-edit-outline"
                      @click.native="editDimensionMeasure(data)"
                    >编辑</el-dropdown-item>
                    <el-dropdown-item @click.native="() => {copyDimensionMeasure(data)}">
                      <svg-icon
                        icon-class="file-copy"
                        style="margin-right: 5px;"
                      />复制
                    </el-dropdown-item>
                    <template v-if="data.attributes">
                      <el-dropdown-item @click.native="hideDimensionMeasure(data)">
                        <span v-if="!data.attributes[0].isHidden">
                          <svg-icon
                            icon-class="m-eye-close"
                            style="margin-right: 5px;"
                          />隐藏
                        </span>
                        <span v-else>
                          <svg-icon
                            icon-class="eye-open"
                            style="margin-right: 5px;"
                          />显示
                        </span>
                      </el-dropdown-item>
                    </template>
                    <el-dropdown-item
                      icon="el-icon-delete"
                      @click.native="() => {deleteDimensionMeasure(data)}"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
              :key="`column-p-${parent.label}-${i}`"
              :label="parent.displayColumn"
              :class-name="`m-column-${i}`"
            >
              <template #header="{ column }">
                <div>{{ column.label }}</div>
              </template>
              <span
                v-for="(v, index) in parent.children"
                :key="`column-child-${v.displayColumn}-${index}`"
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
                    <b-tooltip :content="column.label" />
                    <div class="d-f f-b-c">
                      <div>{{ v.attributes[0].dataType }}</div>
                      <div class="gear-btn">
                        <el-dropdown trigger="click">
                          <el-button type="text">
                            <svg-icon icon-class="gear" />
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              icon="el-icon-edit-outline"
                              @click.native="editDimensionMeasure(v)"
                            >编辑</el-dropdown-item>
                            <el-dropdown-item @click.native="copyDimensionMeasure(v)">
                              <svg-icon
                                icon-class="file-copy"
                                style="margin-right: 5px;"
                              />复制
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="hideDimensionMeasure(v)">
                              <span v-if="!v.attributes[0].isHidden">
                                <svg-icon
                                  icon-class="m-eye-close"
                                  style="margin-right: 5px;"
                                />隐藏
                              </span>
                              <span v-else>
                                <svg-icon
                                  icon-class="eye-open"
                                  style="margin-right: 5px;"
                                />显示
                              </span>
                            </el-dropdown-item>
                            <el-dropdown-item
                              icon="el-icon-delete"
                              @click.native="deleteDimensionMeasure(v)"
                            >删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </span>
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
      <div
        v-show="activeTagName === 2"
        style="width: 65vw"
      >
        <el-table
          :data="dimensionMeasure"
          :height="tableHeight"
          :row-key="getRowKey"
          default-expand-all
          header-row-class-name="m-table-header"
          :tree-props="{children: 'children', hasChildren: 'isFolder'}"
        >
          <el-table-column
            label="名称字段"
            prop="displayColumn"
            width="360"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'">
                {{ scope.row.displayColumn }}
              </span>
              <span
                v-else
                style="display: inline-block;width: calc(100% - 60px);"
              >
                <el-input v-model="fields[getFieldsIndex(scope.row)].displayColumn" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="column"
            label="物理字段名"
            width="180"
          />
          <el-table-column
            label="字段类型"
            width="180"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
              <span v-else>
                <el-select
                  v-model="fields[getFieldsIndex(scope.row)].attributes[0].dataType"
                  placeholder="请选择"
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
            width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
              <div v-else>
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
            width="180"
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
            min-width="200"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
              <div
                v-else
                class="result-preview-batch-configuration-table-options"
              >
                <el-button
                  type="text"
                  @click="copyDimensionMeasure(scope.row)"
                >复制</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="deleteDimensionMeasure(scope.row)"
                >删除</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="hideDimensionMeasure(scope.row)"
                >
                  {{ scope.row.attributes[0].isHidden ? '取消隐藏' : '隐藏' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/optionUtils'
import { getPreviewData } from '@/api/dataSet'

export default {
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
        this.dimensionMeasure = this.getDimensionMeasureData(n)
      },
      deep: true
    }
  },
  methods: {
    getFieldsIndex (row) {
      return this.fields.findIndex(field => field.$treeNodeId === row.$treeNodeId)
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
      fields.forEach(item => {
        if (item.type === 'Dimension') {
          res[0].children.push(item)
        } else {
          res[1].children.push(item)
        }
      })
      return res
    },
    // 编辑数据预览中的字段
    editDimensionMeasure (item) {
      this.$dialog.show('EditDimensionMeasureDialog', { form: item }, (data) => {
        if (!data.displayColumn) {
          data.displayColumn = data.column
        }
        Object.assign(item, data)
      })
    },
    // 复制数据预览中的字段
    copyDimensionMeasure (item) {
      const copyItem = Object.assign(deepClone(item), { _id: '', displayColumn: item.displayColumn + '_副本' })
      this.$set(this.fields, this.fields.length, copyItem)
      this.dimensionMeasure = this.getDimensionMeasureData(this.fields)
    },
    // 删除数据预览中的字段
    deleteDimensionMeasure (item) {
      this.$dialog.show('TipDialog', {}, () => {
        const index = this.fields.findIndex(field => field._id === item._id)
        this.fields.splice(index, 1)
      })
      this.dimensionMeasure = this.getDimensionMeasureData(this.fields)
    },
    // 隐藏
    hideDimensionMeasure (item) {
      item.attributes[0].isHidden = !item.attributes[0].isHidden
    }
  }
}
</script>
<style lang="scss" scoped>
.main-bar {
  width: calc(100vw - 458px);
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

  // &:hover > .gear-btn {
  //   display: block;
  // }

  // .gear-btn {
  //   display: none;
  // }
}
</style>
