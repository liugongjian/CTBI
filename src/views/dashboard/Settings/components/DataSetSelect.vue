<template>
  <div
    ref="showPanel"
    class="select"
    :class="{'open':showOption}"
  >
    <!-- 下拉按钮 -->
    <div
      class="select-get-option"
      @click.stop="showOption=!showOption"
    >
      <span
        class="select-value"
        :title="selectValueName"
      >{{ selectValueName }}</span>
    </div>
    <!-- 下拉按钮END -->

    <!-- 下拉菜单 -->
    <div class="select-option-list">
      <div class="select-option-wrapper">
        <!-- 已使用选项 -->
        <div class="cube-box">
          <div
            class="cube-box-title"
            @click="showOptionList=!showOptionList"
          >
            <div><i class="el-icon-success swrapper-icon" />已使用·{{ selectOption.length }}</div>
            <div><span :class="showOptionList?'el-icon-arrow-up':'el-icon-arrow-down'" /></div>
          </div>
          <ul
            v-show="showOptionList"
            class="cube-box-list"
          >
            <li
              v-for="(item,index) in selectOption"
              :key="index"
              @click="hanldClickOption(item.id,item.name)"
            ><span class="cube-list-caption">{{ item.name }}</span>
              <i
                v-if="item.id===dataSet.id"
                class="el-icon-check"
              />
            </li>
          </ul>
        </div>
        <!-- 已使用选项END -->

        <!-- 数据集树模块 -->
        <div class="tree-box-title">
          <div><i class="el-icon-box swrapper-icon" />全部</div>
          <div class="tree-box-title-r">
            <span
              class="viw-btn"
              @click="showPreview"
            >预览数据</span>
            <el-divider direction="vertical" />
            <span
              class="el-icon-refresh-right"
              @click="getTreeData"
            />
          </div>
        </div>
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
        <div
          v-loading="dataLoading"
          class="tree-box-option"
        >
          <el-tree
            ref="tree"
            node-key="_id"
            :data="treeData"
            highlight-current
            :props="defaultProps"
            :filter-node-method="filterNode"
            :default-expanded-keys="defaultExpand"
            :expand-on-click-node="false"
            @node-click="clickTreeNode"
          >
            <div slot-scope="{ node, data }">
              <div class="d-f">
                <div>
                  <svg-icon
                    v-if="data.isFolder"
                    style="color: #fff;margin-right: 4px;"
                    icon-class="white-folder"
                  />
                </div>
                <b-tooltip
                  :content="data.name"
                  width="100px"
                />
              </div>
            </div>
          </el-tree>

        </div>
        <!-- 数据集树模块END -->
      </div>

      <!-- 功能菜单模块 -->
      <div class="select-option-menu">
        <button
          class="add-cube"
          @click="addDataSet"
        >新建数据集</button>
      </div>
      <!-- 功能菜单模块END -->

    </div>
    <!-- 下拉菜单END -->
  </div>
</template>

