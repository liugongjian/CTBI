import CryptoJs from 'crypto-js'

const options = {
  iv: CryptoJs.enc.Utf8.parse('abcdef0abcdef0123456789123456789'),
  mode: CryptoJs.mode.CBC,
  padding: CryptoJs.pad.Pkcs7
}

const specialKey = '@node-king!'
// AES加密
export const encryptAes = (message, key) => {
  return CryptoJs.AES.encrypt(message, specialKey, options).toString()
}
// AES解密
export const decryptAes = (message) => {
  return CryptoJs.AES.decrypt(message, specialKey, options).toString(CryptoJs.enc.Utf8)
}

const key = CryptoJs.enc.Utf8.parse('1234123412ABCDEF') // 十六位十六进制数作为密钥
const iv = CryptoJs.enc.Utf8.parse('ABCDEF1234123412') // 十六位十六进制数作为密钥偏移量

// 解密方法
export function decryptAesForShare(word) {
  const encryptedHexStr = CryptoJs.enc.Hex.parse(word)
  const srcs = CryptoJs.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJs.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJs.mode.CBC, padding: CryptoJs.pad.Pkcs7 })
  const decryptedStr = decrypt.toString(CryptoJs.enc.Utf8)
  return decryptedStr.toString()
}

// 加密方法
export function encryptAesForShare(word) {
  const srcs = CryptoJs.enc.Utf8.parse(word)
  const encrypted = CryptoJs.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJs.mode.CBC, padding: CryptoJs.pad.Pkcs7 })
  return encrypted.ciphertext.toString().toUpperCase()
}
