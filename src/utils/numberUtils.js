function reverseStr (str) {
  return str.split('').reverse().join('')
}
function replace3Int (str) {
  return str.replace(/(\d{3})(?=\d)/g, '$1,')
}
function addWan (integer, number, mutiple, decimalDigit, flag) {
  var digit = getDigit(integer)
  if (digit > 3) {
    var remainder = digit % 8
    if (remainder >= 5) {
      // ‘十万’、‘百万’、‘千万’显示为‘万’
      remainder = 4
    }
    return (
      Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) /
        Math.pow(10, decimalDigit) +
        (flag ? '万' : '萬')
    )
  } else {
    return (
      Math.round(number / Math.pow(10, mutiple - decimalDigit)) /
      Math.pow(10, decimalDigit)
    )
  }
}
function getDigit (integer) {
  var digit = -1
  while (integer >= 1) {
    digit++
    integer = integer / 10
  }
  return digit
}

/**
 * 将字符串中的数字转为千分位
 * @param {*} intStr
 * @returns
 */
export function strWithKSeperator (intStr) {
  return reverseStr(replace3Int(reverseStr(intStr)))
}

/**
 * 为数字加上单位：万或亿
 *
 * 例如：
 * 1000.01 => 1000.01
 * 10000 => 1万
 * 99000 => 9.9万
 * 566000 => 56.6万
 * 5660000 => 566万
 * 44440000 => 4444万
 * 11111000 => 1111.1万
 * 444400000 => 4.44亿
 * 40000000,00000000,00000000 => 4000万亿亿
 * 4,00000000,00000000,00000000 => 4亿亿亿
 *
 * @param {number} number 输入数字.
 * @param {boolean} flag true为简体，false为繁体
 * @param {number} decimalDigit 小数点后最多位数，默认为2
 * @return {string} 加上单位后的数字
 */
export function addChineseUnit (number, flag, decimalDigit) {
  decimalDigit = decimalDigit == null ? 2 : decimalDigit
  var integer = Math.floor(number)
  var digit = getDigit(integer)
  // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
  var unit = []
  if (digit > 3) {
    var multiple = Math.floor(digit / 8)
    if (multiple >= 1) {
      var tmp = Math.round(integer / Math.pow(10, 8 * multiple))
      unit.push(addWan(tmp, number, 8 * multiple, decimalDigit, flag))
      for (var i = 0; i < multiple; i++) {
        unit.push(flag ? '亿' : '億')
      }
      return unit.join('')
    } else {
      return addWan(integer, number, 0, decimalDigit, flag)
    }
  } else {
    return number
  }
}

/**
 * 将数字转为带有英文单位后缀的格式
 * @param {*} num
 * @param {*} digits
 * @returns
 */
export function addEnglishUnit (num, digits) {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time *= 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * 将数字转为多少精度的值
 * @param {*} num
 * @param {*} digits
 * @param {*} base ，大于该值才转换
 * @returns
 */
export function numToFixed (num, digits, base) {
  if (base) {
    return num > base ? num.toFixed(digits) : num
  }
  return num.toFixed(digits)
}

