<template>
  <el-dropdown placement="bottom" @command="handleCommand">
    <svg-icon
      :icon-class="main"
      style="font-size: 17px;"
    />
    <svg-icon
      :icon-class="'tools-arrow'"
      style="font-size: 8px;"
    />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="{svg,command} in dropDowns"
        :key="svg"
        :command="command"
      >
        <svg-icon
          :icon-class="svg"
          style="font-size: 17px;"
        />
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'IconDropdown',
  components: {},
  props: {
    dropDowns: {
      required: true,
      type: Array
    },
    main: {
      required: true,
      type: String
    }
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    handleCommand(command) {
      this.$emit('resolve', command)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
</style>
