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
        <div class="data-preview-left">
          <el-tree
            style="width: 200px;"
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
      <!-- <div
        v-show="activeTagName === 2"
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
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeTagName: 1,
      defaultProps: {
        children: 'children',
        label: 'displayColumn'
      },
      dimensionMeasureTableData: []
    }
  },
  computed: {
    dimensionMeasure: {
      get () {
        return this.getDimensionMeasureData(this.fields)
      },
      set (newVal) {
        this.dimensionMeasure = newVal
      }
    }
  },
  methods: {
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

        .custom-tree-node {
          &:hover > .gear-btn {
            display: block;
          }
          .gear-btn {
            display: none;
          }
        }
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
