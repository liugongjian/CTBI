<template>
  <div class="column-wrapper">
    <div class="content">
      <div
        v-for="(item, index) in columns"
        :key="`columns_${index}`"
        class="column-row"
      >
        <svg-icon
          class="icon"
          :icon-class="typeTransform(item.columnType)"
        />
        <div class="column-name">
          <b-tooltip
            width="170"
            :content="item.columnName"
          />
        </div>
        <div class="column-des">
          <b-tooltip
            width="70"
            :content="item.comment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    typeTransform (type) {
      return 'copy'
    }
  }
}
</script>
<style lang="scss" scoped>
.column-wrapper {
  max-height: 300px;
  overflow: hidden;

  .content {
    max-height: 250px;
    overflow: auto;
    padding: 0px 20px;

    .column-row {
      display: flex;
      word-break: keep-all;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 20px;
      margin-bottom: 16px;

      .icon {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }

      .column-name {
      }

      .column-des {
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
