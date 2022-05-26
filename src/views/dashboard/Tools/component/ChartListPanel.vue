<template>
  <div class="chart-list-panel">
    <div v-for="cate in chartCategory" :key="cate.category" class="chart-list-panel__category">
      <div class="chart-list-panel__category__title">{{ cate.name }}</div>
      <div class="chart-list-panel__category__tools">
        <div
          v-for="(item, index) in filterTools(toolList, cate)"
          :key="item.name + index"
          class="droppable-element svg"
          draggable="true"
          unselectable="on"
          @click.stop="addItem(item.name,item)"
          @drag.stop="drag($event, item.name,item)"
          @dragend="dragend($event, item.name,item)"
        >
          <el-tooltip effect="dark" :content="item.theme.Basic.Title.text" placement="top">
            <svg-icon
              :icon-class="item.name"
              style="font-size: 22px;"
            />
          </el-tooltip>
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
      this.$emit('addItem', name, item, true)
    },
    drag($event, name, item) {
      this.$emit('drag', $event, name, item)
    },
    dragend($event, name, item) {
      this.$emit('dragend', $event, name, item)
    },
    filterTools(toolList, category) {
      const list = []
      const res = JSON.parse(JSON.stringify(toolList))
      Object.keys(res).forEach(item => {
        if (res[item].type !== category.category) {
          delete res[item]
        } else {
          res[item].name = item
          list.push(res[item])
        }
      })
      list?.sort((prev, next) => prev.order - next.order)
      return list
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
    width: calc(100vw - 436px);
    background-color: #424550;
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
            margin-bottom: 3px;
            margin-left: 7px;
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
                margin: 0 8px;
            }
            .svg {
                margin: 0 3px;
                cursor: pointer;
                padding: 5px;
                &:hover {
                  background: rgba(255,255,255,0.10);
                  border-radius: 2px;
                }
            }
        }
    }
}
</style>
