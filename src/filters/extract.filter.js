/**
 * 数据集 - 参数类型过滤器
 * @param {String} bytes
 * @returns {String}
 */
export const extractTypeFilter = (type) => {
  switch (type) {
    case 'placeholder':
      return '占位符'
    case 'param':
      return '参数'
    default:
      return type
  }
}
