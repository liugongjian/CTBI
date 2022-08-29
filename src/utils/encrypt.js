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
