import CryptoJS from 'crypto-js';
import { secretKey } from '@/config/token.js';
import { message } from 'antd';

/**
 * Encrypted information, local storage
 * @param {String} key Local Storage Key
 * @param {Object} info user information
 */
export async function setLoginInfo(key, info) {
  if (key.length && JSON.stringify(info) !== '{}') {
    // 1.Value to be stored 2.Encrypted secret key (decryption must be based on the secret key in order to decrypt)
    let cipherText = CryptoJS.AES.encrypt(
      JSON.stringify(info),
      secretKey
    ).toString();
    localStorage.setItem(key, cipherText); //local storage
    return true;
  } else {
    message.error('Network error, please try again later');
    return false;
  }
}

/**
 * Retrieve the encrypted message
 * @param {String} key local storage key
 */
export function getLoginInfo(key) {
  if (key.length) {
    /* Retrieve the encrypted value */
    let tk = localStorage.getItem(key); //Remove the stored value
    let bytes = CryptoJS.AES.decrypt(tk, secretKey);
    let originalText = bytes.toString(CryptoJS.enc.Utf8); //Decryption operations
    return JSON.parse(originalText);
  }
}

/**
 * Clear login status
 */
export function clearLoginState() {
  localStorage.clear()
  window.location.reload()
}
