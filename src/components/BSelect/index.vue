<template>
  <el-dropdown
    trigger="click"
    placement="bottom-start"
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
        v-for="data in options"
        :key="data.value"
        :command="data"
      >
        <span v-if="data.icon || typeTransform(data.value)">
          <svg-icon
            style="width: 22px;height: 12px;margin-right: 6px;"
            :icon-class="data.icon || typeTransform(data.value)"
          />
        </span>
        <span :class="{'field-active' : data.label === selected.label}">{{ data.label }}</span>
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
      default: () => [{
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
      }]
    },
    value: {
      type: String,
      default: ''
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
  mounted () {
    const temp = this.options.find(item => item.value === this.value)
    if (temp) {
      this.handleCommand(temp)
    }
  },
  methods: {
    typeTransform (type) {
      return transformDataTypeIcon(type)
    },
    handleCommand (data) {
      this.selected = {
        label: data.label,
        icon: this.typeTransform(data.value)
      }
      this.$emit('input', data.value)
      this.$emit('change', data.value)
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