<script>
import { getFullList } from '@/api/dataSet'
import store from '@/store'
export default {
  name: 'DataSetSelect',
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
      treeData: [], // 树形数据
      showOption: false, // 是否展示选项
      showOptionList: true, // 是否展示已使用选项
      filterText: '', // 树形过滤
      defaultExpand: [], // 树形默认展开节点
      dataLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        id: '_id'
      },
      layout: [] // layout数据
    }
  },
  computed: {
    // 选中数据集的名称
    selectValueName () {
      const option = this.selectOption.find(item => {
        return item.id === this.dataSet.id
      })
      return option?.name || '请选择数据集'
    },
    // 已使用选项
    selectOption () {
      const option = []
      this.layout.forEach(item => {
        if (item.option.dataSet.id) {
          const data = option.find(ele => {
            return ele.id === item.option.dataSet.id
          })
          if (!data) {
            option.push(item.option.dataSet)
          }
        }
      })
      return option
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    dataSet: {
      handler (val) {
        this.$emit('refreshValue', val.id)
        this.defaultExpand = []
        this.defaultExpand.push(val.id)
        if (this.$refs.tree) {
          const id = val.id.length > 0 ? val.id : []
          this.$refs.tree.setCurrentKey(id)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    // 监听点击事件，点击其他地方隐藏
    document.addEventListener('click', (e) => {
      if (this.$refs.showPanel) {
        const isSelf = this.$refs.showPanel.contains(e.target)
        if (!isSelf) {
          this.showOption = false
        }
      }
    })
    this.getTreeData()
    this.layout = store.state.app.layout
  },
  methods: {
    // 获取数据集树形数据
    async getTreeData () {
      try {
        this.dataLoading = true
        const res = await getFullList()
        this.treeData = res
        this.dataLoading = false
      } catch (error) {
        console.log(error)
      }
    },

    // 点击已使用选项
    hanldClickOption (id, name) {
      this.dataSet.id = id
      this.dataSet.name = name
      this.showOption = false
      // 清空dataSource的数据
      const option = this.option
      for (const i in option) {
        option[i]['value'] = []
      }
    },
    // 点击树节点
    clickTreeNode (node) {
      // 判断是否点击的不是文件夹
      if (!node.isFolder) {
        this.dataSet.id = node._id
        this.dataSet.name = node.name
        this.showOption = false
        // 清空dataSource的数据
        const option = this.option
        for (const i in option) {
          option[i]['value'] = []
        }
      } else {
        return
      }
    },
    // 过滤数据
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 跳转到新建数据集页面
    addDataSet () {
      this.$router.push({
        path: '/dataManage/dataSet/edit'
      })
    },
    // 预览数据
    showPreview () {
      this.showOption = false
      this.$dialog.show('DataSetPreviewDialog', {
        treeData: this.treeData,
        selectOption: this.selectOption,
        defaultProps: this.defaultProps,
        dataSet: this.dataSet
      }, this.callback)
    },

    // 预览数据弹窗返回值
    callback (val) {
      this.dataSet.id = val.id
      this.dataSet.name = val.name
    }
  }
}
</script>

<style lang="scss" scoped>
$base-bgc: #fa8334;
* {
  box-sizing: border-box;
}
.select {
  flex: 1;
  position: relative;
  height: 24px;
  &-get-option {
    width: 100%;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    padding-left: 10px;
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
    color: #fff;
    transition: width 0.2s linear;
    background-color: $base-bgc;
  }
  &-get-option::after {
    display: inline-block;
    content: '';
    width: 16px;
    height: 16px;
    background-size: 16px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M757.76 637.44L538.88 883.2c-14.72 16.64-40.32 16.64-54.4 0L265.6 637.44c-21.12-23.68-4.48-61.44 27.52-61.44h437.76c31.36 0 48.64 37.76 26.88 61.44z' fill='%23c0c3cb'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    position: relative;
    transition: all 0.2s ease;
    background-position-y: -3px;
    left: -2px;
    top: 4px;
  }
}
.select-option-list {
  overflow-y: hidden;
  min-height: 60px;
  max-height: 480px;
  width: 100%;
  border-top: none;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  display: none;
  background-color: #081226;
  background-clip: padding-box;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
.select.open {
  .select-get-option {
    width: 320px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .select-get-option::after {
    transform: rotate(180deg);
  }
  .select-option-list {
    display: block;
    width: 320px;
  }
}

.select-value {
  display: block;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.select-option-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 440px;
  overflow-y: hidden;
  height: 100%;
  margin-bottom: 44px;
}

.cube-box {
  color: #fff;
  border-bottom: 1px solid hsla(0, 0%, 85%, 0.15);
  &-title {
    padding-left: 10px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  &-list {
    background-color: #132240;
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
      text-decoration: none;
      background: #293451;
    }
  }
}
.swrapper-icon {
  color: hsla(0, 0%, 100%, 0.5);
  margin-right: 4px;
}
.tree-box-title {
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  &-r {
    display: flex;
    align-items: center;
    color: hsla(0, 0%, 100%, 0.65);
    .viw-btn {
      color: $base-bgc;
      margin-right: 5px;
    }
  }
}
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
.tree-box-option {
  padding: 0 10px;
  overflow-x: hidden;
}
.select-option-menu {
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  .add-cube {
    background-color: $base-bgc;
    margin-right: 8px;
    flex: 1;
  }
}
::v-deep .el-upload--text {
  width: 100%;
}
::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background-color: $base-bgc;
}
::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: $base-bgc;
}
button {
  font-size: 12px;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  height: 24px;
  border-radius: 2px;
}
</style>
