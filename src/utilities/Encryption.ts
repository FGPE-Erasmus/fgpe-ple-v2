import CryptoJS from "crypto-js";
const salt = "gj.8@8PS6NeG";

//The Function Below To Encrypt Text
export const encryptWithAES = (text: any, userEmail: string) => {
  const passphrase = `FGPE_${userEmail}_${salt}`;
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};
//The Function Below To Decrypt Text
export const decryptWithAES = (ciphertext: any, userEmail: string) => {
  const passphrase = `FGPE_${userEmail}_${salt}`;
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
