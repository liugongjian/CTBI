<template>
  <div class="chart-list-panel">
    <div
      v-for="(item,name, index) in toolList"
      :key="name + index"
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @click.stop="addItem(name,item)"
      @drag.stop="drag($event, name,item)"
      @dragend="dragend($event, name,item)"
    >
      <svg-icon
        :icon-class="name"
        style="font-size: 30px;"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartListPanel',
  components: {},
  props: {
    toolList: {
      required: true,
      type: Object
    }
  },
  data () {
    return {}
  },
  mounted () {
    console.log(this.toolList)
  },
  methods: {
    addItem(name, item) {
      this.$emit('addItem', name, item)
    },
    drag($event, name, item) {
      this.$emit('drag', $event, name, item)
    },
    dragend($event, name, item) {
      this.$emit('dragend', $event, name, item)
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-list-panel{
    position: absolute;
    top: 48px;
    left: 0;
    z-index: 999;
    border-right: 1px solid hsla(0,0%,85%,.15);
    background-color: #393f4d;
    padding: 12px 0;
    display: flex;
    flex-wrap: wrap;
}
</style>
