<template>
  <div v-if="visible" class="editor-object-container">
    <el-checkbox v-model="option.show">指标展示分组</el-checkbox>
    <div class="pag-select">
      <el-dropdown :disabled="!option.show">
        <el-button size="small">
          指标分组<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-alert
              title="开启指标分组时，指标排序以指标分组中的顺序为准"
              type="warning"
              show-icon
            />
            <el-button size="small" @click.stop="addGroup">
              +新增分组
            </el-button>
            <el-tree
              :data="groups"
              node-key="id"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="showNodeOp(node)" @mouseleave="hideNodeOp(node)">
                <span v-if="!node.isEditing">{{ node.label }}</span>
                <input v-if="node.isEditing" :ref="`node-input-${node.id}`" v-model="data.label" @change.stop="editEnd(node)" @blur="editEnd(node)">
                <span v-show="node.showOp">
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => edit(node, data)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
            <el-row>
              <el-button size="small" @click.stop="">
                确定
              </el-button>
              <el-button size="small" @click.stop="">
                取消
              </el-button>
            </el-row>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Edition from '@/components/Dashboard/mixins/EditionMixins'
const testData = [{
  id: 1,
  label: '一级 1',
  children: [{
    id: 4,
    label: '二级 1-1',
    children: [{
      id: 9,
      label: '三级 1-1-1'
    }, {
      id: 10,
      label: '三级 1-1-2'
    }]
  }]
}, {
  id: 2,
  label: '一级 2',
  children: [{
    id: 5,
    label: '二级 2-1'
  }, {
    id: 6,
    label: '二级 2-2'
  }]
}, {
  id: 3,
  label: '一级 3',
  children: [{
    id: 7,
    label: '二级 3-1'
  }, {
    id: 8,
    label: '二级 3-2',
    children: [{
      id: 11,
      label: '三级 3-2-1'
    }, {
      id: 12,
      label: '三级 3-2-2'
    }, {
      id: 13,
      label: '三级 3-2-3'
    }]
  }]
}]

export default {
  name: 'IndicatorGroup',
  mixins: [Edition],
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      groups: testData
    }
  },
  methods: {
    edit(node, data) {
      this.$set(node, 'isEditing', true)
      this.$set(data, 'label', data.label)
      this.$nextTick(() => {
        this.$refs[`node-input-${node.id}`].focus()
      })
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },

    showNodeOp(node) {
      this.$set(node, 'showOp', true)
    },
    hideNodeOp(node) {
      this.$set(node, 'showOp', false)
    },
    editEnd(node) {
      this.$set(node, 'isEditing', false)
    },
    addGroup() {
      this.groups.push({
        id: this.getId(),
        label: '未命名分组'
      })
    },
    getId() { // 获取随机数id
      const date = Date.now()
      const rund = Math.ceil(Math.random() * 1000)
      const id = date + '' + rund
      return id
    }
  }
}
</script>
<style lang="scss" scoped>
    .pag-select{
        display: inline-flex;
        align-items: center;
        width: 60%;
        padding: 0 5px;
        .el-select{
            width: 75%;
            margin-right: 2px;
        }
    }
</style>
