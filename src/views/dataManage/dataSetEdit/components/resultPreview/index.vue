<template>
  <div class="result-preview-wrap">
    <!-- 存在两种 一种为编辑状态下（运行结果+历史记录） 二为展示状态下（数据预览+批量配置） -->
    <div
      v-if="isEdit"
      class="result-preview-wrap-main"
    >
      <div class="m-tab">
        <div
          :class="[{'active': activeFirstTagName === 1}, 'tab-block']"
          @click="activeFirstTagName = 1"
        >
          运行结果
        </div>
        <div
          :class="[{'active': activeFirstTagName === 2}, 'tab-block']"
          @click="activeFirstTagName = 2"
        >
          历史记录
        </div>
      </div>
      <div v-show="activeFirstTagName === 1">
        <!-- 成功为table -->
        <template v-if="resultData.type !='fail'">
          <!-- 未查询出数据时展示效果 -->
          <template v-if="!resultData.data || resultData.data.length === 0">
            <div style="text-align: center;margin-top: 38px;">
              <svg-icon
                style="width: 371px; height: 200px;"
                icon-class="sql-result-bg"
              />
              <div>
                <span class="result-bg-tip">编辑完代码后，点击上方运行按钮即可查看运</span>
              </div>
            </div>
          </template>
          <!-- 查询出数据时展示效果 -->
          <el-table
            v-else
            border
            header-row-class-name="m-table-header"
            row-class-name="m-table-row"
            :data="resultData.data"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              type="index"
              fixed
              min-width="50"
            />
            <el-table-column
              v-for="(k,i) in resultData.columns"
              :key="i"
              min-width="50"
              show-overflow-tooltip
              :prop="k"
              :label="k"
            />
          </el-table>
        </template>
        <!-- 失败 -->
        <template v-else>
          <div>
            <div class="error-msg-block">
              <div>报错详情</div>
              <div>{{ resultData.msg }}</div>
            </div>
            <div style="text-align: center;margin-top: 38px;">
              <svg-icon
                style="width: 371px; height: 200px;"
                icon-class="sql-result-err-bg"
              />
              <div>
                <span class="result-bg-tip">运行失败，SQL存在错误，请先修改代码</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-show="activeFirstTagName === 2">
        <el-table
          v-if="historyLogTableData && historyLogTableData.length > 0"
          :data="historyLogTableData"
          header-row-class-name="m-table-header"
          style="width: 100%"
        >
          <el-table-column
            prop="createdTime"
            label="开始时间"
            min-width="180"
          />
          <el-table-column
            prop="sqlText"
            label="SQL语句"
            min-width="300"
          />
          <el-table-column
            prop="costTime"
            label="耗时（ms）"
            min-width="80"
          />
          <el-table-column
            prop="result"
            label="运行结果"
            min-width="80"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.result == 'success'">
                <span>成功</span>
              </div>
              <div v-else>
                <span>失败</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="copyHistoryLog(scope.row, $event)"
              >复制</el-button>
            </template>
          </el-table-column>
        </el-table>
        <template v-else>
          <div style="text-align: center;margin-top: 38px;">
            <svg-icon
              style="width: 371px; height: 200px;"
              icon-class="sql-result-bg"
            />
            <div>
              <span class="result-bg-tip">未查询到历史记录</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      v-else
      class="result-preview-wrap-main"
    >
      <div class="result-preview-wrap-main-c">
        <div
          class="m-tab"
          style="justify-content: space-between;"
        >
          <div class="d-f">
            <div
              :class="[{'active': activeSecondTagName === 1}, 'tab-block']"
              @click="activeSecondTagName = 1"
            >数据预览</div>
            <div
              :class="[{'active': activeSecondTagName === 2}, 'tab-block']"
              @click="activeSecondTagName = 2"
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
          v-show="activeSecondTagName === 1"
          class="data-preview"
        >
          <!-- left -->
          <div class="data-preview-left">
            <el-tree
              :data="dimensionMeasure"
              :props="defaultProps"
              default-expand-all
            >
              <div
                slot-scope="{ node, data }"
                class="custom-tree-node d-f f-b-c w-100p"
              >
                <div
                  :class="{'hide-tree-node': (data.attributes && (data.attributes[0] && data.attributes[0].isHidden))}"
                >
                  <b-tooltip :content="data.displayColumn" />
                </div>
                <div
                  v-if="node.isLeaf"
                  class="p-r-10"
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
                      <el-dropdown-item @click.native="() => {copyDimensionMeasure(data, node.parent.data._id)}">
                        <svg-icon
                          icon-class="file-copy"
                          style="margin-right: 5px;"
                        />复制
                      </el-dropdown-item>
                      <template v-if="data.attributes">
                        <el-dropdown-item @click.native="data.attributes[0].isHidden = !data.attributes[0].isHidden">
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
                        @click.native="() => {deleteDimensionMeasure(data, node.parent.data._id)}"
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
              style="width: 100%"
              stripe
            >
              <el-table-column
                v-for="(parent, i) in dimensionMeasure"
                :key="`column-p-${parent._id}`"
                :label="parent.displayColumn"
                :class-name="`m-column-${i}`"
              >
                <template #header="{ column }">
                  <div>{{ column.label }}</div>
                </template>
                <span
                  v-for="(v, index) in parent.children"
                  :key="`column-child-${index}`"
                >
                  <el-table-column
                    v-if="!v.attributes[0].isHidden"
                    :prop="v.column"
                    width="130"
                    class-name="column-child"
                    :label="v.displayColumn"
                    show-overflow-tooltip
                  >
                    <template #header="{ column }">
                      <b-tooltip :content="column.label" />
                      <div class="d-f f-b-c">
                        <div>{{ v.attributes[0].dataType }}</div>
                        <div>
                          <el-dropdown trigger="click">
                            <el-button type="text">
                              <svg-icon icon-class="gear" />
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item
                                icon="el-icon-edit-outline"
                                @click.native="editDimensionMeasure(v)"
                              >编辑</el-dropdown-item>
                              <el-dropdown-item @click.native="copyDimensionMeasure(v, parent._id)">
                                <svg-icon
                                  icon-class="file-copy"
                                  style="margin-right: 5px;"
                                />复制
                              </el-dropdown-item>
                              <el-dropdown-item @click.native="v.attributes[0].isHidden = !v.attributes[0].isHidden">
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
                                @click.native="deleteDimensionMeasure(v, parent._id)"
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
                  <div>
                    <div class="result-bg-tip">
                      你可以点击右侧的
                      <span style="font-weight: 400;color: #595959; font-size:14px;">
                        <i class="el-icon-refresh" /> 刷新预览
                      </span>
                    </div>
                    <div class="result-bg-tip">
                      来预览并配置数据
                    </div>
                  </div>
                </div>
              </template>
            </el-table>
          </div>
        </div>
        <div
          v-show="activeSecondTagName === 2"
          style="width: 65vw"
        >
          <el-table
            :data="batchConfigTableData"
            style="width: 100%;"
            row-key="displayColumn"
            default-expand-all
            header-row-class-name="m-table-header"
            class="batch-config-table-data"
            :tree-props="{children: 'children'}"
          >
            <el-table-column
              label="名称字段"
              prop="displayColumn"
              width="360"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'">
                  <span>{{ scope.row.displayColumn }}</span>
                </div>
                <div v-else>
                  <el-input v-model="scope.row.displayColumn" />
                </div>
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
                <div v-if="scope.row.displayColumn === '维度' || scope.row.displayColumn === '度量'" />
                <div v-else>
                  <el-select
                    v-model="scope.row.attributes[0].dataType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in batchConfigurationDataTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
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
                  <span @click="copyBatchConfiguration(scope.row)">复制</span>
                  <el-divider direction="vertical" />
                  <span @click="deleteBatchConfiguration(scope.row)">删除</span>
                  <el-divider direction="vertical" />
                  <span @click="hideBatchConfiguration(scope.row)">
                    {{ scope.row.attributes[0].isHidden ? '取消隐藏' : '隐藏' }}
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from '@/utils/clipboard.js'
import { deepClone } from '@/utils/optionUtils'
import { getSqlRunningLogs, getPreviewData } from '@/api/dataSet'
export default {
  name: 'ResultPreview',
  props: {
    runResultData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    sqlParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    sqlId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    sqlVarData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dataSetInfo: null,
      activeFirstTagName: 1,
      activeSecondTagName: 1,
      historyLogTableData: [],
      inputFieldName: '',
      dimensionMeasure: [{
        _id: 1,
        displayColumn: '维度',
        children: []
      }, {
        _id: 2,
        displayColumn: '度量',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'displayColumn'
      },
      dimensionMeasureTableData: [],
      batchConfigTableData: [
        {
          _id: '',
          displayColumn: '维度',
          children: []
        },
        {
          _id: '',
          displayColumn: '度量',
          children: []
        }
      ],
      batchConfigurationDataTypeOptions: [
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
      dataSetFields: [],
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
      resultData: {},
      currentSqlId: this.sqlId
    }
  },
  computed: {},
  watch: {
    fields: function (newVal, oldVal) {
      this.dataSetFields = newVal.slice()
      this.dimensionMeasure = JSON.parse(JSON.stringify(this.getDimensionMeasureData(newVal.slice())))
      this.batchConfigTableData = this.getBatchConfigTableData(newVal.slice())
    },
    runResultData: function (newVal, oldVal) {
      if (this.currentSqlId !== newVal._id) {
        this.currentSqlId = newVal._id
      }
      const data = this.formatRunResultData(newVal)
      this.resultData = JSON.parse(JSON.stringify(data))
    },
    dataSetFields: {
      handler (newVal, oldVal) {
        // 这里 dataSetFields 等同于 父级的 fields 字段，子级有变化通知父级更改（合并的策略由父级处理）
        this.dimensionMeasure = JSON.parse(JSON.stringify(this.getDimensionMeasureData(newVal.slice())))
        this.$emit('dataSetFieldsChange', newVal)
      },
      deep: true
    }
  },
  mounted () {
    this.dataSetInfo = this.$route.query
    const fields = this.fields.slice()
    this.dataSetFields = fields.slice()
    this.dimensionMeasure = JSON.parse(JSON.stringify(this.getDimensionMeasureData(fields.slice())))
    this.batchConfigTableData = this.getBatchConfigTableData(fields.slice())
  },
  methods: {
    // 切换tags触发的事件
    handleClickTagsFirst (tab) {
      if (tab.name === 'historyLog') {
        this.getHistory()
      }
    },
    async getHistory () {
      if (this.currentSqlId) {
        try {
          const data = await getSqlRunningLogs(this.currentSqlId)
          this.historyLogTableData = data.slice()
        } catch (error) {
          console.log(error)
        }
      }
    },
    async handleClickTagsSecond (tab) {
      console.log(tab.name)
    },
    // 复制
    copyHistoryLog (val, event) {
      const str = val.sqlText
      Clipboard(str, event)
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
          res[0].children.push({ ...item })
        } else {
          res[1].children.push({ ...item })
        }
      })
      return res
    },
    // 删除数据预览中的字段
    deleteDimensionMeasure (item, id) {
      this.$dialog.show('TipDialog', {}, () => {
        this.dimensionMeasure.forEach(di => {
          if (di._id === id) {
            const index = di.children.findIndex(a => a._id === item._id)
            di.children.splice(index, 1)
          }
        })
      })
    },
    // 复制数据预览中的字段
    copyDimensionMeasure (item, id) {
      this.dimensionMeasure.forEach(di => {
        if (di._id === id) {
          const index = di.children.findIndex(a => a._id === item._id)
          const copyItem = Object.assign(deepClone(item), { _id: '', displayColumn: item.displayColumn + '_副本' })
          di.children.splice(index + 1, 0, copyItem)
        }
      })
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
    // 刷新预览
    async refreshPreview () {
      this.activeSecondTagName = 1
      const sql = {}
      sql._id = this.sqlParams._id
      sql.dataSourceId = this.sqlParams.dataSourceId
      sql.sql = this.sqlParams.sql
      sql.sqlVariables = this.sqlParams.sqlVariables
      const body = {}
      body.sql = sql
      body.sqlVarData = this.sqlParams.sqlVarData
      body.fields = this.dataSetFields
      body.sqlVarData = this.sqlVarData
      console.log('body', body)
      try {
        const data = await getPreviewData(body)
        this.dimensionMeasureTableData = data.data.slice()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取批量配置数据
    getBatchConfigTableData (fields) {
      const res = [
        {
          displayColumn: '维度',
          children: []
        },
        {
          displayColumn: '度量',
          children: []
        }
      ]
      if (!fields) return res
      const tmp = fields.slice()
      tmp.forEach(i => {
        if (i.type === 'Measure') {
          if (!i.attributes) {
            i.attributes = [{}]
          }
          res[1].children.push(i)
        } else {
          res[0].children.push(i)
        }
      })
      return res
    },
    // 隐藏 & 取消隐藏
    hideBatchConfiguration (val) {
      const tmp = this.dataSetFields.slice()
      tmp.forEach(i => {
        if (i._id === val._id) {
          i.attributes.forEach((item, idx) => {
            if (!idx) {
              item.isHidden = !item.isHidden
            }
          })
          console.log(i.attributes)
        }
      })
      this.dataSetFields = tmp.slice()
      this.batchConfigTableData = this.getBatchConfigTableData(tmp.slice()).slice()
    },
    // 删除
    deleteBatchConfiguration (val) {
      const tmp = this.dataSetFields.slice()
      let _idx = 0
      tmp.forEach((i, idx) => {
        if (i._id === val._id) {
          _idx = idx
        }
      })
      tmp.splice(_idx, 1)
      this.dataSetFields = tmp.slice()
      this.batchConfigTableData = this.getBatchConfigTableData(tmp.slice()).slice()
    },
    // 复制
    copyBatchConfiguration (val) {
      const tmp = this.dataSetFields.slice()
      const displayColumnList = []
      let copy = {}
      // let idx = 0
      tmp.forEach((item, i) => {
        displayColumnList.push(item.displayColumn)
        if (item._id === val._id) {
          // idx = i
          copy = JSON.parse(JSON.stringify(item))
        }
      })
      if (!copy) return false
      copy._id = ''
      let _displayColumn = val.displayColumn
      _displayColumn += '_副本'
      while (displayColumnList.indexOf(_displayColumn) > -1) {
        _displayColumn = val.displayColumn + '_副本' + (Number(_displayColumn.slice(_displayColumn.lastIndexOf('_副本') + 3)) + 1)
      }
      copy.displayColumn = _displayColumn
      tmp.push(copy)
      this.dataSetFields = tmp.slice()
      this.batchConfigTableData = this.getBatchConfigTableData(tmp.slice()).slice()
    },
    // 格式化 运行结果
    formatRunResultData (val) {
      // success == true 为成功的结果
      if (val.success) {
        const _res = {
          columns: [],
          data: [],
          type: 'success'
        }
        val.result['columns'].forEach(item => {
          _res.columns.push(item.name)
        })
        _res.data = val.result['data'].slice()
        return _res
      } else {
        const _res = {
          type: 'fail',
          msg: val.msg
        }
        return _res
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.result-preview-wrap-main {
  &-c {
    position: relative;
  }

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
    display: flex;
    min-height: 300px;
    &-left {
      width: 200px;
      box-sizing: border-box;
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      border-left: 1px solid rgba(0, 0, 0, 0.06);

      .custom-tree-node {
        .hide-tree-node {
          color: #ccc;
        }
      }
    }
    &-right {
      flex: 1;
    }
  }
}

.result-preview-batch-configuration-table-options {
  color: #fa8334;
  text-align: left;
  font-weight: 400;
}
.result-preview-batch-configuration-table-options > span {
  cursor: pointer;
}
.result-bg-tip {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 20px;
}

.error-msg-block {
  border: 1px solid #ffa4a3;
  background-color: #ffecec;
  min-height: 60px;
  line-height: 20px;
  padding: 10px 16px 24px 16px;
}

// 为了实现UI设计同时支持表头resize，这里设置边框为0，但是要在table加上边框属性
::v-deep .m-table-header > th {
  background-color: #fafafa !important;
  color: rgba(0, 0, 0, 0.9);
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}
::v-deep .m-table-row > td {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}
::v-deep .el-table--border {
  border-width: 0px;
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
::v-deep .column-child {
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  background-color: #fff !important;
}
</style>
