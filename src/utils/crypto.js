import CryptoJS from 'crypto-js';
import { MAX_FILE_SIZE, MAX_TEXT_LENGTH } from './constants';

/* ── VALIDATION ── */
export const validateFileSize = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  if (file.size > MAX_FILE_SIZE) return { valid: false, error: `File too large (max ${formatSize(MAX_FILE_SIZE)})` };
  return { valid: true };
};

export const validateText = (text) => {
  if (!text) return { valid: false, error: 'Input cannot be empty' };
  if (text.length > MAX_TEXT_LENGTH) return { valid: false, error: `Input too long (max ${MAX_TEXT_LENGTH.toLocaleString()} chars)` };
  return { valid: true };
};

export const validateBase64 = (str) => { try { atob(str); return true; } catch { return false; } };
export const validateHex = (str) => /^[0-9a-fA-F]*$/.test(str);

/* ── SANITIZATION ── */
export const sanitize = (s) => typeof s !== 'string' ? '' : s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ── CLIPBOARD ── */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(area);
  area.focus();
  area.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(area);
  if (!ok) throw new Error('Copy failed');
};

/* ── FILE I/O ── */
export const readFile = (file) => new Promise((resolve, reject) => {
  const v = validateFileSize(file);
  if (!v.valid) return reject(new Error(v.error));
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = () => reject(new Error('File read failed'));
  r.readAsArrayBuffer(file);
});

export const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + s[i];
};

/* ── HASHING ── */
const toWordArray = (ab) => {
  const u8 = new Uint8Array(ab);
  const words = [];
  for (let i = 0; i < u8.length; i += 4) {
    words.push((u8[i] << 24) | (u8[i + 1] << 16) | (u8[i + 2] << 8) | u8[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(words, u8.length);
};

export const computeHash = (data, algo) => {
  const input = typeof data === 'string' ? data : toWordArray(data);
  const fns = {
    'MD5': () => CryptoJS.MD5(input),
    'SHA-1': () => CryptoJS.SHA1(input),
    'SHA-224': () => CryptoJS.SHA224(input),
    'SHA-256': () => CryptoJS.SHA256(input),
    'SHA-384': () => CryptoJS.SHA384(input),
    'SHA-512': () => CryptoJS.SHA512(input),
    'SHA3-256': () => CryptoJS.SHA3(input, { outputLength: 256 }),
    'SHA3-512': () => CryptoJS.SHA3(input, { outputLength: 512 }),
    'RIPEMD-160': () => CryptoJS.RIPEMD160(input),
  };
  const fn = fns[algo];
  if (!fn) throw new Error(`Unsupported algorithm: ${algo}`);
  return fn().toString();
};

/* ── ENCODING ── */
export const processEncoding = (input, mode) => {
  switch (mode) {
    case 'base64-encode': return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input));
    case 'base64-decode':
      if (!validateBase64(input)) throw new Error('Invalid Base64');
      return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(input));
    case 'hex-encode': return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(input));
    case 'hex-decode':
      if (!validateHex(input)) throw new Error('Invalid Hex');
      return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(input));
    case 'url-encode': return encodeURIComponent(input);
    case 'url-decode': return decodeURIComponent(input);
    default: throw new Error('Unknown mode');
  }
};

/* ── PASSWORD ── */
export const analyzePassword = (pwd) => {
  if (!pwd) return null;
  const checks = {
    length: pwd.length,
    lower: /[a-z]/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  };
  let score = 0;
  if (checks.length >= 8) score += 1;
  if (checks.length >= 12) score += 1;
  if (checks.length >= 16) score += 1;
  if (checks.lower) score += 1;
  if (checks.upper) score += 1;
  if (checks.number) score += 1;
  if (checks.special) score += 2;
  const common = ['123', 'abc', 'qwerty', 'password', '111', 'aaa'];
  if (common.some(p => pwd.toLowerCase().includes(p))) score -= 2;
  score = Math.max(0, Math.min(10, score));
  const labels = [
    [8, 'Very Strong', 'emerald'],
    [6, 'Strong', 'green'],
    [4, 'Medium', 'amber'],
    [2, 'Weak', 'orange'],
    [0, 'Very Weak', 'red'],
  ];
  const [, label, color] = labels.find(([min]) => score >= min);
  return { ...checks, score, label, color };
};

export const generatePassword = (len = 20) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  const limit = 256 - (256 % chars.length); // rejection sampling to eliminate modulo bias
  const result = [];
  while (result.length < len) {
    const arr = new Uint8Array(len * 2);
    crypto.getRandomValues(arr);
    for (let i = 0; i < arr.length && result.length < len; i++) {
      if (arr[i] < limit) result.push(chars[arr[i] % chars.length]);
    }
  }
  return result.join('');
};
