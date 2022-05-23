<template>
  <div>
    <div
      v-if="activeTagName === 1"
      class="d-f f-b-c"
    >
      <div class="gear-btn">
        <el-dropdown trigger="click">
          <el-button type="text">
            <svg-icon icon-class="gear" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-edit-outline"
              @click.native="editDimensionMeasure(data)"
            >编辑</el-dropdown-item>
            <el-dropdown-item @click.native="copyDimensionMeasure(data)">
              <svg-icon
                icon-class="file-copy"
                style="margin-right: 5px;"
              />复制
            </el-dropdown-item>
            <el-dropdown-item
              v-if="data.attributes"
              @click.native="hideDimensionMeasure(data)"
            >
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
                />取消隐藏
              </span>
            </el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-refresh"
              @click.native="transformType(data)"
            >{{ getTransformText(data.type) }}</el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-delete"
              @click.native="deleteDimensionMeasure(data)"
            >删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-else>
      <el-button
        type="text"
        @click="copyDimensionMeasure(data)"
      >复制</el-button>
      <el-divider direction="vertical" />
      <el-button
        type="text"
        @click="deleteDimensionMeasure(data)"
      >删除</el-button>
      <el-divider direction="vertical" />
      <el-button
        v-if="data.attributes"
        type="text"
        @click="hideDimensionMeasure(data)"
      >
        {{ data.attributes[0].isHidden ? '取消隐藏' : '隐藏' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/optionUtils'
import * as constants from '@/constants/constants'
export default {
  name: 'GearBtn',
  props: {
    activeTagName: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      default: () => { }
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 编辑数据预览中的字段
    editDimensionMeasure (item) {
      this.$dialog.show('EditDimensionMeasureDialog', { form: item, fields: this.fields }, (data) => {
        if (!data.displayColumn) {
          data.displayColumn = data.column
        } else {
          Object.assign(item, data)
          this.$emit('reset')
        }
      })
    },
    // 复制数据预览中的字段
    copyDimensionMeasure (item) {
      this.fieldsIndex += 1
      const copyName = this.copyName(item.displayColumn + '_副本', this.fields, 0)
      const copyItem = Object.assign(deepClone(item), { _id: '', displayColumn: copyName, index: this.fieldsIndex })
      delete copyItem.$treeNodeId
      const index = this.fields.findIndex(field => { return item.index === field.index })
      this.fields.splice(index + 1, 0, copyItem)
      this.$emit('reset')
    },
    // 递归名称复制
    copyName (name, arr, i = 0, reName = '') {
      reName = reName || name + '_${copyIndex}'
      const temp = arr.find(item => item.displayColumn === name)
      if (temp) {
        i++
        name = reName.replace('${copyIndex}', i)
        return this.copyName(name, arr, i, reName)
      } else {
        return i === 0 ? name : reName.replace('${copyIndex}', i)
      }
    },
    // 删除数据预览中的字段
    deleteDimensionMeasure (item) {
      this.$dialog.show('TipDialog', {}, () => {
        const index = this.fields.findIndex(field => { return item.index === field.index })
        this.fields.splice(index, 1)
        this.$emit('reset')
      })
    },
    // 隐藏
    hideDimensionMeasure (item) {
      if (item.attributes) {
        item.attributes[0].isHidden = !item.attributes[0].isHidden
        this.$emit('reset')
      }
    },
    // 切换维度或者度量
    transformType (data) {
      if (data.type === 'Measure') {
        data.type = 'Dimension'
      } else {
        data.type = 'Measure'
      }
      // 将字段放到最后
      const index = this.fields.findIndex(field => { return data.index === field.index })
      this.fields.splice(index, 1)
      this.fields.push(data)

      this.$emit('reset')
    },
    // 获取切换文本
    getTransformText (type) {
      if (type === 'Measure') {
        return '转换为' + constants.DatasetType.Dimension
      } else {
        return '转换为' + constants.DatasetType.Measure
      }
    }
  }
}
</script>
