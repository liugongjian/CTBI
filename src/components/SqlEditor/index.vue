<template>
  <div>
    <textarea
      ref="mycode"
      v-model="value"
      class="codesql"
    />
  </div>
</template>
<script>
import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
const CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')
export default {
  name: 'SqlEditor',
  props: {
    // 接收父组件传值
    value: {
      type: String,
      default: ''
    },
    sqlStyle: {
      type: String,
      default: 'default'
    },
    // 父组件将表结构传给编辑器，实现自动提示表名和字段名的功能
    tables: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      editor: null
    }
  },
  computed: {
    // 将编辑器中的值赋给newVal变量
    // eslint-disable-next-line vue/return-in-computed-property
    newVal () {
      if (this.editor) {
        return this.editor.getValue()
      }
    }
  },
  watch: {
    // 监听newVal值的变化，通过getValue方法获取到值并传递给父组件
    newVal (newV, oldV) {
      if (this.editor) {
        this.$emit('changeTextarea', this.editor.getValue())
      }
    }
  },

  mounted () {
    const mime = 'text/x-mariadb'
    // let theme = 'ambiance' //设置主题，不设置的会使用默认主题
    this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      value: this.value, // 初始内容
      mode: mime, // 选择对应代码编辑器的语言，这里选择数据库
      indentWithTabs: true, // 是否tabs缩进
      smartIndent: true, // 自动缩进是否开启
      lineNumbers: true, // 是否显示行号
      matchBrackets: true, // 匹配结束符号
      cursorHeight: 1, // 光标高度
      lineWrapping: true, // 是否换行
      readOnly: false, // 是否只读
      // theme: ambiance, // 设置主题
      // autofocus: true, // 自动聚焦
      extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
      hintOptions: { // 自定义提示选项
        completeSingle: false // 当匹配只有一项的时候是否自动补全
        // tables: {
        //     users: ['name', 'score', 'birthDate'],
        //     countries: ['name', 'population', 'size']
        // }
      }
    })
    // 触发器使用方法：editor.on('chang', ()=>{})
    // 代码自动提示功能，使用cursorActivity事件不要使用change事件，不然页面直接会卡死
    this.editor.on('inputRead', () => {
      this.editor.showHint()
    })
  },
  methods: {
    // 设置编辑器内容
    setVal () {
      if (this.editor) {
        if (this.value === '') {
          this.editor.setValue('')
        } else {
          this.editor.setValue(this.value)
        }
      }
    }
  }
}
</script>
<style scoped>
.CodeMirror {
  color: black;
  /* direction: ltr; */
  line-height: 22px;
}
.CodeMirror-hints {
  z-index: 999 !important;
}
</style>
