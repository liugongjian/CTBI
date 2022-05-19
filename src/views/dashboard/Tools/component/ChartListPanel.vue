<template>
  <div class="chart-list-panel">
    <div v-for="cate in chartCategory" :key="cate.category" class="chart-list-panel__category">
      <div class="chart-list-panel__category__title">{{ cate.name }}</div>
      <div class="chart-list-panel__category__tools">
        <div
          v-for="(item,name, index) in filterTools(toolList, cate)"
          :key="name + index"
          class="droppable-element svg"
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
    </div>
  </div>
</template>

<script>
import { chartCategory } from '../getToolList'
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
    return {
      chartCategory
    }
  },
  mounted () {
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
    },
    filterTools(toolList, category) {
      const res = JSON.parse(JSON.stringify(toolList))
      Object.keys(res).forEach(item => {
        if (res[item].type !== category.category) {
          delete res[item]
        }
      })
      return res
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
    padding: 12px 8px;
    display: flex;
    flex-wrap: wrap;
    &__category{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5px;
        &__title {
            align-self:start;
            color: white;
            margin: 10px 8px;
        }
        &__tools{
            display: flex;
            flex-direction: row;
            &::after{
                content: "";
                display: inline-block;
                height: 100%;
                width: 1px;
                background: grey;
                margin: 0 5px;
            }
            .svg {
                margin: 0 5px;
            }
        }
    }
}
</style>
