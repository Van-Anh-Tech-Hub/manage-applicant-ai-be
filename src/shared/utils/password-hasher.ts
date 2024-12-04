import * as CryptoJS from "crypto-js";

const hashSeparator = "$";

export const passwordHasher = {
  hashPassword: (password: string): string => {
    const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);  // Use Base64 encoding for salt
    const hash = CryptoJS.SHA256(password + salt).toString(CryptoJS.enc.Base64);  // Use Base64 encoding for hash
    return `${salt}${hashSeparator}${hash}`;
  },

  verifyPassword: (password: string, storedHash: string): boolean => {
    const [salt, hash] = storedHash.split(hashSeparator);
    const inputHash = CryptoJS.SHA256(password + salt).toString(CryptoJS.enc.Base64); // Use Base64 encoding for hash
    return inputHash === hash;
  }
};
