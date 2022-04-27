<template>
  <div class="result-preview-wrap">
    <!-- 存在两种 一种为编辑状态下（运行结果+历史记录） 二为展示状态下（数据预览+批量配置） -->
    <div v-if="isEdit" class="result-preview-wrap-main">
      <el-tabs v-model="activeFirstTagName" type="card" @tab-click="handleClickTagsFirst">
        <el-tab-pane label="运行结果" name="runResult">
          <!-- 成功为table -->
          <template v-if="formatRunResultData.type =='success'">
            <el-table
              :data="formatRunResultData.tableData"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              />
              <el-table-column
                v-for="(k,i) in formatRunResultData"
                :key="i"
                :prop="k"
                :label="k"
                width="180"
              />
            </el-table>
          </template>
          <!-- 失败 -->
          <template v-eles />
        </el-tab-pane>
        <el-tab-pane label="历史记录" name="historyLog">
          <el-table
            :data="historyLogTableData"
            style="width: 100%"
          >
            <el-table-column
              prop="createdTime"
              label="开始时间"
              width="180"
            />
            <el-table-column
              prop="sqlText"
              label="SQL语句"
              width="180"
            />
            <el-table-column
              prop="costTime"
              label="耗时（ms）"
              width="180"
            />
            <el-table-column
              prop="result"
              label="运行结果"
              width="180"
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
              width="100"
            >
              <template slot-scope="scope">
                <span @click="copyHistoryLog(scope.row)">复制</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="result-preview-wrap-main">
      <div class="result-preview-wrap-main-c">
        <div class="result-preview-wrap-main-c-top">
          <el-input
            v-model="inputFieldName"
            placeholder="请输入字段名称"
            prefix-icon="el-icon-search"
            style="margin-right: 24px"
          />
          <el-button type="primary" icon="el-icon-refresh" @click="refreshPreview">刷新预览</el-button>
        </div>
        <el-tabs v-model="activeSecondTagName" @tab-click="handleClickTagsSecond">
          <el-tab-pane label="数据预览" name="dataPreview">
            <div class="data-preview">
              <!-- left -->
              <div class="data-preview-left">
                <el-tree :data="dimensionMeasure" :props="defaultProps" @node-click="handleNodeClick" />
              </div>

              <!-- right -->
              <div class="data-preview-right">
                <el-table
                  :data="dimensionMeasureTableData"
                  style="width: 100%"
                >
                  <el-table-column label="维度">
                    <el-table-column
                      v-for="(v,i) in dimensionMeasureTableColumns.filter(i => i.type === 'Dimension')"
                      :key="i"
                      :prop="v.displayColumn"
                      :label="v.column"
                      min-width="120"
                    />
                  </el-table-column>
                  <el-table-column label="度量">
                    <el-table-column
                      v-for="(v,i) in dimensionMeasureTableColumns.filter(i => i.type === 'Measure')"
                      :key="i"
                      :prop="v.displayColumn"
                      :label="v.column"
                      min-width="120"
                    />
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="批量配置" name="batchConfiguration">
            <div style="width: 65vw">
              <el-table
                :data="batchConfigTableData"
                style="width: 100%;"
                row-key="_id"
                tooltip-effect="dark"
                default-expand-all
                :tree-props="{children: 'children'}"
              >
                <el-table-column
                  prop="column"
                  label="名称字段"
                  width="180"
                />
                <el-table-column
                  prop="displayColumn"
                  label="物理字段名"
                  width="180"
                />
                <el-table-column
                  label="字段类型"
                  width="180"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.column === '维度' || scope.row.column === '度量'" />
                    <div v-else>
                      <el-select v-model="scope.row.attributes.dataType" placeholder="请选择">
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
                  prop="address"
                  label="默认聚合"
                  width="180"
                />
                <el-table-column
                  prop="address"
                  label="数值展示格式"
                  width="180"
                />
                <el-table-column
                  label="字段描述"
                  width="180"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.column === '维度' || scope.row.column === '度量'" />
                    <div v-else>
                      <el-input v-model="scope.row.comment" placeholder="请输入内容" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200">
                  <template slot-scope="scope">
                    <div v-if="scope.row.column === '维度' || scope.row.column === '度量'" />
                    <div v-else class="result-preview-batch-configuration-table-options">
                      <span @click="copyBatchConfiguration(scope.row)">复制</span>
                      <el-divider direction="vertical" />
                      <span @click="deleteBatchConfiguration(scope.row)">删除</span>
                      <el-divider direction="vertical" />
                      <span @click="hideBatchConfiguration(scope.row)">隐藏</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
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
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataSetInfo: null,
      activeFirstTagName: 'runResult',
      activeSecondTagName: 'dataPreview',
      historyLogTableData: [],
      inputFieldName: '',
      dimensionMeasure: [{
        label: '维度',
        children: []
      }, {
        label: '度量',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dimensionMeasureTableData: [],
      dimensionMeasureTableColumns: []
    }
  },
  computed: {
    formatRunResultData: function () {
      // success == true 为成功的结果
      if (this.runResultData.success) {
        const _res = {
          columns: [],
          tableData: [],
          type: 'success'
        }
        this.runResultData.result['columns'].forEach(item => {
          _res.push(item.name)
        })
        _res.tableData = this.runResultData.result['data'].slice()
        return _res
      } else {
        const _res = {
          type: 'fail'
        }
        return _res
      }
    }
  },
  mounted () {
    this.dataSetInfo = this.$route.query
    console.log(this.dataSetInfo, 'this.dataSetInfo')
    const fields = this.dataSetInfo.fields.slice()
    this.dataSetFields = fields.slice()
    this.dimensionMeasure = JSON.parse(JSON.stringify(this.getDimensionMeasureData(fields.slice())))
    this.dimensionMeasureTableColumns = fields.slice()
    this.batchConfigTableData = this.getBatchConfigTableData(fields.slice())
  },
  methods: {
    init () {},
    // 切换tags触发的事件
    async handleClickTagsFirst (tab) {
      if (tab.name === 'historyLog') {
        const sqlId = this.$route.query.sqlId
        try {
          const data = await getSqlRunningLogs(sqlId)
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
    copyHistoryLog (val) {
      console.log(val)
    },
    // 点击节点
    handleNodeClick (data) {
      console.log(data)
    },
    // 获取tree data
    getDimensionMeasureData (fields) {
      if (!fields) return []
      const res = [{
        _id: 1,
        label: '维度',
        children: []
      }, {
        _id: 2,
        label: '度量',
        children: []
      }]
      fields.forEach(item => {
        if (item.type === 'Dimension') {
          res[0].children.push({ label: item.column })
        } else {
          res[1].children.push({ label: item.column })
        }
      })
      return res
    },
    // 刷新预览
    async refreshPreview () {
      this.activeSecondTagName = 'dataPreview'
      const body = {}
      body.sqlId = this.dataSetInfo.sqlId
      try {
        const data = await getPreviewData(body)
        this.dimensionMeasureTableData = data.data.slice()
        this.dimensionMeasureTableColumns = data.fields.slice()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取批量配置数据
    getBatchConfigTableData(fields) {
      const res = [
        {
          column: '维度',
          children: []
        },
        {
          column: '度量',
          children: []
        }
      ]
      if (!fields) return res
      const tmp = fields.filter(i => i.attributes.isHidden && i.status === 1)
      tmp.forEach(i => {
        if (i.type === 'Measure') {
          res[1].children.push(i)
        } else {
          res[0].children.push(i)
        }
      })
      return res
    },
    // 隐藏
    hideBatchConfiguration(val) {
      const tmp = this.dataSetFields.slice()
      tmp.forEach(i => {
        if (i._id === val._id) {
          i.attributes.isHidden = false
        }
      })
      this.dataSetFields = tmp.slice()
      this.batchConfigTableData = this.getBatchConfigTableData(tmp.slice()).slice()
    },
    // 删除
    deleteBatchConfiguration(val) {
      const tmp = this.dataSetFields.slice()
      tmp.forEach(i => {
        if (i._id === val._id) {
          i.status = -1
        }
      })
      this.dataSetFields = tmp.slice()
      this.batchConfigTableData = this.getBatchConfigTableData(tmp.slice()).slice()
    },
    // 复制
    copyBatchConfiguration(val) {
      const tmp = this.dataSetFields.slice()
      let copy = {}
      // let idx = 0
      tmp.forEach((item, i) => {
        if (item._id === val._id) {
          // idx = i
          copy = JSON.parse(JSON.stringify(item))
        }
      })
      if (!copy) return false
      const id = copy._id
      copy._id = id + 'rd' + Math.ceil(Math.random() * 100)
      tmp.push(copy)
      this.dataSetFields = tmp.slice()
      this.batchConfigTableData = this.getBatchConfigTableData(tmp.slice()).slice()
    }
  }
}
</script>

<style lang="scss" scoped>
.result-preview-wrap-main {
  &-c {
    position: relative;
    &-top {
      display: flex;
      height: 40px;
      width: 368px;
      position: absolute;
      right: 10px;
      top: -10px;
      z-index: 99;
    }
  }

  .data-preview {
    display: flex;
    min-height: 300px;
    &-left {
      width: 200px;
      box-sizing: border-box;
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      border-left: 1px solid rgba(0, 0, 0, 0.06)
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
</style>
