<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @closed="destroyEditor"
  >

    <!-- 富文本的初始值 -->
    <div ref="editor" v-html="text" />

    <span
      slot="footer"
    >
      <el-button @click="closeSilence()">取 消</el-button>
      <el-button
        type="primary"
        @click="close(editorData)"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import E from 'wangeditor'
import dialogMixin from '@/mixins/dialogMixin'
export default {
  name: 'RTDialog',
  mixins: [dialogMixin],
  data () {
    return {
      editor: null,
      editorData: this.text
    }
  },
  mounted () {
    // 富文本初始化不放入nextTick中会报错，渲染不出来
    this.$nextTick(() => {
      // 初始化富文本
      this.init()
      this.editorData = this.text
    })
  },
  methods: {
    init () {
      this.editor = new E(this.$refs.editor)
      this.editor.config.height = 200 // 设置富文本编辑器的高度。
      this.editor.config.zIndex = 100 // 设置富文本编辑器的页面高度。
      this.editor.config.onchange = (html) => {
        this.editorData = html
      }
      this.editor.config.menus = [ // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'table', // 表格
        'undo', // 撤销
        'redo' // 重复
      ]
      this.editor.create() // 创建富文本实例
    },
    destroyEditor () {
      // 销毁编辑器
      this.editor.destroy()
      this.editor = null
    }
  }

}
</script>
