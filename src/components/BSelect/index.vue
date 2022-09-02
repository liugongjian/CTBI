<template>
  <el-dropdown
    trigger="click"
    placement="bottom-start"
    :disabled="disabled"
    @command="handleCommand"
  >

    <div class="field-type">
      <div>
        <svg-icon
          v-if="selected.icon"
          style="width: 20px;"
          :icon-class="selected.icon"
        />
        {{ selected.label }}
      </div>
      <i
        class="el-icon-arrow-down el-icon--right"
        style="position: relative;top: 9px;"
      />
    </div>

    <el-dropdown-menu
      slot="dropdown"
      style="width: 200px;"
    >
      <el-dropdown-item
        v-for="(data, index) in options"
        :key="'b-select-' + index + getDate()"
        :command="data"
      >
        <template v-if="hasChildren(data)">
          <el-dropdown
            placement="right"
            style="width: 100%;"
            @command="handleCommand"
          >
            <div style="width: 100%;display: flex;">
              <div style="width: 28px;">
                <svg-icon
                  style="width: 22px;height: 12px;margin-right: 6px;"
                  :icon-class="data.icon || typeTransform(data.value)"
                />
              </div>
              <div
                :class="{'field-active' : data.label === selected.label}"
                style="flex:1;"
              >
                {{ data.label }}
              </div>
              <div style="width: 22px;">
                <i class="el-icon-arrow-right el-icon--right" />
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="child in data.children"
                :key="child.label + getDate()"
                :command="child"
              >
                {{ child.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <span>
            <svg-icon
              style="width: 22px;height: 12px;margin-right: 6px;"
              :icon-class="data.icon || typeTransform(data.value)"
            />
          </span>
          <span :class="{'field-active' : data.label === selected.label}">{{ data.label }}</span>
        </template>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { transformDataTypeIcon } from '@/utils/optionUtils'

export default {
  name: 'BSelect',
  // 定义实现v-modal的属性与事件
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selected: {
        label: '',
        icon: ''
      }
    }
  },
  watch: {
    options: {
      handler () {
        const temp = this.recursiveOption(this.options)
        if (temp) {
          this.handleCommand(temp)
        }
      },
      deep: true
    }
  },
  mounted () {
    const temp = this.recursiveOption(this.options)
    if (temp) {
      this.handleCommand(temp)
    }
  },
  methods: {
    getDate () {
      return new Date().getTime()
    },
    typeTransform (type) {
      return transformDataTypeIcon(type)
    },
    recursiveOption (data) {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const temp = data[i]
          if (temp.value === this.value) {
            return temp
          } else if (temp.children) {
            const childTemp = this.recursiveOption(temp.children)
            if (childTemp) {
              return childTemp
            }
          }
        }
      }
      return null
    },
    hasChildren (data) {
      return data && data.children && data.children.length > 0
    },
    handleCommand (data) {
      if (!this.hasChildren(data)) {
        // 展示选中数据
        this.selected = {
          label: data.label,
          icon: this.typeTransform(data.value)
        }
        this.$emit('input', data.value)
        this.$emit('change', data.value, data)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.field-type {
  width: 138px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #dddddd;
  line-height: 32px;
  display: flex;
  justify-content: space-between;
  padding: 0px 12px;
}

.field-active {
  color: #fb9c5d;
}

::v-deep .popper__arrow {
  display: none !important;
}
.el-popper {
  margin-top: 0px !important;
  box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, 0.5);
  border-radius: 2px;
}
</style>
