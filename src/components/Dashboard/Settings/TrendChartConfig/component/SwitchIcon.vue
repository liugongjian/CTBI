<template>
  <div class="container">
    <span
      v-for="(item, index) in iconOptions"
      :key="index"
      style="cursor: pointer"
    >
      <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
        <div class="box icon-box" :class="{forbidden: disabled,active: item.type === type}">
          <svg-icon
            class="shape-icon"
            :class="{pitch: item.type === type}"
            :icon-class="item.icon"
            style="font-size: 30px;"
            @click="changeHandler(item.type)"
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
      default: true
    }
  },
  methods: {
    changeHandler(val) {
      if (!this.disabled) {
        this.$emit('update:type', val)
        this.$emit('checekType', val)
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
      padding: 4px 6px;
      border: 1px solid #FFF;
    }
  }
  .icon-box{
    .shape-icon:hover {
      border-color: #FFF;
    }
  }
  .active{
    .shape-icon{
      border-color:  #2e74ff !important; }

  }
  .forbidden {
    color: #ececed; opacity: 0.5; cursor:not-allowed;
  }
</style>
