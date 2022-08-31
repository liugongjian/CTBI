/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isNull (value) {
  return (value === null) || (value === undefined)
}

export function isNotNull (value) {
  return (value !== null) && (value !== undefined)
}

export function isEmptyStr (str) {
  // return (str === undefined) || (!str) || (!/[^\s]/.test(str));
  return (str === undefined) || (!str && (str !== 0) && (str !== '0')) || (!/[^\s]/.test(str))
}

/**
 * 密码规则
 * @param {String} str
 * @returns {Boolean}
 */
export function validPassword (str) { // @$!%*#_~?&^
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!^&@#$%*_?])[A-Za-z\d~!^&@#$%*_?]{12,26}$/
  return reg.test(str)
}

/**
 * 校验密码是否字典连续 或者相等
 * @param {String} str
 * @returns {Boolean}
 */
export function validContinuousChar (str) {
  if (str?.length < 3) {
    return false
  }
  const charCodeArray = str.split('').map((char) => {
    let code = char.charCodeAt()
    // A-Z 转成小写
    if (code >= 65 && code <= 90) {
      code += 32
    }
    return code
  })
  for (let index = 1; index < charCodeArray.length - 1; index++) {
    const cur = charCodeArray[index]
    const pre = charCodeArray[index - 1]
    const next = charCodeArray[index + 1]
    // 判断重复字符
    if (cur === pre && cur === next) {
      return true
    }
    // 判断连续字符： 正序 + 倒序
    if ((cur - 1 === pre && cur + 1 === next) || (cur + 1 === pre && cur - 1 === next)) {
      return true
    }
  }
  return false
}

/**
 * 校验密码是否键盘连续
 * @param {String} str
 * @returns {Boolean}
 */
export function validKeyboardContinuousChar (str) {
  const { length } = str
  if (length < 3) {
    return false
  }
  // 定义两个矩阵存放键盘字符的ASCII码 防止大小写影响结果 全用小写字母
  const charCodeArrayNormal = [
    ['\0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\0'],
    ['\0', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['\0', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\0', '\0'],
    ['\0', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\0', '\0', '\0']
  ].map((item) => item.map((char) => char.charCodeAt()))

  const charCodeArrayShift = [
    ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '\0'],
    ['\0', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'],
    ['\0', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', '\0', '\0'],
    ['\0', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', '\0', '\0', '\0']
  ].map((item) => item.map((char) => char.charCodeAt()))
  // 坐标矩阵
  const posArray = []
  try {
    for (let index = 0; index < str.length; index++) {
      let cur = str.charCodeAt(index)
      // A-Z 转成小写
      if (cur >= 65 && cur <= 90) {
        cur += 32
      }
      // 查找字符的坐标 并存放到坐标矩阵
      const charArray = charCodeArrayNormal.some((item) => item.includes(cur)) ? charCodeArrayNormal : charCodeArrayShift
      const rowIndex = charArray?.findIndex((item) => item.includes(cur))
      const colIndex = charArray[rowIndex]?.findIndex((item) => item === cur)
      posArray[index] = [rowIndex, colIndex]
    }
    for (let index = 1; index < posArray.length - 1; index++) {
      const [curRowIndex, curColIndex] = posArray[index]
      const [preRowIndex, preColIndex] = posArray[index - 1]
      const [nextRowIndex, nextColIndex] = posArray[index + 1]
      // 行坐标相等代表在同一行 判断列坐标是否连续
      if (curRowIndex === preRowIndex && curRowIndex === nextRowIndex && ((curColIndex - 1 === preColIndex && curColIndex + 1 === nextColIndex) || (curColIndex + 1 === preColIndex && curColIndex - 1 === nextColIndex))) {
        return true
      }
      // 列坐标相等代表在同一行 判断行坐标是否连续
      if (curColIndex === preColIndex && curColIndex === nextColIndex && ((curRowIndex - 1 === preRowIndex && curRowIndex + 1 === nextRowIndex) || (curRowIndex + 1 === preRowIndex && curRowIndex - 1 === nextRowIndex))) {
        return true
      }
    }
  } catch (error) {
    console.log(error)
    return false
  }
  return false
}

/**
 * 手机号规则
 * @param {Number} num
 * @returns {Boolean}
 */
export function validPhone (num) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(num)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail (email) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}
