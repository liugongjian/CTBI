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
              @click="hanldClickOption(item.id)"
            ><span class="cube-list-caption">{{ item.name }}</span>
              <i
                v-if="item.name===value"
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
            <span class="viw-btn">预览数据</span>
            <el-divider direction="vertical" />
            <span class="el-icon-refresh-right" />
          </div>
        </div>
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
              @click="filterValue=''"
            />
          </el-input>
        </div>
        <div class="tree-box-option">
          <el-tree
            ref="tree"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :load="loadNode"
            lazy
            @node-click="clickTreeNode"
          />

        </div>
        <!-- 数据集树模块END -->
      </div>

      <!-- 功能菜单模块 -->
      <div class="select-option-menu">
        <button class="add-cube">新建数据集</button>
        <el-upload
          class="upload-demo"
          action="#"
        >
          <button class="upload-file">上传本地文件</button>
        </el-upload>
      </div>
      <!-- 功能菜单模块END -->

    </div>
    <!-- 下拉菜单END -->
  </div>
</template>

<script>
import { getDataSetsFolders } from '@/api/dataSet'
export default {
  name: 'DataSetSelect',
  data () {
    return {
      value: '',
      showOption: false, // 是否展示选项
      showOptionList: false, // 是否展示已使用选项
      selectOption: [], // 已使用的选项
      filterText: '', // 树形过滤
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
        id: 'id'
      }
    }
  },
  computed: {
    selectValueName () {
      const option = this.selectOption.find(item => {
        if (item.id === this.value) {
          return item
        }
      })
      return option?.name || '请选择数据集'
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    value: {
      handler (val) {
        if (val) {
          this.$emit('reflashValue', val)
        }
      },
      immediate: true
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
  },
  methods: {
    // 加载树形数据
    loadNode (node, resolve) {
      const that = this
      if (node.level === 0) {
        that.loadTreeData(resolve)
      }
      if (node.level >= 1) {
        that.loadChildData(node.data.id, resolve)
      }
    },
    // 获取树形父节点数据
    async loadTreeData (resolve) {
      try {
        const data = await getDataSetsFolders()
        data.forEach(item => {
          item.id = item._id
          item.leaf = !item.isFolder
          item.name = item.displayName || item.name
        })
        resolve(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取树形子节点数据
    async loadChildData (folderId, resolve) {
      try {
        const data = await getDataSetsFolders({ folderId })
        data.forEach(item => {
          item.id = item._id
          item.leaf = !item.isFolder
          item.name = item.displayName
        })
        resolve(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 点击已使用选项
    hanldClickOption (id) {
      this.value = id
      this.showOption = false
    },
    // 点击树节点
    clickTreeNode (node) {
      if (!node.isFolder) {
        const data = this.selectOption.find(item => {
          if (item.id === node.id) {
            return item
          }
        })
        if (!data) {
          this.selectOption.push(node)
        }
        this.value = node.id
        this.showOption = false
      } else {
        return
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
$base-bgc: #2e74ff;
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
        color: #2e74ff;
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
      color: #246dff;
      margin-right: 5px;
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
    background-color: #2e74ff;
    margin-right: 8px;
    flex: 1;
  }
  .upload-demo {
    flex: 1;
  }
  .upload-file {
    width: 100%;
    background-color: transparent;
    border: 1px solid hsla(0, 0%, 100%, 0.2);
  }
}
::v-deep .el-upload--text {
  width: 100%;
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
