<template>
  <div class="container">
    <span
      v-for="(item, index) in iconOptions"
      :key="index"
      style="cursor: pointer"
    >
      <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
        <div class="box" :class="{forbidden: disabled}">
          <svg-icon
            class="shape-icon"
            :class="{pitch: item.value === type}"
            :icon-class="item.icon"
            style="font-size: 30px;"
            @click="changeHandler(item.icon)"
          />
          <span>{{ item.name }}</span>
        </div>

      </el-tooltip>
    </span>
  </div>
</template>

<script>
export default {
  name: 'SwitchIcon',
  props: {
    type: {
      type: String,
      default: ''
    },
    iconOptions: {
      type: Array,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    changeHandler(val) {
      if (!this.disabled) {
        this.$emit('update:type', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
}
.box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 5px;
    .shape-icon {
      padding: 6px;
    }
    .shape-icon {
      border: 1px solid #FFF;
    }
    .shape-icon:hover {
      border-color: #616571;
    }
    .pitch {
      border-color:  #2e74ff !important;
    }
  }
  .forbidden {
    color: #ececed;
  }
</style>
