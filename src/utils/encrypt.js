import CryptoJs from 'crypto-js'

// AES加密
export const encryptAes = (message, key) => {
  const options = {
    iv: CryptoJs.enc.Utf8.parse('abcdef0abcdef0123456789123456789'),
    mode: CryptoJs.mode.CBC,
    padding: CryptoJs.pad.Pkcs7
  }
  return CryptoJs.AES.encrypt(message, '@node-king!', options).toString()
}
